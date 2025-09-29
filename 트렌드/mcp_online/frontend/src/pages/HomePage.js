import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { documentService } from '../services/documentService';
import { TrendingUp, Users, FileText, BarChart3, ArrowRight, Star } from 'lucide-react';

const HomePage = () => {
  const { data: featuredDocs, isLoading: docsLoading } = useQuery(
    'featured-documents',
    () => documentService.getDocuments({ isFeatured: true, limit: 6 })
  );


  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              국내 금융 정보 웹 도서관
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              금융 정책, 은행업, 증권업, 보험업, 핀테크 등<br />
              다양한 금융 분야의 전문 정보를 한 곳에서
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/documents"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                금융정보 둘러보기
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 추천 문서 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              추천 금융 정보
            </h2>
            <p className="text-lg text-gray-600">
              전문가가 선별한 핵심 금융 정보를 확인해보세요
            </p>
          </div>

          {docsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">문서를 불러오는 중...</p>
            </div>
          ) : featuredDocs?.documents?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDocs.documents.map((doc) => (
                <div key={doc.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {doc.category_name || '기타'}
                    </span>
                    <span className="flex items-center text-yellow-600 text-sm">
                      <Star size={16} className="mr-1" />
                      추천
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link
                      to={`/documents/${doc.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {doc.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {doc.summary || doc.content?.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>조회수 {doc.view_count}</span>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      자세히 보기 →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">추천 문서가 없습니다</h3>
              <p className="text-gray-600">곧 새로운 추천 문서를 추가할 예정입니다.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/documents"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              모든 문서 보기
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            AI 챗봇과 함께하는 스마트한 금융 정보 탐색
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            복잡한 금융 정보를 AI가 쉽게 설명해드립니다.<br />
            궁금한 내용을 언제든지 물어보세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/documents"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              금융정보 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
