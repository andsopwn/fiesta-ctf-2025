import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { MessageCircle, X, Send, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // 기존 메시지에 새 사용자 메시지 추가
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 백엔드 API 형식에 맞게 메시지 배열 생성
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await chatService.sendMessage(apiMessages);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('챗봇 응답 오류:', error);
      const errorMessage = error.response?.data?.detail || error.message || '알 수 없는 오류가 발생했습니다.';
      toast.error(`챗봇 응답 오류: ${errorMessage}`);
      
      // 오류 메시지도 표시
      const errorBotMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `죄송합니다. 오류가 발생했습니다: ${errorMessage}`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  // 모든 사용자에게 챗봇 표시

  return (
    <>
      {/* 챗봇 버튼 */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* 펄스 애니메이션 링 */}
        {!isOpen && (
          <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping opacity-75"></div>
        )}
        
        {/* 메인 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-14 h-14 text-white rounded-full shadow-2xl 
            transform transition-all duration-300 hover:scale-110 hover:rotate-3
            ${isOpen 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }
            group flex items-center justify-center
            before:absolute before:inset-0 before:rounded-full 
            before:bg-gradient-to-r before:from-white/20 before:to-transparent 
            before:opacity-0 hover:before:opacity-100 before:transition-opacity
          `}
        >
          <div className="transform transition-transform duration-200 group-hover:scale-110">
            {isOpen ? (
              <X size={24} className="drop-shadow-lg" />
            ) : (
              <MessageCircle size={24} className="drop-shadow-lg animate-pulse" />
            )}
          </div>
          
          {/* 미니 알림 점 (새 메시지 있을 때) */}
          {!isOpen && messages.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce">
              <div className="w-full h-full bg-red-400 rounded-full animate-ping"></div>
            </div>
          )}
        </button>
        
        {/* 툴팁 */}
        {!isOpen && (
          <div className="absolute bottom-16 right-0 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                         whitespace-nowrap pointer-events-none">
            💰 AI 금융 상담사
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 
                           border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* 챗봇 패널 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200/50 z-40 flex flex-col 
                       backdrop-blur-sm animate-slideInUp overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-t-2xl relative">
            {/* 배경 장식 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12"></div>
            
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">AI 금융상담사</span>
                <div className="flex items-center space-x-1 text-xs text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>온라인</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 relative z-10">
              <button
                onClick={clearChat}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 
                          transition-all duration-200 hover:scale-110 group"
                title="대화 초기화"
              >
                <FileText size={14} className="group-hover:rotate-12 transition-transform duration-200" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/80 
                          transition-all duration-200 hover:scale-110 group"
              >
                <X size={14} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <p className="font-semibold text-gray-700 mb-2">안녕하세요! 금융 정보에 대해 무엇이든 물어보세요.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 inline-block">
                  📊 예: "금융정책에 대해 알려주세요"
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`flex items-end space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* 아바타 */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {message.type === 'user' ? '👤' : '🤖'}
                  </div>
                  
                  {/* 메시지 버블 */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm shadow-sm relative ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                        : message.isError
                        ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {message.content}
                    
                    {/* 오류 메시지 아이콘 */}
                    {message.isError && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    )}
                    
                    {/* 메시지 꼬리 */}
                    <div className={`absolute bottom-0 w-0 h-0 ${
                      message.type === 'user'
                        ? 'right-0 border-l-8 border-t-8 border-blue-600 border-transparent border-t-blue-600'
                        : message.isError
                        ? 'left-0 border-r-8 border-t-8 border-red-50 border-transparent border-t-red-50'
                        : 'left-0 border-r-8 border-t-8 border-white border-transparent border-t-white'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-end space-x-2 max-w-xs">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs shadow-md">
                    🤖
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm text-sm shadow-sm relative">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-gray-500 ml-2">입력중...</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-0 border-r-8 border-t-8 border-white border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-full 
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           text-sm bg-white shadow-sm transition-all duration-200
                           hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
                  disabled={isLoading}
                />
                
                {/* 입력창 내부 아이콘 */}
                {inputMessage.trim() && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">💰</span>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className={`
                  w-12 h-12 rounded-full shadow-lg flex items-center justify-center
                  transition-all duration-200 transform hover:scale-105 group
                  ${!inputMessage.trim() || isLoading
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer'
                  }
                  disabled:opacity-50 disabled:transform-none
                `}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={18} className={`${
                    !inputMessage.trim() ? 'text-gray-500' : 'text-white group-hover:translate-x-0.5 transition-transform duration-200'
                  }`} />
                )}
              </button>
            </form>
            
            {/* 하단 힌트 텍스트 */}
            <div className="mt-2 text-xs text-gray-400 text-center">
              <span>💹 Enter로 전송 • AI가 금융 정보를 도와드립니다</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
