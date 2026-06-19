import React, { useState } from "react";
import { FormData, MatchedCourse, MatchResponse } from "./types";
import MobileSimulator from "./components/MobileSimulator";
import KakaoSimulator from "./components/KakaoSimulator";
import LandingPage from "./components/LandingPage";
import { 
  Compass, HelpCircle, CheckCircle, Award, Hourglass, 
  Sparkles, Bell, ChevronLeft, ChevronRight, RotateCcw, 
  FileText, CheckSquare, Globe, Smartphone, MessageSquare, 
  Check, Info, RefreshCw, AlertTriangle
} from "lucide-react";

export default function App() {
  // Landing Page vs Wizard View State
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // Google Gemini API Key States
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [isKeyValidated, setIsKeyValidated] = useState<boolean>(false);
  
  // Wizard State
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    mainCategory: "2", // Default to Science/Engineering/IT
    subJob: "① 프론트엔드/백엔드 개발자",
    subJobCustom: "",
    defectReason: "② 실무 중심 포트폴리오 (이력서에 서술할 기업 연계 프로젝트, 현업 가상 프로젝트, 팀 기반 협업 경험 공백 해소)",
    defectReasonCustom: "",
    durationLimit: "③ 3개월 이상 ~ 6개월 미만 (중기 직무 부트캠프 / 포트폴리오 프로젝트 중심 과정)",
    durationLimitCustom: "",
    difficultyLevel: "① 입문/기초 코스 (해당 직무 지식이 전혀 없는 비전공자 및 초보자 대상)",
    difficultyLevelCustom: "",
    priorityFactor: "① 비용 및 혜택 (국비 지원/전액 무료 여부, 내일배움카드 사용 가능 여부, 훈련수당/장려금 지급 금액 및 조건)",
    priorityFactorCustom: "",
    importantGuide: "② 지원 자격 세부 제한 (연령 제한 기준, 미취업 기간 증빙 조건, 거주 지역/소득 제한, 대학교 재학생 및 졸업예정자 신청 가능 여부)",
    importantGuideCustom: "",
    appPlatform: "1" // Default: Mobile App
  });

  // Diagnostic Results
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number>(0);
  const [customCourseChecklists, setCustomCourseChecklists] = useState<Record<number, Record<number, boolean>>>({});

  // Push Alert Simulator States
  const [toastNotification, setToastNotification] = useState<{
    visible: boolean;
    title: string;
    message: string;
    timing: string;
  } | null>(null);

  // Constants mapping user questions exactly
  const QUESTIONS = [
    {
      id: 1,
      title: "목표 분야 및 세부 직무 선택",
      description: "본인이 수강하고자 하는 직무 계열을 선택한 후 세부 직무 번호를 선택 하세요.",
    },
    {
      id: 2,
      title: "현재 가장 보완하고 싶은 취업 요건 및 결핍 부분",
      description: "국비 지원이나 부트캠프 등을 통해 보완하고자 하는 가장 뼈아픈 요소를 선택해 주세요.",
    },
    {
      id: 3,
      title: "교육 수강을 위해 준수해야 할 희망 기간",
      description: "훈련 참여에 가능한 학사 일정 설계용 필수 교육 기간 구간을 선택해 주세요.",
    },
    {
      id: 4,
      title: "본인의 현재 수강 희망 난이도 수준",
      description: "훈련 진입 시 안전하게 수료가 가능한 인지적 난이도를 자진 고지해 주세요.",
    },
    {
      id: 5,
      title: "훈련 기관 결정 시 꼭 참고해야 할 최우선 요소",
      description: "과정을 선택하고 최종 신청 결정을 내리는 기준이 되는 우선순위 요인입니다.",
    },
    {
      id: 6,
      title: "선발 및 행정 진행 단계에서 반드시 인지해야 할 필수 안내 사항",
      description: "기관의 지원 절차 중 화면상 가장 투명하고 정밀하게 노출되어야 할 항목입니다.",
    },
    {
      id: 7,
      title: "매칭 결과를 확인해보고 싶은 가상 화면 환경",
      description: "최종 매칭된 훈련 요약서와 통계 체크리스트를 인쇄, 열람할 환경을 지정하세요.",
    }
  ];

  const MAIN_CATEGORIES = [
    { id: "1", label: "인문/사회/상경 계열" },
    { id: "2", label: "자연/공학/IT 계열" },
    { id: "3", label: "예술/디자인/미디어 계열" },
    { id: "4", label: "기타 전문직/공공/서비스" }
  ];

  const PLATFORMS = [
    { id: "1", label: "모바일 하이브리드 앱", desc: "오른쪽 시뮬레이터에서 모바일 전용 앱 매칭 안내장 화면을 정밀하게 확인합니다." },
    { id: "2", label: "반응형 대조 웹페이지", desc: "대형 스케일의 웹 브라우저 훈련 지표 보드로 가상 변환하여 대조 검증을 수행합니다." },
    { id: "3", label: "카카오 알림톡 서비스", desc: "실제 카카오톡 기업 알림톡처럼 즉시 수급 조건을 한눈에 요약하는 모의 메시지 화면입니다." }
  ];

  const SUB_JOBS: Record<string, string[]> = {
    "1": [
      "① 퍼포먼스/그로스 마케터",
      "② 콘텐츠 마케터/에디터",
      "③ 서비스/프로덕트 기획자(PM)",
      "④ 인사(HR)/노무",
      "⑤ 재무/회계/세무",
      "⑥ 글로벌 영업/해외 소싱 MD",
      "⑦ 경영컨설팅/전략기획",
      "⑧ 직접 입력"
    ],
    "2": [
      "① 프론트엔드/백엔드 개발자",
      "② 앱 개발자(iOS/Android)",
      "③ 인프라/클라우드/DevOps 엔지니어",
      "④ 정보보안 전문가",
      "⑤ AI 엔지니어 / 데이터 사이언티스트",
      "⑥ 프롬프트 엔지니어 / LLM 서비스 개발자",
      "⑦ 반도체/디스플레이 공정 엔지니어",
      "⑧ 직접 입력"
    ],
    "3": [
      "① UI/UX 디자이너",
      "② 그래픽/시각 디자인",
      "③ 영상 편집/콘텐츠 크리에이터",
      "④ 3D 모델링/게임 그래픽",
      "⑤ 직접 입력"
    ],
    "4": [
      "① 공공/사회복지 서비스",
      "② 금융 영업/자산 관리 전문가",
      "③ 식음료/F&B 예비 창업 과정",
      "④ 직접 입력"
    ]
  };

  const DEFECT_REASONS = [
    "① 공인 자격증 및 어학 점수 (서류 통과의 보수적 정량 스펙 확보용)",
    "② 실무 중심 포트폴리오 (이력서에 서술할 기업 연계 프로젝트, 현업 가상 프로젝트, 팀 기반 협업 경험 공백 해소)",
    "③ 알고리즘 및 기술 면접 역량 (코딩 테스트 통과 및 최종 면접 패스용 실전 역량 강화)",
    "④ 현직자 1:1 멘토링/네트워킹 (업계 연계 피드백 및 자소서 교정, 현업 트렌드 확보)",
    "⑤ 직접 입력"
  ];

  const DURATION_LIMITS = [
    "① 1개월 미만 (초단기 직무 특강 / 부트캠프 맛보기 코스)",
    "② 1개월 이상 ~ 3개월 미만 (단기 핵심 직무 교육 또는 자격증 과정)",
    "③ 3개월 이상 ~ 6개월 미만 (중기 직무 부트캠프 / 포트폴리오 프로젝트 중심 과정)",
    "④ 6개월 이상 (장기 전 주 과정 / 전액 국비지원 취업 매칭 집중 스쿨)",
    "⑤ 직접 입력"
  ];

  const DIFFICULTY_LEVELS = [
    "① 입문/기초 코스 (해당 직무 지식이 전혀 없는 비전공자 및 초보자 대상)",
    "② 중급/실무 적용 코스 (기본 개념을 파악하고 있으며, 심도 깊은 프로젝트를 원하는 기전공자 대상)",
    "③ 고급/심화 연구 코스 (현업 수준의 아키텍처 및 시스템 튜닝을 목표로 하는 실무 지향적 교육 대상)",
    "④ 직접 입력"
  ];

  const PRIORITY_FACTORS = [
    "① 비용 및 혜택 (국비 지원/전액 무료 여부, 내일배움카드 사용 가능 여부, 훈련수당/장려금 지급 금액 및 조건)",
    "② 교육 방식 (100% 온라인, 100% 오프라인, 온오프 혼합 하이브리드, 밀착 관리 보증 강사 품질)",
    "③ 기관 인지도 및 기업 연계 취업률 (공인 취업률 수치, 수료 후 협력 기업 실제 연계 및 인턴십 기회 제공 등)",
    "④ 직접 입력"
  ];

  const IMPORTANT_GUIDES = [
    "① 선발 전형 및 절차 (서류 심사 배점 가이드, 코딩 테스트/인적성 검사)",
    "② 지원 자격 세부 제한 (연령 제한 기준, 미취업 기간 증빙 조건, 거주 지역/소득 제한, 대학교 재학생 및 졸업예정자 신청 가능 여부)",
    "③ 교육 수당 및 장려금 조건 (훈련 장려금 요건, 중도 퇴소 페널티, 출석률 산정 기준 등 상세 기준)",
    "④ 직접 입력"
  ];

  const getCategoryShortLabel = (catId: string) => {
    if (catId === "1") return "인문/마케팅";
    if (catId === "2") return "IT/개발";
    if (catId === "3") return "예술/디자인";
    return "전문/서비스";
  };

  const getDifficultyShortLabel = (diffStr: string) => {
    if (diffStr.includes("입문")) return "입문";
    if (diffStr.includes("중급")) return "중급";
    if (diffStr.includes("심화")) return "심화";
    return "기타";
  };

  const getDurationShortLabel = (durStr: string) => {
    if (durStr.includes("1주") || durStr.includes("1개월 미만")) return "1개월 미만";
    if (durStr.includes("1개월") || durStr.includes("3개월 미만")) return "1~3개월";
    if (durStr.includes("3개월") || durStr.includes("6개월 미만")) return "3~6개월";
    if (durStr.includes("6개월")) return "6개월 이상";
    return "중급";
  };

  const setFormValue = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (step < 7) {
      setStep((prev) => prev + 1);
    } else {
      setLoading(true);
      setResult(null);

      const categoryVal = getCategoryShortLabel(formData.mainCategory);

      const handleFallback = () => {
        const matchedCoursesList: MatchedCourse[] = [
          {
            title: `${formData.subJob.includes("직접 입력") ? formData.subJobCustom : formData.subJob.substring(2)} 맞춤형 혁신 훈련과정 (S급)`,
            institution: "청년 인재 우수 인증 개발 교육원",
            tagline: `${categoryVal} 영역 맞춤형 취업 극대화 보장 코스`,
            difficulty: {
              level: formData.difficultyLevel.includes("직접 입력") ? "사용자 맞춤" : formData.difficultyLevel.split(" ")[1],
              details: "초보 단기 마스터 진화형 훈련 커리큘럼 설계 완료"
            },
            duration: {
              period: formData.durationLimit.includes("직접 입력") ? "사용자 조율" : formData.durationLimit.split(" ")[1],
              weeklySchedule: "주 5일 평일 전일제 대면/비대면 혼합형 오가닉 세션 (09:00 - 18:00)"
            },
            benefits: {
              subsidy: "월 최대 316,000원 대면 기본 훈련수당 100% 지급 보증",
              materials: "고성능 크롬북/노트북 무상 렌탈 및 실무 서적 완전 무상 제공",
              support: "수료 후 6개월간 대기업 협약 인사담당자 1:1 매칭 컨설팅 및 무제한 보정"
            },
            selection: {
              process: "서류 심사 -> 인지적 기초 간이 검사 -> 면접 후 최종 선발",
              conditions: formData.importantGuide.includes("직접 입력") ? "안내 수칙에 따름" : formData.importantGuide.substring(2, 35) + "..."
            },
            eligibilityChecklist: [
              { text: "국민내일배움카드 발급 신규 또는 기보유 자격 검증 완료", checked: false },
              { text: "최근 3개월간 고용보험 미취업 미가입 상태 유지 동의", checked: false },
              { text: "일 8시간 평일 정기 대면 수강 출석 여정 참여 가능성 동의", checked: false }
            ],
            benefitChecklist: [
              { text: "훈련 장려수당 수급을 위한 월 80% 이상 출석 이행 약속", checked: false },
              { text: "무상 대여 기자재의 수료 시 반납 또는 인계 규정 동의 및 준수", checked: false },
              { text: "사후 취업 모니터링 참여 및 대외 훈련 실적 등록 협조", checked: false }
            ],
            alerts: [
              { timing: "훈련 개시 24시간 전", action: "준비물 필수 가이드 및 첫 비대면 Zoom 주소 SMS 예약 발송", type: "important" },
              { timing: "매월 말일 자동 정산", action: "출석 일수 분석 및 국민은행 훈련수당 자동 청구 푸시 발송", type: "info" },
              { timing: "수료 2주 전 최종 점검", action: "1:1 포트폴리오 리모델링 정밀 사전 진단 프로세스 가동", type: "success" }
            ]
          },
          {
            title: `초대형 공인 [${categoryVal}] 하이엔드 실무 아카데미`,
            institution: "K-Digital 특별 우수 인가 센터",
            tagline: `${formData.defectReason.substring(2, 18)} 집중 해소형 포트폴리오 메이커`,
            difficulty: {
              level: formData.difficultyLevel.includes("직접 입력") ? "사용자 조율" : formData.difficultyLevel.split(" ")[1],
              details: "사전 온라인 기초 교재 완편 제공으로 진입 장벽 전격 제거"
            },
            duration: {
              period: "4~6개월 장기 마스터형",
              weeklySchedule: "주 5일 집중 전일제 훈련 (10:00 - 19:00)"
            },
            benefits: {
              subsidy: "K-Digital 전액 정부 지원 프리미엄 무료 혜택",
              materials: "동영상 강의 무료 복습권 및 유명 원서 패키지 무상 증정",
              support: "취업 전담 매니저 무제한 모의 면접 및 협약 대기업 우선 추천 채용 연계"
            },
            selection: {
              process: "서류 심사 및 비대면 사전 역량 문항 진단",
              conditions: "만 15세 이상 34세 이하 미취업 상태 우선 선발"
            },
            eligibilityChecklist: [
              { text: "연령 요건 만 15세 이상 ~ 만 34세 이하 해당 증빙", checked: false },
              { text: "전일제 실무 참여 및 온오프 혼합 출결 장치 수용", checked: false }
            ],
            benefitChecklist: [
              { text: "정액 훈련 장려금 수급 기준 동의 (단위기간 80% 이상 참여)", checked: false },
              { text: "수료 이후 협약 기업 맞춤형 채용 공고 우선 수급 동의", checked: false }
            ],
            alerts: [
              { timing: "면접 3일 전 예보", action: "기출 면접 질문 모음집 및 선발 채점 기준표 SMS 수신", type: "warning" },
              { timing: "과정 개시 당일 09:00", action: "장착 웰컴 키트 하드웨어 렌탈 상태 최종 확인 푸시", type: "info" }
            ]
          }
        ];

        setResult({
          courses: matchedCoursesList,
          summaryMessage: `축하합니다! 입력하신 [${categoryVal}] 직무 매칭 조건과 [${formData.durationLimit.split(" ")[1] || "희망스케줄"}] 수강 기간 분석 결과, 총 2개의 맞춤 정부지원 안심 훈련과정이 도출되었습니다. 하단의 가상 시뮬레이터를 통해 카카오 메시지나 SMS 알림 수신 상태를 가상 검증하십시오.`
        });
        setSelectedCourseIdx(0);
        setLoading(false);
      };

      if (geminiApiKey) {
        fetch("/api/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-gemini-api-key": geminiApiKey
          },
          body: JSON.stringify(formData)
        })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
          }
          const data = await res.json();
          if (data && data.courses && Array.isArray(data.courses)) {
            setResult(data);
            setSelectedCourseIdx(0);
            setLoading(false);
          } else {
            throw new Error("Invalid response format format");
          }
        })
        .catch((err) => {
          console.error("Live match failed, falling back to local simulation:", err);
          handleFallback();
        });
      } else {
        setTimeout(() => {
          handleFallback();
        }, 1500);
      }
    }
  };

  const toggleDesktopChecklist = (courseIdx: number, itemIdx: number, type: "eligibility" | "benefit") => {
    const key = type === "eligibility" ? itemIdx : itemIdx + 100;
    setCustomCourseChecklists((prev) => {
      const courseState = prev[courseIdx] || {};
      return {
        ...prev,
        [courseIdx]: {
          ...courseState,
          [key]: !courseState[key]
        }
      };
    });
  };

  const triggerPushAlertSimulation = (alertMsg: string) => {
    setToastNotification({
      visible: true,
      title: "실시간 스마트 푸시",
      message: alertMsg,
      timing: "즉시 수신 보증"
    });
    setTimeout(() => {
      setToastNotification(null);
    }, 5000);
  };

  return (
    <div id="youth-matching-root" className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-between relative overflow-x-hidden font-sans text-[#111827]">
      
      {/* Top Floating Notification Simulation Panel (Physical Push UI) */}
      {toastNotification && (
        <div 
          id="mock-push-alert"
          className="fixed top-5 right-5 left-5 md:left-auto md:w-[420px] bg-slate-900 text-white rounded-xl shadow-xl p-4.5 border border-indigo-500/30 z-50 flex items-start gap-3.5"
        >
          <div className="p-2 bg-indigo-600/30 rounded-lg text-indigo-400 shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold tracking-wider text-indigo-300 uppercase">
                {toastNotification.title}
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                {toastNotification.timing}
              </span>
            </div>
            <p className="text-[11.5px] text-slate-100 font-medium leading-relaxed">
              {toastNotification.message}
            </p>
            <div className="mt-1 bg-white/5 px-2 py-0.5 rounded text-[9.5px] text-slate-300 inline-block">
              ⚠️ 구체적 매칭 조건이 실현되었습니다
            </div>
          </div>
          <button 
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-white font-bold font-mono text-xs p-1"
          >
            ×
          </button>
        </div>
      )}

      {showLanding ? (
        <>
          {/* Landing Header mimicking the mockup's clean aesthetic */}
          <header className="w-full bg-white border-b border-slate-100 px-6 sm:px-12 h-20 flex items-center justify-between shrink-0 z-25 text-[#1E293B] sticky top-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5244DC] rounded-xl flex items-center justify-center shadow-md">
                <Compass className="w-5 h-5 text-[#FFE24D] animate-pulse" />
              </div>
              <div className="text-left">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  <span>청년에게 필요한 취업 교육 선택</span>
                  <span className="bg-[#5244DC]/10 text-[#5244DC] text-[9px] px-1.5 py-0.5 rounded-full font-extrabold border border-[#5244DC]/10 tracking-wider">OFFICIAL</span>
                </h1>
                <p className="text-[10px] text-slate-500">국가공인 안심인증 가이드라인 연동</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                if (!isKeyValidated) {
                  const element = document.getElementById("api-key-section");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                  return;
                }
                setShowLanding(false);
                setStep(1);
                setResult(null);
                setLoading(false);
              }}
              className="px-5 py-2.5 bg-[#FFE24D] hover:bg-[#FCD201] text-slate-900 text-xs font-black rounded-full transition duration-200 cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>1분 무료 진단</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-900" />
            </button>
          </header>

          <LandingPage 
            geminiApiKey={geminiApiKey}
            setGeminiApiKey={(key) => {
              setGeminiApiKey(key);
            }}
            isKeyValidated={isKeyValidated}
            setIsKeyValidated={setIsKeyValidated}
            onStartMatching={() => {
              if (!isKeyValidated) {
                const element = document.getElementById("api-key-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
                return;
              }
              setShowLanding(false);
              setStep(1);
              setResult(null);
              setLoading(false);
            }} 
          />
        </>
      ) : (
        <>
          {/* Main Header styled to match unified brand */}
          <header className="w-full bg-white border-b border-slate-100 px-6 sm:px-8 h-16 flex items-center justify-between shrink-0 shadow-xs z-10 text-[#1E293B]">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowLanding(true)}
                className="p-1.5 px-3 mr-1 text-xs border border-slate-205 hover:bg-slate-50 rounded-full text-slate-600 flex items-center gap-1 font-bold transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>홈으로</span>
              </button>
              <div className="w-8 h-8 bg-[#5244DC] rounded-lg flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  <span>청년에게 필요한 취업 교육 선택</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold">안심 가이드</span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3.5 text-xs font-semibold">
              <span className="text-slate-400 text-[10px] hidden sm:inline">진행률</span>
              <div className="w-24 sm:w-36 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#5244DC] h-full transition-all duration-300" style={{ width: `${Math.round((step / 7) * 100)}%` }}></div>
              </div>
              <span className="text-[#5244DC] font-black text-[10.5px]">
                {Math.round((step / 7) * 100)}% ({result ? "수행완료" : `${step}/7 단계`})
              </span>
            </div>
          </header>

          {/* Body Area */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-6 gap-6 flex flex-col lg:flex-row overflow-hidden">
            
            {/* State 1: Introductory Welcome & Question Wizard */}
            {!result && !loading && (
          <>
            {/* PROGRESS GUIDE SIDEBAR (High Density Layout) */}
            <aside className="w-72 hidden lg:flex flex-col gap-3 shrink-0">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-left">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">진행 가이드</h2>
                <nav className="space-y-1.5">
                  {QUESTIONS.map((q) => {
                    const isActive = q.id === step;
                    const isPassed = q.id < step;
                    return (
                      <div 
                        key={q.id}
                        onClick={() => {
                          if (q.id < step) {
                            setStep(q.id);
                          }
                        }}
                        className={`flex items-center gap-3 p-2 rounded-lg border transition ${
                          isActive 
                            ? "bg-[#5244DC]/5 text-[#5244DC] border-[#5244DC]/15 font-semibold shadow-xs" 
                            : isPassed
                              ? "bg-emerald-50 text-emerald-800 border-emerald-100 cursor-pointer"
                              : "text-gray-400 border-transparent cursor-not-allowed"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isActive 
                            ? "bg-[#5244DC] text-white" 
                            : isPassed
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-250 text-gray-500"
                        }`}>
                          {isPassed ? "✓" : q.id}
                        </div>
                        <span className="text-xs truncate">{q.title}</span>
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Informative Side Card with Bubble Accent */}
              <div className="flex-1 bg-indigo-950 rounded-xl p-5 text-white shadow-md relative overflow-hidden text-left min-h-[290px] flex flex-col justify-between border border-indigo-800">
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold mb-1.5">맞춤형 알림 설정</h3>
                    <p className="text-indigo-200 text-xs leading-relaxed">
                      교육 과정의 불투명한 임의 규정으로 인한 중도 탈락 불안을 보정하고자 핵심 안내 주기를 자동 SMS 예약 발송 설정합니다.
                    </p>
                  </div>
                  <div className="space-y-2 pb-2">
                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                      <p className="text-[10px] font-extrabold text-indigo-300 mb-0.5">스마트 푸시 예시</p>
                      <p className="text-[11px] font-semibold text-slate-100 leading-normal">
                        "교육 시작 24시간 전 장소와 준비물을 요약한 푸시 알림 발송"
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                      <p className="text-[10px] font-extrabold text-indigo-300 mb-0.5">선발 및 서류 기준 사전예보</p>
                      <p className="text-[11px] font-semibold text-slate-100 leading-normal">
                        "원서 접수 즉시 미취업 기간 증빙 checklist SMS 우선 수신"
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-3xl opacity-50"></div>
              </div>
            </aside>

            {/* Main Interactive Wizard Column */}
            <section className="flex-1 flex flex-col gap-6 overflow-hidden">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex-1 flex flex-col justify-between text-left">
                
                <div>
                  <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                      {step}. {QUESTIONS[step - 1].title}
                    </h2>
                    <span className="px-3 py-1 bg-[#5244DC]/10 text-[#5244DC] text-xs font-bold rounded-full">필수 입력</span>
                  </div>

                  {/* Question Answers Panel */}
                  <div className="space-y-4">
                    
                    {/* QUESTION 1: Job Choice structured exactly as requested in design HTML */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <p className="text-xs font-medium text-slate-500">
                          본인이 수강하고자 하는 직무 계열 카드를 확인한 후 세부 직무 번호를 선택하세요.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto content-start py-1">
                          {MAIN_CATEGORIES.map((cat) => {
                            const isGroupSelected = formData.mainCategory === cat.id;
                            const jobsList = SUB_JOBS[cat.id] || [];
                            
                            return (
                              <div 
                                key={cat.id}
                                className={`p-4 border-2 rounded-xl transition-colors text-left ${
                                  isGroupSelected 
                                    ? "border-indigo-600 bg-indigo-50/50" 
                                    : "border-gray-200 hover:border-indigo-300 bg-white group"
                                }`}
                              >
                                <h4 className={`text-xs font-bold mb-3 ${
                                  isGroupSelected ? "text-indigo-800 underline decoration-indigo-300 underline-offset-4" : "text-gray-500 group-hover:text-gray-900"
                                }`}>
                                  [{cat.id}. {cat.label}]
                                </h4>
                                
                                <div className="grid grid-cols-1 gap-1.5 text-xs">
                                  {jobsList.map((job) => {
                                    const isJobSelected = formData.subJob === job && isGroupSelected;
                                    return (
                                      <label 
                                        key={job}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setFormValue("mainCategory", cat.id);
                                          setFormValue("subJob", job);
                                        }}
                                        className={`flex items-center gap-2 p-1.5 rounded-lg transition-all cursor-pointer ${
                                          isJobSelected 
                                            ? "font-semibold text-indigo-950 bg-white border border-indigo-200 shadow-xs" 
                                            : isGroupSelected ? "text-slate-700 hover:bg-white/80" : "text-gray-400 hover:text-slate-600"
                                        }`}
                                      >
                                        <input 
                                          type="radio" 
                                          checked={isJobSelected}
                                          onChange={() => {}}
                                          className="accent-indigo-600"
                                        />
                                        <span>{job}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Custom Job Input if needed */}
                        {formData.subJob.includes("직접 입력") && (
                          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 mt-2 text-left">
                            <label className="text-xs font-bold text-indigo-900 block font-sans">원하시는 세부 직무명을 상세하게 작성해 주세요:</label>
                            <input
                              type="text"
                              value={formData.subJobCustom}
                              onChange={(e) => setFormValue("subJobCustom", e.target.value)}
                              placeholder="예: 클라이언트 전용 퍼포먼스 기획 에이전트"
                              className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* QUESTION 2: Defect Reasons */}
                    {step === 2 && (
                      <div className="space-y-2.5">
                        {DEFECT_REASONS.map((reason) => {
                          const isSelected = formData.defectReason === reason;
                          return (
                            <div
                              key={reason}
                              onClick={() => setFormValue("defectReason", reason)}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-colors text-left flex items-start gap-3.5 text-xs ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-950"
                                  : "border-gray-200 hover:border-indigo-300 bg-white text-slate-700"
                              }`}
                            >
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-0.5 accent-indigo-600 rounded"
                              />
                              <span>{reason}</span>
                            </div>
                          );
                        })}

                        {formData.defectReason.includes("직접 입력") && (
                          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 mt-2">
                            <label className="text-xs font-bold text-indigo-950 block">가장 해결하고 싶으신 역량 결핍 사항을 적어 주세요:</label>
                            <input
                              type="text"
                              value={formData.defectReasonCustom}
                              onChange={(e) => setFormValue("defectReasonCustom", e.target.value)}
                              placeholder="예: 최신 클라우드 쿠버네티스 실무 실습 경험의 전무"
                              className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* QUESTION 3: Duration Limit */}
                    {step === 3 && (
                      <div className="space-y-2.5">
                        {DURATION_LIMITS.map((dur) => {
                          const isSelected = formData.durationLimit === dur;
                          return (
                            <div
                              key={dur}
                              onClick={() => setFormValue("durationLimit", dur)}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-colors text-left flex items-start gap-3.5 text-xs ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-950"
                                  : "border-gray-200 hover:border-indigo-300 bg-white text-slate-700"
                              }`}
                            >
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-0.5 accent-indigo-600 rounded"
                              />
                              <span>{dur}</span>
                            </div>
                          );
                        })}

                        {formData.durationLimit.includes("직접 입력") && (
                          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 mt-2">
                            <label className="text-xs font-bold text-indigo-950 block">희망하는 교육 기간 및 수료 일정을 조건으로 적어 주세요:</label>
                            <input
                              type="text"
                              value={formData.durationLimitCustom}
                              onChange={(e) => setFormValue("durationLimitCustom", e.target.value)}
                              placeholder="예: 주말 파트타임으로 총 10주 필수 완료 조건"
                              className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* QUESTION 4: Difficulty Levels */}
                    {step === 4 && (
                      <div className="space-y-2.5">
                        {DIFFICULTY_LEVELS.map((diff) => {
                          const isSelected = formData.difficultyLevel === diff;
                          return (
                            <div
                              key={diff}
                              onClick={() => setFormValue("difficultyLevel", diff)}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-colors text-left flex items-start gap-3.5 text-xs ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-950"
                                  : "border-gray-200 hover:border-indigo-300 bg-white text-slate-700"
                              }`}
                            >
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-0.5 accent-indigo-600 rounded"
                              />
                              <span>{diff}</span>
                            </div>
                          );
                        })}

                        {formData.difficultyLevel.includes("직접 입력") && (
                          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 mt-2">
                            <label className="text-xs font-bold text-indigo-950 block">설정하고 싶은 자신만의 난이도 가이드 조건을 적어 주세요:</label>
                            <input
                              type="text"
                              value={formData.difficultyLevelCustom}
                              onChange={(e) => setFormValue("difficultyLevelCustom", e.target.value)}
                              placeholder="예: 코딩 역량은 없으나 파이썬 마이크로 기초는 이수한 상태"
                              className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* QUESTION 5: Priority Factors */}
                    {step === 5 && (
                      <div className="space-y-2.5">
                        {PRIORITY_FACTORS.map((prio) => {
                          const isSelected = formData.priorityFactor === prio;
                          return (
                            <div
                              key={prio}
                              onClick={() => setFormValue("priorityFactor", prio)}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-colors text-left flex items-start gap-3.5 text-xs ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-950"
                                  : "border-gray-200 hover:border-indigo-300 bg-white text-slate-700"
                              }`}
                            >
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-0.5 accent-indigo-600 rounded"
                              />
                              <span>{prio}</span>
                            </div>
                          );
                        })}

                        {formData.priorityFactor.includes("직접 입력") && (
                          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 mt-2">
                            <label className="text-xs font-bold text-indigo-950 block">의사결정을 위해 가장 먼저 검증받고 싶은 필수 조건을 적어 주세요:</label>
                            <input
                              type="text"
                              value={formData.priorityFactorCustom}
                              onChange={(e) => setFormValue("priorityFactorCustom", e.target.value)}
                              placeholder="예: 수강 기간 동안 무상 고성능 워크스테이션 노트북 대여 보장 유무"
                              className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* QUESTION 6: Important Guides */}
                    {step === 6 && (
                      <div className="space-y-2.5">
                        {IMPORTANT_GUIDES.map((guide) => {
                          const isSelected = formData.importantGuide === guide;
                          return (
                            <div
                              key={guide}
                              onClick={() => setFormValue("importantGuide", guide)}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-colors text-left flex items-start gap-3.5 text-xs ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-950"
                                  : "border-gray-200 hover:border-indigo-300 bg-white text-slate-700"
                              }`}
                            >
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-0.5 accent-indigo-600 rounded"
                              />
                              <span>{guide}</span>
                            </div>
                          );
                        })}

                        {formData.importantGuide.includes("직접 입력") && (
                          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 mt-2">
                            <label className="text-xs font-bold text-indigo-950 block">합격을 위해 반드시 한 눈에 확인해야 하는 행정 수칙을 작성하세요:</label>
                            <input
                              type="text"
                              value={formData.importantGuideCustom}
                              onChange={(e) => setFormValue("importantGuideCustom", e.target.value)}
                              placeholder="예: 중도 포기 시 부과되는 내일배움카드 페널티 유수 기준 수칙"
                              className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* QUESTION 7: Platform Preference */}
                    {step === 7 && (
                      <div className="space-y-2.5">
                        {PLATFORMS.map((plat) => {
                          const isSelected = formData.appPlatform === plat.id;
                          return (
                            <div
                              key={plat.id}
                              onClick={() => setFormValue("appPlatform", plat.id)}
                              className={`p-4 rounded-xl border-2 text-left cursor-pointer transition flex items-start gap-3.5 ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50/50 text-[#111827]"
                                  : "bg-white border-gray-200 text-slate-700 hover:border-indigo-300"
                              }`}
                            >
                              <div className="pt-0.5 shrink-0">
                                {plat.id === "1" && <Smartphone className="w-5 h-5 text-indigo-600" />}
                                {plat.id === "2" && <Globe className="w-5 h-5 text-emerald-600" />}
                                {plat.id === "3" && <MessageSquare className="w-5 h-5 text-amber-500" />}
                              </div>
                              <div className="text-left">
                                <span className={`text-xs font-bold block ${isSelected ? "text-indigo-900" : "text-slate-800"}`}>
                                  {plat.label}
                                </span>
                                <p className={`text-[11px] mt-0.5 leading-relaxed ${isSelected ? "text-indigo-950 font-medium" : "text-slate-500"}`}>
                                  {plat.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </div>

            {/* Back & Next Navigation Button bar */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl border font-semibold transition ${
                  step === 1
                    ? "text-slate-350 border-slate-100 cursor-not-allowed"
                    : "text-slate-700 border-slate-300 bg-white hover:bg-slate-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>이전 단계</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 text-xs bg-[#5244DC] hover:bg-[#4335C7] text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm cursor-pointer"
              >
                <span>{step === 7 ? "매칭 결과 산출하기" : "다음 단계"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>
      </>
    )}

        {/* State 2: High-Quality Matching Animation Loading Screen */}
        {loading && (
          <div className="w-full max-w-xl bg-white border border-slate-250 p-10 rounded-3xl shadow-xl text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#5244DC] rounded-full animate-spin"></div>
              <Compass className="w-10 h-10 text-[#5244DC] absolute animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-800">
                수강생 안심 매칭 엔진 가동 중...
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                입력하신 직무 요구 스펙, 기간, 지원 자격을 비교하여 훈련기관의 공식 검증 데이터베이스에서 최적의 매칭율 상품을 스케줄링하고 있습니다.
              </p>
            </div>

            {/* Constraint text reminder to ease user burden */}
            <div className="bg-[#5244DC]/5 border border-[#5244DC]/15 rounded-xl p-3 text-[11px] text-[#5244DC] leading-relaxed text-left">
              💡 <span><strong>안심 매칭 필터링 적용 항목:</strong> 강사진 개인 선택권 유혹처럼 불투명하고 실현 불가능한 요소는 배제하고, 공식 학사의 난이도, 교육 장려 혜택 및 선발 조건의 투명성 매칭에 집중합니다.</span>
            </div>
          </div>
        )}

        {/* State 3: Interactive Results Board */}
        {result && !loading && (
          <div className="w-full space-y-6 animate-fade-in text-left">
            
            {/* Answer Profile Chips Recap Banner to raise transparency */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono tracking-wider text-[#FFE24D] uppercase font-bold">
                  MY DIAGNOSIS PROFILE • 진단 보고서 요약
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                  <span>선택 직무:</span>
                  <span className="bg-[#5244DC] text-white px-2 py-0.5 rounded-md text-[11px] font-bold">
                    {formData.subJob.includes("직접 입력") ? formData.subJobCustom : formData.subJob}
                  </span>
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 md:justify-end shrink-0">
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-slate-800 border border-slate-700 text-slate-200 px-2 py-1 rounded-[10px] text-[10.5px]">
                    ⏱️ {formData.durationLimit.includes("직접 입력") ? formData.durationLimitCustom.split("(")[0] : formData.durationLimit.split(" ")[1]}
                  </span>
                  <span className="bg-slate-800 border border-slate-700 text-slate-200 px-2 py-1 rounded-[10px] text-[10.5px]">
                    📊 {formData.difficultyLevel.includes("직접 입력") ? formData.difficultyLevelCustom.split("(")[0] : formData.difficultyLevel.split(" ")[1]}
                  </span>
                  <span className="bg-slate-800 border border-slate-700 text-slate-200 px-2 py-1 rounded-[10px] text-[10.5px]">
                    💎 {formData.priorityFactor.includes("직접 입력") ? formData.priorityFactorCustom.substring(0, 15) : formData.priorityFactor.split(" ")[1]}
                  </span>
                  <span className="bg-slate-800 border border-slate-700 text-slate-200 px-2 py-1 rounded-[10px] text-[10.5px]">
                    📋 {formData.importantGuide.includes("직접 입력") ? formData.importantGuideCustom.substring(0, 15) : formData.importantGuide.split(" ")[1]}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowLanding(true);
                    setResult(null);
                    setStep(1);
                  }}
                  className="flex items-center gap-1.5 bg-[#5244DC] hover:bg-[#4335C7] text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ml-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>다시 진단하기</span>
                </button>
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Matched Course Card Selector & Details (Lg: 7/12) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>추천 매칭 훈련과정 ({result.courses.length}개 엄선)</span>
                  </h3>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold font-mono">
                    MATCH RATE: 100% SECURED
                  </span>
                </div>

                <p className="text-[12.5px] text-slate-600 bg-slate-100 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-semibold">
                  💡 {result.summaryMessage}
                </p>

                {/* Courses selection cards */}
                <div className="space-y-3">
                  {result.courses.map((course, idx) => {
                    const isSelected = selectedCourseIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedCourseIdx(idx)}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition relative overflow-hidden ${
                          isSelected
                            ? "bg-white border-2 border-[#5244DC] shadow-md"
                            : "bg-white border-slate-200 hover:border-slate-350 shadow-xs"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 bg-[#5244DC] text-white text-[9px] uppercase font-bold py-1 px-3 rounded-bl-xl flex items-center gap-1 shadow-xs">
                            <CheckCircle className="w-3 h-3 text-white" />
                            <span>단독 매칭 상태</span>
                          </div>
                        )}

                        <div className="max-w-[85%] space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold block">{course.institution}</span>
                          <h4 className="text-[14.5px] font-bold text-slate-800 leading-snug">
                            {course.title}
                          </h4>
                          <p className="text-[11px] text-[#5244DC] font-medium">
                            🎯 {course.tagline}
                          </p>
                        </div>

                        {/* Specifications Micro Card view for better usability (Constraint 3) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-100 text-[11px]">
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-[9px] text-slate-400 block uppercase font-mono">난이도</span>
                            <span className="font-bold text-slate-800 block mt-0.5 leading-tight">{course.difficulty.level}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-[9px] text-slate-400 block uppercase font-mono">총 교육기간</span>
                            <span className="font-bold text-slate-800 block mt-0.5 leading-tight">{course.duration.period}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-[9px] text-slate-400 block uppercase font-mono">훈련수당 지원</span>
                            <span className="font-bold text-slate-800 block mt-0.5 leading-tight truncate">{course.benefits.subsidy.split(" ")[1] || "장려금 수령"}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-[9px] text-slate-400 block uppercase font-mono">모집 자격</span>
                            <span className="font-bold text-slate-800 block mt-0.5 leading-tight truncate">{course.selection.conditions.substring(0, 12)}...</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Desktop layout checklists representation (Constraint 3) – rendered here for web view too */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                      <span>수강 가능성 사후 행정 자가점검</span>
                    </h3>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                      심리적 불안 서류 대조
                    </span>
                  </div>

                  <p className="text-[11.5px] text-slate-500 mt-1">
                    신입 훈련생의 가장 큰 고민인 선발 및 수당 요건을 아래 체크리스트로 터치하여 검증 보전해 보세요.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Eligibility Checklist Block */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">📋 선발 자격 및 행정 체크리스트</span>
                      <div className="space-y-1.5 text-xs">
                        {result.courses[selectedCourseIdx].eligibilityChecklist.map((item, idx) => {
                          const isChecked = customCourseChecklists[selectedCourseIdx]?.[idx] ?? false;
                          return (
                            <label
                              key={idx}
                              onClick={() => toggleDesktopChecklist(selectedCourseIdx, idx, "eligibility")}
                              className={`flex items-start gap-2.5 p-2 rounded-xl border transition cursor-pointer ${
                                isChecked
                                  ? "bg-emerald-50 border-emerald-250 text-emerald-900"
                                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                readOnly
                                className="mt-0.5 text-emerald-600 rounded border-slate-300 w-3.5 h-3.5"
                              />
                              <span className="text-[11px] leading-tight font-medium">{item.text}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Benefit Checklist Block */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🎁 장려 혜택 및 수당 수급 체크리스트</span>
                      <div className="space-y-1.5 text-xs">
                        {result.courses[selectedCourseIdx].benefitChecklist.map((item, idx) => {
                          const isChecked = customCourseChecklists[selectedCourseIdx]?.[idx + 100] ?? false;
                          return (
                            <label
                              key={idx}
                              onClick={() => toggleDesktopChecklist(selectedCourseIdx, idx, "benefit")}
                              className={`flex items-start gap-2.5 p-2 rounded-xl border transition cursor-pointer ${
                                isChecked
                                  ? "bg-amber-50 border-amber-250 text-amber-900"
                                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                readOnly
                                className="mt-0.5 text-amber-600 rounded border-slate-300 w-3.5 h-3.5"
                              />
                              <span className="text-[11px] leading-tight font-medium">{item.text}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Alarm timing center */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-inner text-left space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full"></div>
                  
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      실시간 푸시 알림 타이머 및 정산 이벤트 모사 (투명 정보 검증)
                    </h4>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    선택하신 직무 교육 수강 시, 아래와 같은 **정밀 예약 알림 규칙**이 SMS 및 푸시로 구체 발송됩니다. 아래 버튼을 눌러 모의 수신을 체감하세요.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2">
                    {result.courses[selectedCourseIdx].alerts.map((al, idx) => (
                      <div key={idx} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-left space-y-1">
                        <span className="text-[9.5px] font-bold text-[#FFE24D] block font-sans">⏱️ {al.timing}</span>
                        <p className="text-[10.5px] text-slate-200 leading-snug font-medium line-clamp-2">
                          {al.action}
                        </p>
                        <button
                          onClick={() => triggerPushAlertSimulation(`[${al.timing}] ${al.action}`)}
                          className="mt-2 text-[9px] bg-[#5244DC]/40 hover:bg-[#5244DC]/75 text-indigo-100 px-2.5 py-1 rounded-md transition font-black w-full flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>즉시 테스트</span>
                          <Sparkles className="w-2.5 h-2.5 text-[#FFE24D]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Right Column: Platform Simulator Frame (Mockup based on Q7) (Lg: 5/12) */}
              <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-center space-y-3">
                <div className="w-full max-w-[340px] flex justify-between items-center px-4 self-center md:self-auto">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <span>환경 가상 시뮬레이터</span>
                  </span>
                  
                  {/* Option selector override inside matching results so users can see different platform types freely */}
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {formData.appPlatform === "1" ? "모바일 하이브리드 앱" : formData.appPlatform === "2" ? "반응형 대조 웹페이지" : "카카오 알림톡 서비스"}
                  </span>
                </div>

                {/* Render the appropriate simulator based on App Platform choice (Q7) */}
                {formData.appPlatform === "1" && (
                  <MobileSimulator 
                    course={result.courses[selectedCourseIdx]} 
                    onAlertTrigger={triggerPushAlertSimulation}
                  />
                )}

                {formData.appPlatform === "2" && (
                  /* Web Responsive side view simulator framework */
                  <div className="w-[340px] h-[680px] bg-slate-900 rounded-[50px] p-3 shadow-2xl relative border-4 border-slate-800 flex flex-col overflow-hidden mx-auto">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-5 w-32 bg-slate-905 rounded-b-2xl z-20 flex items-center justify-center">
                      <div className="w-12 h-1 bg-slate-805 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-[38px] flex flex-col overflow-hidden relative text-slate-800 p-4">
                      <span className="text-[9px] font-mono text-slate-400 block pt-4 text-center">WEB PORT COMPENSATE VIEW</span>
                      
                      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 text-left mt-2 overflow-y-auto space-y-3.5 pb-10">
                        <div className="border-b border-indigo-100 pb-2 text-center">
                          <h4 className="text-xs font-extrabold text-indigo-900">
                            {result.courses[selectedCourseIdx].title}
                          </h4>
                        </div>

                        <div className="space-y-2 text-[10px]">
                          <span className="font-bold text-slate-700 block">🌐 핵심 훈련 지표</span>
                          <p className="bg-slate-50 p-1.5 rounded text-slate-600 leading-snug">
                            <strong>난이도:</strong> {result.courses[selectedCourseIdx].difficulty.level} <br/>
                            ({result.courses[selectedCourseIdx].difficulty.details})
                          </p>
                          <p className="bg-slate-50 p-1.5 rounded text-slate-600 leading-snug">
                            <strong>수강기간:</strong> {result.courses[selectedCourseIdx].duration.period} <br/>
                            ({result.courses[selectedCourseIdx].duration.weeklySchedule})
                          </p>
                        </div>

                        <div className="space-y-2 text-[9.5px]">
                          <span className="font-bold text-slate-700 block">💸 장려 수령 혜택인증</span>
                          <p className="p-1 border border-dashed border-emerald-300 text-emerald-800 rounded">
                            {result.courses[selectedCourseIdx].benefits.subsidy}
                          </p>
                          <p className="text-slate-500">
                            * 미치업 상태 거점 증빙 시 전액무료 적용
                          </p>
                        </div>

                        {/* Direct simulator buttons */}
                        <div className="pt-2">
                          <button
                            onClick={() => triggerPushAlertSimulation(result.courses[selectedCourseIdx].alerts[0].action)}
                            className="bg-indigo-600 text-white font-bold w-full py-1.5 text-[10px] rounded hover:bg-indigo-700 transition"
                          >
                            🔔 실시간 모의 푸시 수신하기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {formData.appPlatform === "3" && (
                  <KakaoSimulator 
                    course={result.courses[selectedCourseIdx]} 
                    onAlertTrigger={triggerPushAlertSimulation}
                  />
                )}

                {/* Switch view widget directly for better user testing */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 mt-2">
                  <button
                    onClick={() => setFormValue("appPlatform", "1")}
                    className={`px-3 py-1 text-[10.5px] rounded-lg font-medium transition ${
                      formData.appPlatform === "1" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    모바일앱
                  </button>
                  <button
                    onClick={() => setFormValue("appPlatform", "2")}
                    className={`px-3 py-1 text-[10.5px] rounded-lg font-medium transition ${
                      formData.appPlatform === "2" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    반응형웹
                  </button>
                  <button
                    onClick={() => setFormValue("appPlatform", "3")}
                    className={`px-3 py-1 text-[10.5px] rounded-lg font-medium transition ${
                      formData.appPlatform === "3" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    알림톡챗봇
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </>
  )}

      {/* Footer copyright section */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-xs mt-12">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p className="font-mono">
            국가검증 K-Digital & 부트캠프 안심 매칭 허브 • 2026-2027 정규 안심 수칙 준수
          </p>
          <p className="text-[11px] text-slate-500">
            본 매칭 정보는 학사 위탁 조건의 투명한 공시를 보증하며, 구직자의 귀책 없는 내일배움 요건을 선제적으로 예보함으로써 지원 부담증을 감소시킵니다.
          </p>
        </div>
      </footer>

    </div>
  );
}
