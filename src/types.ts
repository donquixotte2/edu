export interface SelectionOption {
  id: string;
  label: string;
  description?: string;
}

export interface DirectInputState {
  jobDirect?: string;
  defectDirect?: string;
  durationDirect?: string;
  difficultyDirect?: string;
  priorityDirect?: string;
  guideDirect?: string;
}

export interface FormData {
  mainCategory: string; // "1" | "2" | "3" | "4"
  subJob: string; // Direct text or index description
  subJobCustom: string;
  defectReason: string; // 결핍 요인
  defectReasonCustom: string;
  durationLimit: string; // 기간 조건
  durationLimitCustom: string;
  difficultyLevel: string; // 난이도
  difficultyLevelCustom: string;
  priorityFactor: string; // 최우선 조건
  priorityFactorCustom: string;
  importantGuide: string; // 핵심 안내 사항
  importantGuideCustom: string;
  appPlatform: string; // "1" | "2" | "3" - 앱 개발 형태
}

export interface MatchedCourse {
  title: string;
  institution: string;
  tagline: string;
  
  // 4 Core metrics (난이도, 기간, 혜택, 선발 조건) that are card summarized
  difficulty: {
    level: string;
    details: string;
  };
  duration: {
    period: string;
    weeklySchedule: string;
  };
  benefits: {
    subsidy: string;
    materials: string;
    support: string;
  };
  selection: {
    process: string;
    conditions: string;
  };
  
  // Interactive Checklist elements
  eligibilityChecklist: {
    text: string;
    checked: boolean;
  }[];
  benefitChecklist: {
    text: string;
    checked: boolean;
  }[];
  
  // Concrete alerts preview
  alerts: {
    timing: string;   // e.g. "교육 시작 24시간 전"
    action: string;   // e.g. "장소와 준비물을 요약한 푸시 알림 발송"
    type: "important" | "info" | "success" | "warning";
  }[];
}

export interface MatchResponse {
  courses: MatchedCourse[];
  summaryMessage: string;
}
