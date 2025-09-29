import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 로고 및 설명 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🏦</span>
              </div>
              <span className="text-xl font-bold">금융정보도서관</span>
            </div>
            <p className="text-gray-300 mb-4">
              국내 금융 정보를 한 곳에서 모아보는 웹 도서관입니다. 
              금융 정책, 은행업, 증권업, 보험업, 핀테크 등 다양한 금융 분야의 
              전문 정보를 제공합니다.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:contact@financial-library.kr" className="text-gray-300 hover:text-white transition-colors" title="이메일 문의">
                <Mail size={20} />
              </a>
              <a href="tel:02-1234-5678" className="text-gray-300 hover:text-white transition-colors" title="전화 문의">
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-gray-300 hover:text-white transition-colors">
                  금융정보
                </Link>
              </li>
            </ul>
          </div>

          {/* 카테고리 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">주요 카테고리</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">금융정책</li>
              <li className="text-gray-300">은행업</li>
              <li className="text-gray-300">증권업</li>
              <li className="text-gray-300">보험업</li>
              <li className="text-gray-300">핀테크</li>
              <li className="text-gray-300">금융투자</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 국내 금융 정보 웹 도서관. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                개인정보처리방침
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                이용약관
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
