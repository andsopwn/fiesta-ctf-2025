import api from './api';

export const chatService = {
  sendMessage: async (messages) => {
    try {
      const response = await api.post('/chat', {
        messages: messages
      });
      return response.data;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  },

  // 단일 메시지 전송 (기존 호환성 유지)
  sendSingleMessage: async (message, sessionId = null) => {
    const messages = [
      {
        role: "user",
        content: message
      }
    ];
    return await chatService.sendMessage(messages);
  }
};
