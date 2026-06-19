import React, { useState } from "react";
import { MatchedCourse } from "../types";
import { Send, Bell, CheckCircle, Smartphone, AlertTriangle } from "lucide-react";

interface KakaoSimulatorProps {
  course: MatchedCourse;
  onAlertTrigger: (message: string) => void;
}

export default function KakaoSimulator({ course, onAlertTrigger }: KakaoSimulatorProps) {
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  const toggleCheck = (idx: number) => {
    setChecklist(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="w-[340px] h-[680px] bg-slate-900 rounded-[50px] p-3 shadow-2xl relative border-4 border-slate-800 flex flex-col overflow-hidden mx-auto">
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-5 w-32 bg-slate-905 rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-12 h-1 bg-slate-805 rounded-full"></div>
      </div>

      {/* Screen area styled like KakaoTalk chat */}
      <div className="flex-1 bg-[#BACEE0] rounded-[38px] flex flex-col overflow-hidden relative text-slate-800">
        
        {/* Kakao Header bar */}
        <div className="pt-6 px-4 pb-3 bg-[#BACEE0] flex items-center justify-between border-b border-[#a9c0d4] z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-[11px] font-bold text-amber-950 shadow-xs">
              청년
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span>내일배움 안심알리미</span>
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
              </div>
              <span className="text-[9px] text-[#556677]">알림톡 수신 공식채널</span>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800/10 text-slate-700 px-1.5 py-0.5 rounded font-mono">LTE</span>
        </div>

        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 pb-16">
          
          {/* Welcome Info Message */}
          <div className="text-center">
            <span className="bg-black/10 text-white text-[9px] px-2.5 py-1 rounded-full inline-block font-mono">
              2026년 06월 19일 금요일
            </span>
          </div>

          <div className="flex items-start gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-amber-950 font-bold text-[9px] flex items-center justify-center shrink-0">
              알리미
            </div>
            <div className="max-w-[75%] bg-white rounded-r-xl rounded-bl-xl p-3 text-left text-xs shadow-xs text-slate-800 space-y-1.5">
              <p className="font-semibold text-indigo-900">👋 안녕하세요 청년 수강생님!</p>
              <p className="leading-relaxed text-[11px]">
                신청하신 <strong>{course.title}</strong> 과정의 핵심 조건인 기간, 혜택, 선발 요건을 투명하게 요약해 보내드립니다.
              </p>
            </div>
          </div>

          {/* Yellow Official Kakao AlimTalk Box representing specifications */}
          <div className="flex items-start gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-amber-950 font-bold text-[9px] flex items-center justify-center shrink-0">
              알리미
            </div>
            <div className="max-w-[82%] bg-white rounded-xl border border-slate-250 overflow-hidden shadow-sm text-left">
              <div className="bg-[#FFE812] p-2.5 flex justify-between items-center border-b border-[#e5d010]">
                <span className="text-[10.5px] font-bold text-[#3C1E1E]">💬 [알림톡] 교육 매칭 보고서</span>
                <span className="text-[9px] bg-[#3C1E1E] text-yellow-300 px-1 rounded font-bold">인증됨</span>
              </div>

              <div className="p-3.5 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">기관명</span>
                  <span className="text-[11.5px] font-bold text-slate-800">{course.institution}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1.5 border-t border-slate-100">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-mono">⚙️ 난이도</span>
                    <span className="text-[11px] font-bold text-slate-700 block">{course.difficulty.level}</span>
                    <span className="text-[8.5px] text-slate-500 leading-tight block mt-0.5">{course.difficulty.details}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-mono">📅 기간/스케줄</span>
                    <span className="text-[11px] font-bold text-slate-700 block">{course.duration.period}</span>
                    <span className="text-[8.5px] text-slate-500 leading-tight block mt-0.5">{course.duration.weeklySchedule}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                  <span className="text-[9px] text-slate-400 block font-mono">🎁 훈련 수혜 요약</span>
                  <p className="text-slate-700">💰 <strong>훈련장려:</strong> {course.benefits.subsidy}</p>
                  <p className="text-slate-700">💻 <strong>무상지원:</strong> {course.benefits.materials}</p>
                  <p className="text-slate-700">👔 <strong>취업지원:</strong> {course.benefits.support}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-[9px] text-slate-400 block font-mono">✔️ 세부 선발 요건</span>
                  <p className="text-slate-700">💡 <strong>과정:</strong> {course.selection.process}</p>
                  <p className="text-slate-700 leading-tight mt-0.5 text-slate-600">⚠️ {course.selection.conditions}</p>
                </div>

                {/* Simulated Click Actions inside KakaoTalk */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <button
                    onClick={() => setShowChecklistModal(true)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>필수 자격 진단하기 ({completedCount}/{course.eligibilityChecklist.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      const firstAlert = course.alerts[0];
                      onAlertTrigger(`[${firstAlert.timing}] ${firstAlert.action}`);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1"
                  >
                    <Bell className="w-3.5 h-3.5 text-yellow-300" />
                    <span>24시간 전 푸시 알림 미리 받기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timely push notices demonstration balloon */}
          <div className="flex items-start gap-1.5 mt-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-amber-950 font-bold text-[9px] flex items-center justify-center shrink-0">
              알리미
            </div>
            <div className="max-w-[75%] bg-white rounded-r-xl rounded-bl-xl p-3 text-left text-xs shadow-xs text-slate-800 space-y-2">
              <p className="font-semibold text-slate-900">⏰ 확정된 푸시 스케줄링 안내</p>
              <div className="space-y-1.5 text-[10.5px]">
                {course.alerts.map((al, idx) => (
                  <div key={idx} className="bg-slate-50 p-1.5 rounded border border-slate-100">
                    <span className="text-[9.5px] text-indigo-700 font-bold block">🔔 {al.timing}</span>
                    <p className="text-slate-700 text-[10px] mt-0.5 leading-snug">{al.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Input Bar simulating writing a prompt */}
        <div className="absolute bottom-0 inset-x-0 h-14 bg-white border-t border-slate-200 px-4 flex items-center gap-2 rounded-b-[42px] z-10">
          <input
            type="text"
            readOnly
            placeholder="알림톡 정밀 진단 모드가 동작 중입니다..."
            className="flex-1 bg-slate-100 text-[10px] px-3 py-1.5 rounded-full border border-slate-200 outline-none text-slate-400 text-left"
          />
          <button className="p-1.5 bg-[#FFE812] text-amber-950 rounded-full hover:bg-yellow-400 cursor-not-allowed">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Checklist Interactive Dialog popup inside phone screen */}
      {showChecklistModal && (
        <div className="absolute inset-0 bg-black/60 rounded-[38px] z-30 flex items-end justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-t-2xl w-full max-h-[75%] overflow-y-auto p-4 space-y-3.5 text-left shadow-lg">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>선발 자격 투명 진단</span>
              </h4>
              <button
                onClick={() => setShowChecklistModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold font-mono"
              >
                닫기
              </button>
            </div>

            <p className="text-[10px] text-slate-500">
              학사 행정 선발 절차에 필요한 필수 요건들을 미리 확인하고 서류 불안감을 해소하세요:
            </p>

            <div className="space-y-1.5">
              {course.eligibilityChecklist.map((item, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-2 p-2 rounded-xl border transition cursor-pointer ${
                    checklist[idx]
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checklist[idx]}
                    onChange={() => toggleCheck(idx)}
                    className="mt-0.5 rounded text-emerald-600 w-3.5 h-3.5 border-slate-300"
                  />
                  <span className="text-[10.5px] font-medium leading-tight">{item.text}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowChecklistModal(false)}
              className="w-full bg-[#FFE812] text-[#3C1E1E] text-xs py-2 rounded-xl font-bold border border-yellow-400 transition hover:bg-yellow-400"
            >
              진단 완료 ({completedCount}개 통과)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
