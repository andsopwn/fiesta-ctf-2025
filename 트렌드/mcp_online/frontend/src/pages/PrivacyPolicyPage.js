import React from 'react';
import { Shield, Calendar, Mail, Phone } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-blue-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">개인정보처리방침</h1>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar size={16} />
              <span>시행일자: 2024년 1월 1일</span>
            </div>
          </div>

          {/* 내용 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              
              {/* 제1조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제1조 (개인정보의 처리목적)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  금융정보도서관(이하 "회사"라 함)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                  <li>회원자격 유지·관리, 서비스 부정이용 방지</li>
                  <li>각종 고지·통지, 고충처리 등을 위한 의사소통 경로 확보</li>
                  <li>금융정보 맞춤형 서비스 제공</li>
                  <li>마케팅 및 광고에 활용</li>
                </ul>
              </section>

              {/* 제2조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">보유기간</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>회원정보: 회원 탈퇴 시까지</li>
                    <li>서비스 이용기록: 3년</li>
                    <li>고객 상담 기록: 3년</li>
                    <li>마케팅 활용 동의: 동의 철회 시까지</li>
                  </ul>
                </div>
              </section>

              {/* 제3조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제3조 (처리하는 개인정보 항목)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 다음의 개인정보 항목을 처리하고 있습니다.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">필수항목</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>이름, 아이디, 비밀번호</li>
                    <li>이메일주소, 전화번호</li>
                    <li>서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                  </ul>
                </div>
              </section>

              {/* 제4조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제4조 (개인정보의 제3자 제공)</h2>
                <p className="text-gray-700 leading-relaxed">
                  회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </p>
              </section>

              {/* 제5조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제5조 (개인정보처리의 위탁)</h2>
                <p className="text-gray-700 leading-relaxed">
                  회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-gray-700">
                    <strong>위탁업체:</strong> 클라우드 서비스 제공업체<br />
                    <strong>위탁업무:</strong> 서버 운영 및 관리<br />
                    <strong>보유기간:</strong> 위탁계약 종료 시까지
                  </p>
                </div>
              </section>

              {/* 제6조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>개인정보 처리현황 통지요구</li>
                  <li>개인정보 처리정지 요구</li>
                  <li>개인정보의 정정·삭제요구</li>
                  <li>손해배상청구</li>
                </ul>
              </section>

              {/* 제7조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제7조 (개인정보의 안전성 확보조치)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
                  <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치</li>
                  <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
                </ul>
              </section>

              {/* 연락처 */}
              <section className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">개인정보보호 문의처</h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Mail size={16} />
                    <span>이메일: privacy@financial-library.kr</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Phone size={16} />
                    <span>전화: 02-1234-5678</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  개인정보 처리방침 변경 시에는 웹사이트 공지사항을 통하여 공지할 것입니다.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
