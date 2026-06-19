import React, { useState, useEffect } from "react";
import { 
  Compass, ShieldCheck, Target, Smartphone, Award, Users, 
  ArrowRight, Check, ChevronDown, Sparkles, BookOpen, Clock, 
  Lightbulb, CheckCircle, HelpCircle, AlertTriangle, Monitor,
  MessageCircle, Send, RefreshCw
 } from "lucide-react";

interface LandingPageProps {
  onStartMatching: () => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  isKeyValidated: boolean;
  setIsKeyValidated: (val: boolean) => void;
}

export default function LandingPage({ 
  onStartMatching,
  geminiApiKey,
  setGeminiApiKey,
  isKeyValidated,
  setIsKeyValidated
}: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [inputKey, setInputKey] = useState<string>(geminiApiKey);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorDetail, setErrorDetail] = useState<string>("");
  const [isKeyLocked, setIsKeyLocked] = useState<boolean>(true);

  useEffect(() => {
    setInputKey(geminiApiKey);
  }, [geminiApiKey]);

  const handleVerifyKey = async () => {
    if (isKeyValidated && isKeyLocked) {
      setIsKeyLocked(false);
      return;
    }

    if (!inputKey.trim()) {
      setErrorMsg("Gemini API Key를 입력해 주세요.");
      setErrorDetail("");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");
    setErrorDetail("");

    try {
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ apiKey: inputKey.trim() })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setGeminiApiKey(inputKey.trim());
        setIsKeyValidated(true);
        setIsKeyLocked(true);
      } else {
        setIsKeyValidated(false);
        setErrorMsg(data.message || "유효하지 않은 API 키입니다. 다시 입력해 주세요.");
        if (data.detail) {
          setErrorDetail(data.detail);
        }
      }
    } catch (err: any) {
      console.error("Verification network error:", err);
      setIsKeyValidated(false);
      setErrorMsg("API 키 서버 검증 실패. 네트워크 상태를 확인하시거나 올바른 키를 입력해 주세요.");
      setErrorDetail(err?.message || err?.toString() || "");
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: "국민내일배움카드가 없는데도 매칭 서비스를 이용할 수 있나요?",
      a: "네, 완전히 가능합니다! 본 매칭 엔진은 카드 미보유 자를 위해 '카드 신설 및 발급 신청 프로세스 연계 진단 가이드'를 매칭 요약서와 함께 제공해 드리므로, 걱정 없이 시작하셔도 좋습니다."
    },
    {
      q: "중도 퇴소 시 내일배움카드 페널티나 위약금 수칙이 정말 존재하나요?",
      a: "훈련 중도 포기 시 고용노동부 규정에 따라 내일배움카드 잔액 차감(최대 200만원)이나 향후 타 교육 수강 제한 등의 행정 불이익이 주어집니다. 본 앱은 각 교육과정별 매칭 결과에서 이 페널티와 세부 수위 조항을 투명하게 사전 예보하여 청년층을 안심시킵니다."
    },
    {
      q: "다른 부트캠프 비교 사이트와 어떤 점이 다른가요?",
      a: "광고비 위주의 단순 나열식 플랫폼과 달리, 본 매칭 시스템은 청년층 구직자가 겪는 가장 아픈 결핍 요인, 훈련 기관의 행정적 수칙 투명성, 그리고 본인에게 최적인 인지적 학습 난이도를 360도 교차 검증하여 광고 거품을 뺀 안전한 원정 정보를 도출합니다."
    },
    {
      q: "매칭 완료 후에 제공되는 가상 시뮬레이터는 무엇인가요?",
      a: "매칭이 완료되면 실제 수료 과정에서 본인이 받게 될 모바일 앱 알림장, 반응형 웹 브라우저 지표 분석 보드, 기업용 카카오 알림톡의 UI를 인텍토 실체 그대로 가상 탑재하여 문항 접수 후의 서비스 체험 가독성을 대폭 끌어올려 줍니다."
    }
  ];

  const BENEFITS = [
    {
      title: "훈련 장려수당 수급 요건 선제적 판단",
      desc: "단위기간 출석률 80% 요건과 대면/비대면별 수령 가능 금액 최대치를 실시간 매칭 알고리즘을 통해 자가 점검합니다."
    },
    {
      title: "비전공자 인지적 안심 난이도 검증",
      desc: "본인의 기초 역량에 걸맞지 않는 무리한 고급 하드코어 교육으로 인한 낙오를 사전에 방지하도록 최적화 레벨을 매칭합니다."
    },
    {
      title: "1:1 포트폴리오 공백 해소 수거",
      desc: "이력서에 즉시 기재 가능한 기업 협업 연계 유무, 실전 가상 트렌딩 프로젝트 위주의 코스만 정확하게 발라냅니다."
    }
  ];

  return (
    <div id="landing-page-root" className="w-full bg-[#F4F6FB] text-[#1E293B] selection:bg-[#7C3AED] selection:text-white pb-20">
      
      {/* Outer wrapper mimicking the image layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* State 1: Premium Banner Block mimicking the top image hero card */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#7062FF] to-[#5244DC] rounded-[32px] text-white p-8 sm:p-12 shadow-[0_20px_40px_rgba(82,68,220,0.15)] md:flex items-center justify-between gap-8 mb-16">
          
          {/* Background vector accents for the premium matching look */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.1)_0%,transparent_60%)] pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Left Hero Content */}
          <div className="space-y-6 md:max-w-[55%] text-left relative z-10">
            <span className="inline-block bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10.5px] font-bold text-white tracking-wider uppercase border border-white/10">
              ⚡ 1:1 맞춤 안심 진단
            </span>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.2] text-white">
              복잡하고 불투명한 <br />
              <span>국비 취업 직무 교육</span> <br />
              정밀하고 안전하게 안심 매칭
            </h1>
            
            {/* Custom styled list icons mirroring the + indicators in image */}
            <div className="space-y-2.5 text-xs sm:text-sm text-indigo-100 font-medium pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[#FFE24D] text-lg font-bold">✦</span>
                <span>훈련 장려수당 수급 자가 검증 프로세스 지원</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#FFE24D] text-lg font-bold">✦</span>
                <span>비전공자 안전 이탈률/페널티 선제 진단</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onStartMatching}
                className="group inline-flex items-center gap-2 px-7 py-4 bg-[#FFE24D] hover:bg-[#FCD201] text-slate-900 rounded-full text-sm font-extrabold shadow-[0_10px_25px_rgba(255,226,77,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
              >
                <span>지금 1:1 진단 시작하기</span>
                <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Hero Interactive Glass Mockup (Mirroring the cute boy illustration) */}
          <div className="hidden md:flex flex-col items-center justify-center relative md:w-[38%] h-72 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md p-6 overflow-hidden">
            <div className="absolute top-4 right-4 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping"></div>
            <div className="absolute top-4 right-4 w-3.5 h-3.5 bg-emerald-400 rounded-full"></div>
            
            <div className="space-y-4 w-full text-center relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Compass className="w-8 h-8 text-[#FFE24D] animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase tracking-wider">MATCHING COMPASS v2.5</p>
                <p className="text-[11px] text-indigo-100">국정 고용노동 지표 및 위약 구제 체계 수립</p>
              </div>
              <div className="bg-slate-900/40 rounded-xl p-3 inline-block max-w-[90%] mx-auto text-[10.5px] text-indigo-200 border border-white/5">
                🛡️ <span className="text-white font-bold">누적 5.4만명</span>의 구직자가 <br />안심 과정을 진단받았습니다.
              </div>
            </div>
          </div>

        </section>

        {/* Gemini API Key Verification Section */}
        <section id="api-key-section" className="mb-16 scroll-mt-24">
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-slate-200 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] text-left space-y-6">
            
            {/* Header block with green check symbol */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                  무료로 시작하세요. Gemini API 키만 있으면 됩니다.
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  입력된 API 키는 절대 서버에 저장되지 않고, 오직 진단 결과 산출 과정에만 사용됩니다.
                </p>
              </div>
            </div>

            {/* Input Form matching the search-bar visual */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="🔒 Gemini API Key 입력 (AIzaSy...)"
                  disabled={isKeyValidated && isKeyLocked}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5244DC]/20 focus:border-[#5244DC] transition"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyKey}
                disabled={isVerifying}
                className={`px-8 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md transition duration-200 flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                  isKeyValidated
                    ? "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                    : "bg-[#5244DC] hover:bg-[#4133C7] text-white disabled:opacity-50"
                }`}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>인증 중...</span>
                  </>
                ) : isKeyValidated ? (
                  <>
                    <Award className="w-4 h-4" />
                    <span>인증 완료 (변경하기)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>시작하기</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Feedback Messages */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-600">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-extrabold">{errorMsg}</p>
                  {errorDetail && <p className="text-[10px] opacity-80 font-mono leading-relaxed">{errorDetail}</p>}
                </div>
              </div>
            )}

            {isKeyValidated && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-700">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">인증에 성공하였습니다! 위 진단 시작하기 버튼을 클릭하여 진단을 시작해보세요.</p>
                  <p className="text-[10.5px] opacity-90 mt-0.5">이제부터 100% 실시간 Gemini AI 맞춤 추천 훈련 과정이 적용됩니다.</p>
                </div>
              </div>
            )}

            {/* Collapsible Accordion Guide */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsGuideOpen(!isGuideOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition font-extrabold text-xs sm:text-sm text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#5244DC]" />
                  <span>❓ Gemini API Key 발급 가이드</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isGuideOpen ? "rotate-180" : ""}`} />
              </button>

              {isGuideOpen && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-200 bg-white space-y-4">
                  <ol className="space-y-3.5 text-xs text-slate-600 pl-1 list-none">
                    <li className="relative pl-6 before:content-['1'] before:absolute before:left-0 before:top-0 before:w-4.5 before:h-4.5 before:bg-indigo-50 before:text-[#5244DC] before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-[10px]">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-800">Google AI Studio 접속</p>
                        <p className="leading-relaxed">
                          아래 링크를 클릭하여 Google AI Studio에 접속하세요.
                        </p>
                        <a 
                          href="https://aistudio.google.com/apikey" 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-block text-[#5244DC] font-semibold underline hover:text-[#4133C7] mt-0.5"
                        >
                          https://aistudio.google.com/apikey
                        </a>
                      </div>
                    </li>
                    <li className="relative pl-6 before:content-['2'] before:absolute before:left-0 before:top-0 before:w-4.5 before:h-4.5 before:bg-indigo-50 before:text-[#5244DC] before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-[10px]">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-800">Google 계정으로 로그인</p>
                        <p className="leading-relaxed">Gmail 계정으로 로그인하세요. 계정이 없으면 무료로 만들 수 있어요.</p>
                      </div>
                    </li>
                    <li className="relative pl-6 before:content-['3'] before:absolute before:left-0 before:top-0 before:w-4.5 before:h-4.5 before:bg-indigo-50 before:text-[#5244DC] before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-[10px]">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-800">'API 키 만들기' 클릭</p>
                        <p className="leading-relaxed">화면에서 'Create API Key' 또는 'API 키 만들기' 버튼을 클릭하세요.</p>
                      </div>
                    </li>
                    <li className="relative pl-6 before:content-['4'] before:absolute before:left-0 before:top-0 before:w-4.5 before:h-4.5 before:bg-indigo-50 before:text-[#5244DC] before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-[10px]">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-800">프로젝트 선택 후 생성</p>
                        <p className="leading-relaxed">기본 프로젝트를 선택하고 'Create API key in existing project'를 클릭하세요.</p>
                      </div>
                    </li>
                    <li className="relative pl-6 before:content-['5'] before:absolute before:left-0 before:top-0 before:w-4.5 before:h-4.5 before:bg-indigo-50 before:text-[#5244DC] before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-[10px]">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-800">API 키 복사</p>
                        <p className="leading-relaxed">생성된 API 키(AIza로 시작)를 복사하세요. 이 키를 입력창에 붙여넣기하면 됩니다!</p>
                      </div>
                    </li>
                  </ol>
                  
                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-extrabold text-[11px] transition text-center"
                    >
                      <span>🔑 API 키 발급 페이지로 이동</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Real Problems Solved Section */}
        {/* Mimicking the middle section with rounded container boxes but localized color codes */}
        <section id="key-problems" className="mb-20 text-center">
          <div className="space-y-2.5 mb-10 max-w-xl mx-auto">
            <p className="text-xs font-extrabold text-[#5244DC] tracking-wider uppercase">THE REAL PROBLEM</p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              구직 청년들을 혼란스럽게 만드는 3대 장벽
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              광고로 가려진 정보와 복잡한 내일배움카드 규정으로 인해 겪는 결핍 요소를 원천 해결합니다.
            </p>
          </div>

          {/* Numbered grid directly adapted from "С НАМИ РЕБЯТА РАЗВИВАЮТСЯ С НЕСКОЛЬКИХ СТОРОН" visual structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1 (Blue Accent) */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-150 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.04)] text-left flex flex-col justify-between relative overflow-hidden h-full group hover:border-[#5244DC]/45 transition duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 bg-indigo-50 text-[#5244DC] rounded-xl flex items-center justify-center font-bold text-[13px]">
                    1
                  </div>
                  <span className="text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-md">페널티</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#5244DC] transition">불투명한 페널티 수칙</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    중도 탈락 시 부과되는 내일배움카드 페널티 사유와 위약 규정을 미리 인지하지 못해 발생할 수 있는 피해를 철저하게 방지합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2 (Orange Accent) */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-150 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.04)] text-left flex flex-col justify-between relative overflow-hidden h-full group hover:border-[#FFE24D]/60 transition duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-[13px]">
                    2
                  </div>
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">난이도</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-600 transition">초과 난이도 낙오</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    비전공자임에도 화려하게 광고된 고난도 우수 훈련을 무작정 시작했다가 수강 실패로 낙담하고 포기하는 부작용을 사전에 선별합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 3 (Pink Accent) */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-150 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.04)] text-left flex flex-col justify-between relative overflow-hidden h-full group hover:border-purple-300 transition duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold text-[13px]">
                    3
                  </div>
                  <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">장려수당</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-600 transition">수당 정산 오리무중</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    훈련 과정 중에 보장받아야 할 특별 고용노동부 장려금과 정량 지급 조항 계산법의 장벽을 간소화하여 알려드립니다.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Core Strengths Section mapped to the mock-up's distinct four program cards (KVPC MIDDLE, HIGH, SUPER, EXPERT) */}
        {/* We keep the same copywriting but completely replace the layout with these 4 vibrant card gradients */}
        <section id="key-strengths" className="mb-20 text-center">
          <div className="space-y-2.5 mb-10 max-w-xl mx-auto">
            <p className="text-xs font-extrabold text-[#5244DC] tracking-wider uppercase">CORE ADVANTAGES</p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              나다운 성장을 보증하는 매칭 허브의 차별적 강점
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              신뢰성과 정량 수당 확보의 관점에서 엄정하게 구축한 기능으로 취업 성공의 가이드를 전해 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Beautiful Indigo gradient background (Adapting KVPC MIDDLE color) */}
            <div className="bg-gradient-to-br from-[#554CF2] to-[#7B70FF] text-white p-8 rounded-[28px] text-left flex flex-col justify-between gap-6 shadow-md transition transform hover:-translate-y-1 duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-white/10 text-[#FFE24D] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Administrative Rules
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold">내일배움 행정 수칙 & 장려금 오토-프리뷰</h3>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  본인의 정확한 조건에 연동해 훈련 장려수당 수금 유수 기준과 고용보험 미취업 기보유 상태 규정 동의 여부를 실시간 진단 결과서 체크리스트로 확인합니다.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[11px] text-indigo-200">
                <span className="flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5 text-[#FFE24D]" /> 출석률 자가 정산 연계
                </span>
                <span className="font-mono text-white/50 text-[10px]">PREVIEW PLATFORM</span>
              </div>
            </div>

            {/* Card 2: Gorgeous Coral/Orange gradient (Adapting KYPC HIGH color) */}
            <div className="bg-gradient-to-br from-[#FF7235] to-[#FFA066] text-white p-8 rounded-[28px] text-left flex flex-col justify-between gap-6 shadow-md transition transform hover:-translate-y-1 duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-white/10 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Cognitive Matching
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold">인지적 난이도 연계 교차 알고리즘</h3>
                <p className="text-xs text-amber-50 leading-relaxed">
                  비전공자 전용 기초 장벽 우회 과정부터, 즉각적인 포트폴리오를 작성해야 하는 전공자용 심화 K-Digital 코스까지, 본인의 개념 이해 능력과 일체되는 커리큘럼 품질만 정밀 매칭합니다.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[11px] text-amber-100">
                <span className="flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5 text-white" /> 안심 난이도 4단계 체제
                </span>
                <span className="font-mono text-white/50 text-[10px]">COGNITIVE ENGINE</span>
              </div>
            </div>

            {/* Card 3: Fresh Green/Mint gradient (Adapting KYPC SUPER color) */}
            <div className="bg-gradient-to-br from-[#1DBB73] to-[#51E0A4] text-white p-8 rounded-[28px] text-left flex flex-col justify-between gap-6 shadow-md transition transform hover:-translate-y-1 duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="bg-white/10 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Live Simulation
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold">3대 멀티 디바이스 모의 시뮬레이터</h3>
                <p className="text-xs text-emerald-50 leading-relaxed">
                  과정 매칭 즉시 본인이 받게 될 모의 푸시, 카카오 알림톡 메시지 형식, 그리고 분석 웹페이지를 실시간 대조 시뮬레이팅할 수 있습니다. 수료 전 간접 체험으로 확실한 비전을 잡으세요.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[11px] text-emerald-100">
                <span className="flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5 text-white" /> 카카오 알림톡 · 모바일 앱 · 분석 웹
                </span>
                <span className="font-mono text-white/50 text-[10px]">SIMULATION LAB</span>
              </div>
            </div>

            {/* Card 4: Intense Deep Purple/Magenta gradient (Adapting KYPC EXPERT color) */}
            <div className="bg-gradient-to-br from-[#A533E0] to-[#CF6CED] text-white p-8 rounded-[28px] text-left flex flex-col justify-between gap-6 shadow-md transition transform hover:-translate-y-1 duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="bg-white/10 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Career Remodeling
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold">맞춤형 1:1 이력서 포트폴리오 패키징</h3>
                <p className="text-xs text-purple-100 leading-relaxed">
                  현재 구직자의 가장 뼈아픈 요인인 '실무 프로젝트 공백'을 상쇄할 수 있는 기업체 연계 인턴십 및 인사담당자 맞춤형 정기 수급 제휴 코스를 단독 추천하여 사후 케어를 대폭 확장해 냅니다.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[11px] text-purple-200">
                <span className="flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5 text-[#FFE24D]" /> 수료 사후 관리 지원 6개월
                </span>
                <span className="font-mono text-white/50 text-[10px]">REMODELING HUB</span>
              </div>
            </div>

          </div>
        </section>

        {/* Benefits Accordion of Each Dimension */}
        <section className="mb-20 max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <p className="text-xs font-extrabold text-[#5244DC] tracking-wider uppercase">DETAILED BENEFITS</p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              사전 매칭을 가동하는 구체적 안심 조항
            </h2>
          </div>

          <div className="space-y-4">
            {BENEFITS.map((benefit, bIdx) => (
              <div key={bIdx} className="bg-white rounded-[20px] border border-slate-150 p-5.5 flex items-start gap-4 text-left shadow-xs hover:border-[#5244DC]/30 transition duration-200">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#5244DC] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">{benefit.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions Section */}
        <section className="mb-20 max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <p className="text-xs font-extrabold text-[#5244DC] tracking-wider uppercase">FAQ</p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              구직 청년들이 가장 우려하는 행정 질문
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              수강 진입을 결심하기 전 반드시 마음속에 품었을 의문점들을 명확하게 풀어드립니다.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-[20px] border border-slate-150/80 transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50/50 transition cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 flex gap-2">
                      <span className="text-[#5244DC] font-black font-mono">Q.</span>
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 bg-slate-50/50">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5 relative before:content-['A.'] before:absolute before:left-0 before:font-extrabold before:text-[#1DBB73] before:font-mono">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Secondary Bottom Call-To-Action Banner Section with white border mimicking the form container in mock-up */}
        <section className="bg-gradient-to-br from-[#7062FF] to-[#5244DC] text-white p-8 sm:p-12 rounded-[32px] text-center relative overflow-hidden shadow-lg border border-white/10">
          <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="max-w-xl mx-auto space-y-6 relative z-10 text-center">
            <span className="inline-block bg-white/10 px-3.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase text-white">
              START YOUR SUCCESS JOURNEY
            </span>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-3xl font-black">
                불확실성은 없애고, 성공률은 높이세요.
              </h2>
              <p className="text-xs text-indigo-150 leading-relaxed">
                현재까지 수많은 구직자가 안전한 매칭을 통해 중도 이탈 없이 과정을 수료했습니다. 단 1분간의 7단계 문항 설계로 당신의 평생 무기를 찾아보세요.
              </p>
            </div>

            {/* Micro mock form setup (mirroring the bottom subscription form element in the image) */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 max-w-md mx-auto space-y-3.5">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-bold text-indigo-200">안심 알림 예약 사전 발급</span>
                <p className="text-[11px] text-white">진단 종료 후 무료 매칭 결과서를 스마트폰 모의 알림장으로 시연해 드립니다.</p>
              </div>
              <button
                onClick={onStartMatching}
                className="w-full bg-[#FFE24D] hover:bg-[#FCD201] text-slate-900 px-6 py-3.5 rounded-xl font-extrabold text-xs shadow-md transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>지금 1:1 맞춤 진단 시작하기</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            </div>
            
            <div className="text-[10px] text-indigo-200 font-medium">
              💡 국민내일배움카드 발급 연계, 훈련 장려수당 정산 세션이 모두 구비되어 있습니다.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
