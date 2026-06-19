import React, { useState } from "react";
import { MatchedCourse } from "../types";
import { CheckCircle, AlertCircle, Sparkles, Bell, Calendar, Inbox, ArrowRight } from "lucide-react";

interface MobileSimulatorProps {
  course: MatchedCourse;
  onAlertTrigger: (message: string) => void;
}

export default function MobileSimulator({ course, onAlertTrigger }: MobileSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"home" | "tasks" | "inbox">("home");
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [benefitCheck, setBenefitCheck] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setChecklist(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleBenefitCheck = (idx: number) => {
    setBenefitCheck(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="w-[340px] h-[680px] bg-slate-900 rounded-[50px] p-3 shadow-2xl relative border-4 border-slate-800 flex flex-col overflow-hidden mx-auto">
      {/* Phone Notch & Ear Speaker */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-5 w-32 bg-slate-905 rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
      </div>

      {/* Screen Container */}
      <div className="flex-1 bg-slate-50 rounded-[38px] flex flex-col overflow-hidden relative text-slate-800">
        
        {/* Status Bar */}
        <div className="pt-5 px-6 pb-2 bg-white flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-slate-100">
          <span>09:41 AM</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
            <span>LTE</span>
            <span>98%</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
          
          {/* Header */}
          <div className="mb-4 bg-gradient-to-tr from-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-sm text-left">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                MEMBER CERTIFIED
              </span>
            </div>
            <h3 className="font-display font-bold text-sm tracking-tight text-white line-clamp-2 leading-snug">
              {course.title}
            </h3>
            <p className="text-[10px] text-slate-300 mt-0.5">
              {course.institution}
            </p>
          </div>

          {/* Quick Stats Tabs */}
          <div className="flex gap-1.5 mb-4">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "home" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              상세 요약
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "tasks" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              선발 진단 ({Object.values(checklist).filter(Boolean).length}/{course.eligibilityChecklist.length})
            </button>
            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "inbox" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              안내 알림 ({course.alerts.length})
            </button>
          </div>

          {/* Tab 1: Core Details */}
          {activeTab === "home" && (
            <div className="space-y-3.5 text-left">
              {/* Tagline */}
              <div className="bg-amber-50 border border-amber-100 text-amber-800 text-[11px] p-2.5 rounded-xl font-medium">
                🎯 {course.tagline}
              </div>

              {/* 4 Block Cards (Strict Specifications) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">difficulty. 난이도</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">{course.difficulty.level}</span>
                  <p className="text-[9px] text-slate-500 mt-1 leading-tight">{course.difficulty.details}</p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">duration. 기간</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">{course.duration.period}</span>
                  <p className="text-[9px] text-slate-500 mt-1 leading-tight">{course.duration.weeklySchedule}</p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs col-span-2">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">benefits. 혜택</span>
                  <div className="mt-1 space-y-1">
                    <p className="text-[10px] text-slate-700 leading-snug">🪙 <strong className="text-slate-900">장려금:</strong> {course.benefits.subsidy}</p>
                    <p className="text-[10px] text-slate-700 leading-snug">💻 <strong className="text-slate-900">기기/도서:</strong> {course.benefits.materials}</p>
                    <p className="text-[10px] text-slate-700 leading-snug">👔 <strong className="text-slate-900">사후관리:</strong> {course.benefits.support}</p>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs col-span-2">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">requirements. 선발 및 자격</span>
                  <div className="mt-1 space-y-1">
                    <p className="text-[10px] text-slate-700 leading-tight">⚙️ <strong className="text-slate-900">절차:</strong> {course.selection.process}</p>
                    <p className="text-[10px] text-slate-700 leading-tight">📋 <strong className="text-slate-900">조건:</strong> {course.selection.conditions}</p>
                  </div>
                </div>
              </div>

              {/* Notice text minimized, simplified button */}
              <button 
                onClick={() => setActiveTab("tasks")}
                className="w-full bg-slate-905 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs py-2 rounded-xl font-medium flex items-center justify-center gap-1.5 transition hover:bg-indigo-100"
              >
                <span>필수 지원요건 확인하러 가기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Tab 2: Selection Diagnostic Checklists */}
          {activeTab === "tasks" && (
            <div className="space-y-4 text-left">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>행정/자격 필수 요건</span>
                </h4>
                <p className="text-[10px] text-slate-500 mb-2">
                  수강 전 본인이 아래 자격에 부수되는지 실주소로 터치/체크해보세요.
                </p>
                <div className="space-y-1.5">
                  {course.eligibilityChecklist.map((item, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-2.5 p-2 rounded-xl border transition cursor-pointer ${
                        checklist[idx]
                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                          : "bg-white border-slate-150 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checklist[idx]}
                        onChange={() => toggleCheck(idx)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 border-slate-300"
                      />
                      <span className="text-[11px] leading-tight font-medium">
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>훈련 혜택 검증 항목</span>
                </h4>
                <div className="space-y-1.5">
                  {course.benefitChecklist.map((item, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-2.5 p-2 rounded-xl border transition cursor-pointer ${
                        benefitCheck[idx]
                          ? "bg-amber-50/50 border-amber-200 text-amber-900"
                          : "bg-white border-slate-150 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!benefitCheck[idx]}
                        onChange={() => toggleBenefitCheck(idx)}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 border-slate-300"
                      />
                      <span className="text-[11px] leading-tight font-medium">
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Detailed Concrete Notification Feeds */}
          {activeTab === "inbox" && (
            <div className="space-y-3.5 text-left">
              <div className="bg-slate-100 p-2.5 rounded-xl">
                <p className="text-[10.5px] text-slate-600 leading-relaxed font-medium">
                  📢 해당 정밀 훈련 과정은 아래의 **스케줄링 주기적 이벤트 알림**이 휴대폰으로 즉시 전발됩니다. (추상적이지 않은 투명 조건 보증)
                </p>
              </div>

              <div className="space-y-2.5">
                {course.alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-150 shadow-xs relative overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                      <span className="text-[10.5px] font-bold text-indigo-700">
                        🔔 {alert.timing}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                      {alert.action}
                    </p>

                    <button
                      onClick={() => onAlertTrigger(`[${alert.timing}] ${alert.action}`)}
                      className="mt-2 text-[9.5px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 justify-end ml-auto"
                    >
                      <Bell className="w-3 h-3 text-indigo-500" />
                      <span>수신 푸시 미리보기</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Tab Nav */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-100 px-6 flex justify-around items-center rounded-b-[42px] z-10 text-[10px] text-slate-400">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 ${activeTab === "home" ? "text-indigo-600 font-bold" : "hover:text-slate-600"}`}
          >
            <Inbox className="w-4 h-4" />
            <span>훈련 스펙</span>
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex flex-col items-center gap-1 ${activeTab === "tasks" ? "text-indigo-600 font-bold" : "hover:text-slate-600"}`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>선발 진단</span>
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex flex-col items-center gap-1 ${activeTab === "inbox" ? "text-indigo-600 font-bold" : "hover:text-slate-600"}`}
          >
            <Bell className="w-4 h-4" />
            <span>요약 알림</span>
          </button>
        </div>

      </div>
    </div>
  );
}
