import React from 'react';
import { FileText, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="text-blue-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">이용약관</h1>
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제1조 (목적)</h2>
                <p className="text-gray-700 leading-relaxed">
                  이 약관은 금융정보도서관(이하 "회사"라 함)이 제공하는 금융정보 서비스(이하 "서비스"라 함)의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              {/* 제2조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제2조 (정의)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>"서비스"</strong>란 회사가 제공하는 금융정보 열람, 검색 등의 모든 서비스를 의미합니다.</li>
                  <li><strong>"이용자"</strong>란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                  <li><strong>"회원"</strong>이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
                  <li><strong>"비회원"</strong>이란 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                </ul>
              </section>

              {/* 제3조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제3조 (약관의 효력 및 변경)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행약관과 함께 그 적용일자 7일 이전부터 적용일 후 상당한 기간 동안 공지합니다.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="text-yellow-600" size={20} />
                    <p className="text-yellow-800 font-semibold">중요 안내</p>
                  </div>
                  <p className="text-yellow-700 mt-1">
                    변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 회원탈퇴를 할 수 있습니다.
                  </p>
                </div>
              </section>

              {/* 제4조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제4조 (회원가입)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 회원가입은 이용자가 약관의 내용에 대하여 동의를 하고 회원가입신청을 한 후 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙하지 않거나 사후에 이용계약을 해지할 수 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                  <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                  <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </section>

              {/* 제5조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제5조 (서비스의 제공 및 변경)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 회사는 회원에게 아래와 같은 서비스를 제공합니다.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <h3 className="font-semibold text-green-800">제공 서비스</h3>
                  </div>
                  <ul className="list-disc list-inside text-green-700 space-y-1">
                    <li>금융정보 문서 열람 및 검색 서비스</li>
                    <li>AI 챗봇을 통한 금융정보 상담 서비스</li>
                    <li>맞춤형 금융정보 추천 서비스</li>
                    <li>기타 회사가 정하는 서비스</li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  2. 회사는 서비스의 내용을 변경할 수 있으며, 이 경우 변경된 서비스의 내용 및 제공일자를 명시하여 사전에 공지합니다.
                </p>
              </section>

              {/* 제6조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제6조 (서비스의 중단)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 다음 각 호의 경우에는 서비스 제공을 중단할 수 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우</li>
                  <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
                  <li>국가비상사태, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 서비스 이용에 지장이 있는 경우</li>
                  <li>기타 중대한 사유로 인하여 회사가 서비스 제공을 지속하는 것이 부적당하다고 인정하는 경우</li>
                </ul>
              </section>

              {/* 제7조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제7조 (회원의 의무)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회원은 다음 행위를 하여서는 안 됩니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>신청 또는 변경시 허위내용의 등록</li>
                  <li>타인의 정보도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 회사에 공개 또는 게시하는 행위</li>
                </ul>
              </section>

              {/* 제8조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제8조 (저작권의 귀속 및 이용제한)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 이용자는 회사를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                </p>
              </section>

              {/* 제9조 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">제9조 (분쟁해결)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1. 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  2. 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 서울중앙지방법원을 관할 법원으로 합니다.
                </p>
              </section>

              {/* 부칙 */}
              <section className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">부칙</h2>
                <p className="text-gray-700">
                  이 약관은 2024년 1월 1일부터 적용됩니다.
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  본 약관과 관련하여 궁금한 사항이 있으시면 고객센터로 문의해 주시기 바랍니다.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
