from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from database import Base

# SQLAlchemy ORM 모델들

class CategoryTable(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime)

class FinancialDocumentTable(Base):
    __tablename__ = "financial_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text)
    category_id = Column(Integer, ForeignKey("categories.id"))
    author = Column(String(200))
    source = Column(String(200))
    publication_date = Column(Date)
    tags = Column(Text)
    view_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)


# 카테고리 관련 모델
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# 금융 정보 문서 관련 모델
class FinancialDocumentBase(BaseModel):
    title: str
    content: str
    author: Optional[str] = None
    source: Optional[str] = None
    publication_date: Optional[date] = None
    tags: Optional[str] = None
    is_featured: bool = False

class FinancialDocumentCreate(FinancialDocumentBase):
    category_id: Optional[int] = None

class FinancialDocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    category_id: Optional[int] = None
    author: Optional[str] = None
    source: Optional[str] = None
    publication_date: Optional[date] = None
    tags: Optional[str] = None
    is_featured: Optional[bool] = None

class FinancialDocument(FinancialDocumentBase):
    id: int
    summary: Optional[str] = None
    category_id: Optional[int] = None
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AtomicMsg(BaseModel):
    role: str
    content: str

class Message(BaseModel):
    messages: List[AtomicMsg]


# 검색 및 필터링 모델
class DocumentSearch(BaseModel):
    query: Optional[str] = None
    category_id: Optional[int] = None
    tags: Optional[str] = None
    is_featured: Optional[bool] = None
    page: int = 1
    limit: int = 20

class DocumentListResponse(BaseModel):
    documents: List[FinancialDocument]
    total: int
    page: int
    limit: int
    total_pages: int
