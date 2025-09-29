import api from './api';

export const documentService = {
  // 문서 목록 조회 (검색, 필터링, 페이지네이션 지원)
  getDocuments: async (params = {}) => {
    try {
      const response = await api.get('/documents', { 
        params: {
          query: params.query || undefined,
          category_id: params.categoryId || undefined,
          tags: params.tags || undefined,
          is_featured: params.isFeatured || undefined,
          page: params.page || 1,
          limit: params.limit || 20
        }
      });
      return response.data;
    } catch (error) {
      console.error('문서 목록 조회 오류:', error);
      throw error;
    }
  },

  // 특정 문서 조회
  getDocument: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('문서 조회 오류:', error);
      throw error;
    }
  },

  // 카테고리 목록 조회
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('카테고리 조회 오류:', error);
      throw error;
    }
  },

  // PDF 다운로드 URL 생성
  getPdfDownloadUrl: (filePath) => {
    if (!filePath) return null;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    return `${baseUrl}/pdfs/${filePath}`;
  },

  // 검색 제안 (실제 구현은 백엔드에서 지원하는 경우)
  getSearchSuggestions: async (query) => {
    try {
      // 간단한 검색 제안을 위해 문서 제목에서 추출
      const response = await api.get('/documents', {
        params: {
          query: query,
          limit: 5
        }
      });
      return response.data.documents.map(doc => doc.title);
    } catch (error) {
      console.error('검색 제안 오류:', error);
      return [];
    }
  },

  // 문서 생성 (관리자 기능)
  createDocument: async (document) => {
    try {
      const response = await api.post('/documents', document);
      return response.data;
    } catch (error) {
      console.error('문서 생성 오류:', error);
      throw error;
    }
  },

  // 문서 수정 (관리자 기능)
  updateDocument: async (id, document) => {
    try {
      const response = await api.put(`/documents/${id}`, document);
      return response.data;
    } catch (error) {
      console.error('문서 수정 오류:', error);
      throw error;
    }
  },

  // 문서 삭제 (관리자 기능)
  deleteDocument: async (id) => {
    try {
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('문서 삭제 오류:', error);
      throw error;
    }
  }
};
