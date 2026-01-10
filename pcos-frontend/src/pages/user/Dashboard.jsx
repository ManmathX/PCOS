import React from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Activity,
  Target,
  BookOpen,
  FileText,
  LogOut,
  Menu,
  X,
  ClipboardList,
  ChevronRight,
  Bell,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { NotificationBell } from "../../components/notifications/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";

// Import page components
import { CycleTrackingPage } from "./CycleTrackingPage";
import { SymptomLogPage } from "./SymptomLogPage";
import { RiskReportPage } from "./RiskReportPage";
import { HabitsPage } from "./HabitsPage";
import { AppointmentPrepPage } from "./AppointmentPrepPage";
import DailyLogPage from "./DailyLogPage";
import ComprehensiveHealthPage from "./ComprehensiveHealthPage";
import { NextCyclePrediction } from "../../components/prediction/NextCyclePrediction";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Shared components
import { SurveyInsightsCard } from "../../components/survey/SurveyInsightsCard";

const Overview = () => {
  const { user } = useAuth();
  const { data: riskData } = useQuery({
    queryKey: ["risk", "latest"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/risk/latest`);
        return response.data;
      } catch {
        return null;
      }
    },
    retry: false,
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Hi, {user?.firstName || "there"}! 👋
          </h2>
          <p className="text-slate-500 font-medium">
            Here's what's happening with your wellness today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="medical-disclaimer py-2 px-4 shadow-sm">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-semibold">Medical Awareness Mode</span>
          </div>
        </div>
      </div>

      {/* Hero Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Comprehensive Health Tracker Highlight */}
        <div className="lg:col-span-7 group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-vibrant-purple-600 to-soft-pink-500 p-8 text-white shadow-xl transition-all duration-500 hover:shadow-glow-purple hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Most Used</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Health Ecosystem
              </h3>
              <p className="text-purple-100 text-lg leading-relaxed max-w-md">
                Your unified dashboard for nutrition, mood, sleep, and medication tracking.
              </p>
            </div>
            
            <div className="mt-8">
              <Link
                to="/user/health"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-vibrant-purple-600 rounded-2xl hover:bg-slate-50 transition-all font-bold shadow-lg active:scale-95 group/btn"
              >
                Launch Tracker 
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Next Cycle Prediction */}
        <div className="lg:col-span-5 glass-card p-0 overflow-hidden group">
          <div className="p-8 h-full flex flex-col">
            <NextCyclePrediction />
          </div>
        </div>
      </div>

      {/* Survey Insights Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-soft-pink-50 to-vibrant-purple-50 rounded-[2.5rem] -m-4"></div>
        <div className="relative z-10 p-4">
          <SurveyInsightsCard />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
          <span className="text-sm font-semibold text-soft-pink-600 cursor-pointer hover:underline">View All</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { to: "/user/daily-log", icon: ClipboardList, color: "bg-vibrant-purple-50 text-vibrant-purple-600", label: "Daily Log", desc: "Log your mood & activity", action: "Log Now" },
            { to: "/user/cycle", icon: Calendar, color: "bg-soft-pink-50 text-soft-pink-600", label: "Cycle Tracking", desc: "Manage your periods", action: "Update" },
            { to: "/user/appointment", icon: FileText, color: "bg-blue-50 text-blue-600", label: "Appt. Prep", desc: "Generate doctor report", action: "Prepare" }
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="card group border-none shadow-soft hover:shadow-lift flex flex-col items-start gap-4 p-7"
            >
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <item.icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">{item.label}</h4>
                <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 transition-colors">
                  {item.action} <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/user/symptoms" className="glass-card hover:bg-white p-6 text-center group">
            <Activity className="w-8 h-8 text-sage-600 mb-3 mx-auto group-hover:animate-bounce" />
            <h4 className="font-bold text-slate-700 text-sm">Symptoms</h4>
          </Link>

          <Link to="/user/risk" className="glass-card hover:bg-white p-6 text-center group">
            <Target className="w-8 h-8 text-amber-600 mb-3 mx-auto group-hover:rotate-12 transition-transform" />
            <h4 className="font-bold text-slate-700 text-sm mb-2">Risk Status</h4>
            {riskData?.risk && (
              <div
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                    riskData.risk.riskLevel === "LOW" ? "bg-emerald-100 text-emerald-700" :
                    riskData.risk.riskLevel === "MODERATE" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {riskData.risk.riskLevel}
              </div>
            )}
          </Link>

          <Link to="/user/habits" className="glass-card hover:bg-white p-6 text-center group">
            <BookOpen className="w-8 h-8 text-indigo-600 mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-slate-700 text-sm">Habits</h4>
          </Link>

          <Link to="/user/health" className="glass-card hover:bg-white p-6 text-center group">
            <Sparkles className="w-8 h-8 text-teal-600 mb-3 mx-auto group-hover:rotate-12 transition-transform" />
            <h4 className="font-bold text-slate-700 text-sm">Insights</h4>
          </Link>
      </div>
    </div>
  );
};

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/user", icon: LayoutDashboard, label: "Overview", exact: true },
    { path: "/user/daily-log", icon: ClipboardList, label: "Daily Log" },
    { path: "/user/health", icon: Activity, label: "Health Center" },
    { path: "/user/cycle", icon: Calendar, label: "Cycle Path" },
    { path: "/user/symptoms", icon: Activity, label: "Symptoms" },
    { path: "/user/risk", icon: Target, label: "Risk Profile" },
    { path: "/user/habits", icon: BookOpen, label: "Growth" },
    { path: "/user/appointment", icon: FileText, label: "Medical Pack" },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-72 h-screen sticky top-0 bg-white border-r border-slate-200/60 p-6 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-soft-pink-500 to-vibrant-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">PCOS<span className="text-soft-pink-500">Wellness</span></span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 relative ${
                    active 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon className={`w-5 h-5 ${active ? "text-soft-pink-400" : "group-hover:text-vibrant-purple-500 transition-colors"}`} />
                    <span className="font-bold text-[15px]">{item.label}</span>
                  </div>
                  {active && (
                      <motion.div layoutId="activeNav" className="w-1.5 h-1.5 rounded-full bg-soft-pink-400" />
                  )}
                </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-700 border border-slate-200">
                  {user?.firstName?.charAt(0) || "U"}
              </div>
              <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Member</p>
              </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 w-full font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-xl">
              <Menu className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-soft-pink-500 to-vibrant-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="font-extrabold text-slate-800">PCOS<span className="text-soft-pink-500">W</span></span>
          </div>
          <NotificationBell />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-soft-pink-500 to-vibrant-purple-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
                    </div>
                    <span className="text-lg font-bold text-slate-800">PCOS Wellness</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                        active ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${active ? "text-soft-pink-400" : ""}`} />
                      <span className="font-bold">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-600 bg-rose-50 w-full font-bold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto pt-20 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between p-8 bg-slate-50 sticky top-0 z-30">
          <div className="flex items-center gap-4">
              <div className="h-8 w-1 bg-soft-pink-400 rounded-full"></div>
              <h1 className="text-xl font-bold text-slate-900">Health Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm cursor-pointer hover:border-soft-pink-200 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Systems Online</span>
              </div>
              <NotificationBell />
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="daily-log" element={<DailyLogPage />} />
            <Route path="health" element={<ComprehensiveHealthPage />} />
            <Route path="cycle" element={<CycleTrackingPage />} />
            <Route path="symptoms" element={<SymptomLogPage />} />
            <Route path="risk" element={<RiskReportPage />} />
            <Route path="habits" element={<HabitsPage />} />
            <Route path="appointment" element={<AppointmentPrepPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};
