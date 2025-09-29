import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { documentService } from '../services/documentService';
import { Search, Filter, Calendar, Eye, Star, FileText } from 'lucide-react';

const DocumentListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    category_id: searchParams.get('category_id') || '',
    is_featured: searchParams.get('is_featured') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  const { data: categories } = useQuery('categories', documentService.getCategories);
  const { data: documents, isLoading, error } = useQuery(
    ['documents', filters],
    () => documentService.getDocuments(filters),
    { keepPreviousData: true }
  );

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ query: '', category_id: '', is_featured: '', page: 1 });
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h2>
            <p className="text-gray-600">문서를 불러오는 중 문제가 발생했습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">금융 정보</h1>
          <p className="text-gray-600">다양한 금융 분야의 전문 정보를 검색하고 탐색해보세요.</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 검색어 */}
            <div className="md:col-span-2">
              <label className="form-label">검색어</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  placeholder="제목, 내용, 요약으로 검색..."
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* 카테고리 */}
            <div>
              <label className="form-label">카테고리</label>
              <select
                value={filters.category_id}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                className="form-select"
              >
                <option value="">전체 카테고리</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 추천 문서 */}
            <div>
              <label className="form-label">추천 문서</label>
              <select
                value={filters.is_featured}
                onChange={(e) => handleFilterChange('is_featured', e.target.value)}
                className="form-select"
              >
                <option value="">전체</option>
                <option value="true">추천 문서만</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              총 {documents?.total || 0}개의 문서
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              필터 초기화
            </button>
          </div>
        </div>

        {/* 문서 목록 */}
        <div className="space-y-6">
          {documents?.documents?.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 검색어나 필터를 시도해보세요.</p>
            </div>
          ) : (
            documents?.documents?.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {doc.category_name || '기타'}
                    </span>
                    {doc.is_featured && (
                      <span className="flex items-center text-yellow-600 text-sm">
                        <Star size={16} className="mr-1" />
                        추천
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Eye size={16} className="mr-1" />
                    {doc.view_count}
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  <Link
                    to={`/documents/${doc.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {doc.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {doc.summary || doc.content?.substring(0, 200) + '...'}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {doc.author && (
                      <span>작성자: {doc.author}</span>
                    )}
                    {doc.publication_date && (
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(doc.publication_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/documents/${doc.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    자세히 보기 →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        {documents?.total_pages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              
              {Array.from({ length: Math.min(5, documents.total_pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filters.page === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === documents.total_pages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentListPage;
