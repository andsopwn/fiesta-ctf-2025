from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import List, Optional
import os
import pathlib
from database import SessionLocal, Base, engine
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import OperationalError, DisconnectionError
from models import *
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langchain_mcp_adapters.client import MultiServerMCPClient
import logging
import re
import magic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



def get_db():
    db_session = SessionLocal()
    try:
        yield db_session
    except (OperationalError, DisconnectionError) as e:
        logger.error(f"Database connection error: {e}")
        db_session.rollback()

        db_session.close()
        db_session = SessionLocal()
        yield db_session
    finally:
        db_session.close()

def execute_with_retry(session, query, params=None, max_retries=3):
    for attempt in range(max_retries):
        try:
            if params:
                result = session.execute(text(query), params)
            else:
                result = session.execute(text(query))
            return result
        except (OperationalError, DisconnectionError) as e:
            logger.warning(f"Database query attempt {attempt + 1} failed: {e}")
            if attempt == max_retries - 1:
                raise e
            session.rollback()
            session.close()
            session = SessionLocal()

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Financial Library API",
    description="국내 금융 정보 웹 도서관 API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None
)

@app.middleware("http")
async def add_charset_middleware(request, call_next):
    response = await call_next(request)
    if response.headers.get("content-type", "").startswith("application/json"):
        response.headers["content-type"] = "application/json; charset=utf-8"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80", "http://10.1.1.80", "http://10.1.1.80:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/categories", response_model=List[Category])
async def get_categories(session: Session = Depends(get_db)):
    try:
        result = execute_with_retry(session, "SELECT * FROM categories ORDER BY name")
        categories = [{"id": row.id, "name": row.name, "description": row.description, "created_at": row.created_at} for row in result.fetchall()]
        return categories
    except Exception as e:
        logger.error(f"Error getting categories: {e}")
        return []

