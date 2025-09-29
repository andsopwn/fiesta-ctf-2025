import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { documentService } from '../services/documentService';
import { ArrowLeft, Calendar, User, Eye, Tag, Download, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const DocumentDetailPage = () => {
  const { id } = useParams();
  
  const { data: document, isLoading, error } = useQuery(
    ['document', id],
    () => documentService.getDocument(id),
    { enabled: !!id }
  );

  const handleDownloadPDF = async () => {
    if (!document?.file_path) {
      toast.error('PDF 파일이 없습니다.');
      return;
    }

    try {
      toast.loading('PDF를 다운로드하고 있습니다...');
      
      // PDF 다운로드 URL 생성
      const pdfUrl = documentService.getPdfDownloadUrl(document.file_path);
      
      // 새 창에서 PDF 다운로드
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${document.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('PDF가 성공적으로 다운로드되었습니다.');
    } catch (error) {
      console.error('PDF 다운로드 오류:', error);
      toast.error('PDF 다운로드 중 오류가 발생했습니다.');
    }
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

  if (error || !document) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">문서를 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-6">요청하신 문서가 존재하지 않거나 삭제되었습니다.</p>
            <Link
              to="/documents"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="mr-2" size={16} />
              문서 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link
            to="/documents"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="mr-2" size={16} />
            문서 목록으로 돌아가기
          </Link>
        </div>

        {/* 문서 헤더 */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {document.category_name || '기타'}
                </span>
                {document.is_featured && (
                  <span className="flex items-center text-yellow-600 text-sm">
                    <Star size={16} className="mr-1" />
                    추천 문서
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {document.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                {document.author && (
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    {document.author}
                  </div>
                )}
                {document.publication_date && (
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {new Date(document.publication_date).toLocaleDateString()}
                  </div>
                )}
                <div className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  조회수 {document.view_count}
                </div>
              </div>

              {document.tags && (
                <div className="flex items-center flex-wrap gap-2">
                  <Tag size={16} className="text-gray-400" />
                  {document.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="flex flex-col space-y-2 ml-6">
              {document.file_path && (
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  PDF 다운로드
                </button>
              )}
            </div>
          </div>

          {/* 요약 */}
          {document.summary && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">요약</h3>
              <p className="text-blue-800 leading-relaxed">{document.summary}</p>
            </div>
          )}
        </div>

        {/* 문서 내용 */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">문서 내용</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {document.content}
            </div>
          </div>
        </div>

        {/* 관련 정보 */}
        {document.source && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">출처</h3>
            <p className="text-gray-600">{document.source}</p>
          </div>
        )}

        {/* AI 챗봇 안내 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🤖 AI 챗봇과 함께 더 깊이 알아보기
            </h3>
            <p className="text-gray-600 mb-4">
              이 문서에 대해 궁금한 점이 있으신가요? AI 챗봇이 문서 내용을 바탕으로 
              질문에 답변해드립니다. 오른쪽 하단의 챗봇 버튼을 클릭해보세요!
            </p>
            <div className="text-sm text-gray-500">
              💡 팁: "이 문서의 핵심 내용을 요약해주세요" 또는 "관련 법규에 대해 설명해주세요"와 같이 질문해보세요.
            </div>
          </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
