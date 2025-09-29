from typing import List, Dict, Any, Optional
from fastmcp import FastMCP
import pymysql
from pymysql import Error
from pymysql.cursors import DictCursor
import openai
from dotenv import load_dotenv
import pdfkit
import requests
import os
import uuid

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
server_url = os.getenv("SERVER_URL", "http://localhost/pdfs")

DB_CONFIG = {
    'host': os.getenv("DB_HOST", "financial_library_mysql"),
    'database': os.getenv("DB_NAME", "financial_library"),
    'user': os.getenv("DB_USER", "financialuser"),
    'password': os.getenv("DB_PASSWORD", "financialpass"),
    'port': int(os.getenv("DB_PORT", "3306")),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

mcp = FastMCP("Financial Library MCP Server")

def get_db_connection():
    """데이터베이스 연결"""
    try:
        connection = pymysql.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"데이터베이스 연결 오류: {e}")
        return None

def execute_query(query: str, params: tuple = None):
    """데이터베이스 쿼리 실행"""
    connection = get_db_connection()
    if not connection:
        return None
    
    try:
        cursor = connection.cursor(DictCursor)
        cursor.execute(query, params)
        
        if query.strip().upper().startswith('SELECT'):
            result = cursor.fetchall()
        else:
            connection.commit()
            result = cursor.lastrowid
        
        cursor.close()
        connection.close()
        return result
    except Error as e:
        print(f"쿼리 실행 오류: {e}")
        if connection:
            connection.close()
        return None

@mcp.tool()
def search_financial_documents(query: str, category_id: Optional[int] = None, limit: int = 10) -> List[Dict[str, Any]]:
    """금융 정보 문서 검색"""
    base_query = """
        SELECT fd.*, c.name as category_name 
        FROM financial_documents fd 
        LEFT JOIN categories c ON fd.category_id = c.id
        WHERE (fd.title LIKE %s OR fd.content LIKE %s OR fd.summary LIKE %s)
    """
    params = [f"%{query}%", f"%{query}%", f"%{query}%"]
    
    if category_id:
        base_query += " AND fd.category_id = %s"
        params.append(category_id)
    
    base_query += " ORDER BY fd.created_at DESC LIMIT %s"
    params.append(limit)
    
    results = execute_query(base_query, tuple(params))
    return results or []

@mcp.tool()
def get_financial_document_by_id(document_id: int) -> Optional[Dict[str, Any]]:
    """ID로 금융 정보 문서 조회"""
    query = """
        SELECT fd.*, c.name as category_name 
        FROM financial_documents fd 
        LEFT JOIN categories c ON fd.category_id = c.id
        WHERE fd.id = %s
    """
    results = execute_query(query, (document_id,))
    return results[0] if results else None

@mcp.tool()
def get_recent_documents(limit: int = 10) -> List[Dict[str, Any]]:
    """최신 금융 정보 문서 조회"""
    query = """
        SELECT fd.*, c.name as category_name 
        FROM financial_documents fd 
        LEFT JOIN categories c ON fd.category_id = c.id
        ORDER BY fd.created_at DESC
        LIMIT %s
    """
    results = execute_query(query, (limit,))
    return results or []

@mcp.tool()
def get_page_content_from_url(url: str) -> str:
    """주어진 URL의 페이지 내용을 추출"""
    resp = requests.get(url)
    if resp.status_code != 200:
        return "URL 페이지 내용을 추출할 수 없습니다."
    return resp.text

@mcp.tool()
def generate_document_to_pdf(source_html: str, output_path: str = None) -> str:
    """주어진 HTML 페이지를 PDF로 생성"""
    content = source_html
    if not content:
        return "문서 내용이 없습니다."
    
    file_name = f"{uuid.uuid4().hex[:16]}.pdf"
    if not output_path:
        output_path = f"/pdfs/{file_name}"
    
    try:
        pdfkit.from_string(content, output_path)
        
        return f"PDF가 성공적으로 생성되었습니다, 다운로드 주소: `{server_url}pdfs/{file_name}`"
    except Exception as e:
        return f"PDF 생성 중 오류가 발생했습니다: {str(e)}"

if __name__ == "__main__":
    mcp.run(transport="streamable-http", host="0.0.0.0", port=8001, path="/mcp")