@app.get("/documents", response_model=DocumentListResponse)
async def get_documents(
    query: Optional[str] = Query(None),
    category_id: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    is_featured: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    
    if category_id == "":
        category_id = None
    elif category_id is not None:
        try:
            category_id = int(category_id)
        except ValueError:
            category_id = None
    
    if is_featured == "":
        is_featured = None
    elif is_featured is not None:
        is_featured = is_featured.lower() in ('true', '1', 'yes', 'on')
    
    base_query = """
        SELECT fd.*, c.name as category_name 
        FROM financial_documents fd 
        LEFT JOIN categories c ON fd.category_id = c.id
        WHERE 1=1
    """
    params = []
    
    if query:
        base_query += " AND (fd.title LIKE %s OR fd.content LIKE %s OR fd.summary LIKE %s)"
        search_term = f"%{query}%"
        params.extend([search_term, search_term, search_term])
    
    if category_id:
        base_query += " AND fd.category_id = %s"
        params.append(category_id)
    
    if tags:
        base_query += " AND fd.tags LIKE %s"
        params.append(f"%{tags}%")
    
    if is_featured is not None:
        base_query += " AND fd.is_featured = %s"
        params.append(is_featured)
    
    sql_params = {}
    sql_base_query = """SELECT fd.*, c.name as category_name 
        FROM financial_documents fd 
        LEFT JOIN categories c ON fd.category_id = c.id
        WHERE 1=1"""
    
    if query:
        sql_base_query += " AND (fd.title LIKE :search_term OR fd.content LIKE :search_term OR fd.summary LIKE :search_term)"
        sql_params["search_term"] = f"%{query}%"
    
    if category_id:
        sql_base_query += " AND fd.category_id = :category_id"
        sql_params["category_id"] = category_id
    
    if tags:
        sql_base_query += " AND fd.tags LIKE :tags"
        sql_params["tags"] = f"%{tags}%"
    
    if is_featured is not None:
        sql_base_query += " AND fd.is_featured = :is_featured"
        sql_params["is_featured"] = is_featured
    
    count_query = f"SELECT COUNT(*) as total FROM ({sql_base_query}) as count_query"
    try:
        total_result = execute_with_retry(session, count_query, sql_params)
        total_row = total_result.fetchone()
        total = total_row.total if total_row else 0
    except Exception as e:
        logger.error(f"Error executing count query: {e}")
        total = 0
    
    sql_base_query += " ORDER BY fd.created_at DESC LIMIT :limit OFFSET :offset"
    sql_params.update({"limit": limit, "offset": offset})
    
    try:
        result = execute_with_retry(session, sql_base_query, sql_params)
        documents = [dict(row._mapping) for row in result.fetchall()]
    except Exception as e:
        logger.error(f"Error executing documents query: {e}")
        documents = []
    
    if documents is None:
        documents = []
        total = 0
    
    return DocumentListResponse(
        documents=documents,
        total=total,
        page=page,
        limit=limit,
        total_pages=(total + limit - 1) // limit if total > 0 else 0
    )

@app.get("/documents/{document_id}", response_model=FinancialDocument)
async def get_document(document_id: int, session: Session = Depends(get_db)):
    try:
        update_query = "UPDATE financial_documents SET view_count = view_count + 1 WHERE id = :document_id"
        execute_with_retry(session, update_query, {"document_id": document_id})
        session.commit()
        
        query = """
            SELECT fd.*, c.name as category_name 
            FROM financial_documents fd 
            LEFT JOIN categories c ON fd.category_id = c.id
            WHERE fd.id = :document_id
        """
        result = execute_with_retry(session, query, {"document_id": document_id})
        row = result.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다")
        
        return FinancialDocument(**dict(row._mapping))
    except Exception as e:
        logger.error(f"Error getting document {document_id}: {e}")
        raise HTTPException(status_code=500, detail="문서를 조회하는 중 오류가 발생했습니다")


org = os.getenv("ORG")
api_key = os.getenv("API_KEY")
model = ChatOpenAI(
    organization=org,
    api_key=api_key,
    model="gpt-4.1-mini"
)

@app.post("/chat")
async def chat_request(Messages: Message, db: Session = Depends(get_db)):
    try:
        # Initialize chat model and tools
        client = MultiServerMCPClient({
                "paperlibrary": {
                    "url": "http://mcp_server:8001/mcp/",
                    "transport": "streamable_http",
                }
        }) 
        tools = await client.get_tools()
            
        system_prompt = """
당신은 금융정보도서관의 전문 AI 어시스턴트입니다.

사용자가 요구하는 기능을 MCP 서버를 사용하여 처리합니다.

다음과 같은 금융 분야에 대해 전문적이고 정확한 정보를 제공해주세요:
- 금융정책 (한국은행, 금융위원회 정책)
- 은행업 (예금, 대출, 금융상품)  
- 증권업 (주식, 채권, 투자)
- 보험업 (생명보험, 손해보험)
- 핀테크 (디지털금융, 간편결제)
- 금융투자 (펀드, 파생상품)
- 부동산금융 (주택담보대출, 부동산투자)
- 기업금융 (기업대출, M&A)
- 소비자금융 (신용카드, 개인대출)
- 국제금융 (외환, 환율)


"""

        agent = create_react_agent(model, tools, prompt=system_prompt)
        
        langchain_messages = []
        for msg in Messages.messages:
            if msg.role == "user":
                langchain_messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                langchain_messages.append(AIMessage(content=msg.content))

        response = await agent.ainvoke({"messages": langchain_messages})
        reply = response["messages"][-1].content
        return {"reply": reply}


    except Exception as e:
        print(f"Chat error: {e}")
        return {"reply": f"죄송합니다. 오류가 발생했습니다: {str(e)}"}


@app.get("/pdfs/{file_path:path}")
async def download_pdf(file_path: str):
    safe_filename = re.sub(r'[\.]{2,}[\/\\]', '', file_path)
    safe_filename = safe_filename.replace('..', '').replace('\\', '/')
    
    filename = pathlib.Path(safe_filename).name
    
    if not filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="PDF 파일만 다운로드 가능합니다")
    
    if not re.match(r'^[a-zA-Z0-9_-]+\.pdf$', filename):
        raise HTTPException(status_code=400, detail="유효하지 않은 파일명입니다")
    
    pdfs_dir = "/pdfs"
    resolved_file_path = os.path.join(pdfs_dir, filename)
    
    if not os.path.abspath(resolved_file_path).startswith(os.path.abspath(pdfs_dir)):
        raise HTTPException(status_code=403, detail="접근이 금지된 경로입니다")
    
    if not os.path.exists(resolved_file_path):
        logger.warning(f"PDF download attempt for non-existent file: {filename}")
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")
    logger.info(f"PDF download: {filename}")
    
    mime_type = magic.from_file(resolved_file_path, mime=True)
    if mime_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="유효하지 않은 PDF 파일입니다")
    
    
    return FileResponse(
        resolved_file_path, 
        filename=filename,
        media_type='application/pdf',
        headers={
            'Content-Disposition': f'attachment; filename="{filename}"',
            'X-Content-Type-Options': 'nosniff'
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
