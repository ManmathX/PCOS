import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    AlertTriangle,
    Bot,
    MessageCircle,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Stethoscope
} from 'lucide-react';
import { AIChatPage } from './AIChatPage';
import { CommunityPage } from './CommunityPage';
import { MessagingPage } from './MessagingPage';

// Import Pages
import { PatientsListPage } from './PatientsListPage';
import { PatientDetailsPage } from './PatientDetailsPage';

const Overview = () => (
    <div className="space-y-6">
        <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Doctor Dashboard</h2>
            <div className="medical-disclaimer mb-6">
                <p className="text-sm font-medium">
                    ⚕️ Professional medical advice required. This platform supports awareness, not diagnosis.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
                    <Users className="w-8 h-8 text-sage-600 mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">Total Patients</h3>
                    <p className="text-2xl font-bold text-sage-600">24</p>
                    <p className="text-sm text-gray-600 mt-1">Consented access</p>
                </div>
                <div className="bg-soft-pink-50 p-6 rounded-lg border border-soft-pink-200">
                    <AlertTriangle className="w-8 h-8 text-soft-pink-500 mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">High Risk</h3>
                    <p className="text-2xl font-bold text-soft-pink-600">3</p>
                    <p className="text-sm text-gray-600 mt-1">Need attention</p>
                </div>
                <div className="bg-warm-beige-100 p-6 rounded-lg border border-warm-beige-300">
                    <Stethoscope className="w-8 h-8 text-warm-beige-700 mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">Reviews Today</h3>
                    <p className="text-2xl font-bold text-warm-beige-700">7</p>
                    <p className="text-sm text-gray-600 mt-1">Patient reports</p>
                </div>
            </div>
        </div>
    </div>
);


export const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { path: '/doctor', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/doctor/patients', icon: Users, label: 'Patients' },
        { path: '/doctor/community', icon: MessageSquare, label: 'Community' },
        { path: '/doctor/messages', icon: MessageCircle, label: 'Messages' },
        { path: '/doctor/ai-chat', icon: Bot, label: 'AI Assistant' },
    ];

    return (
        <div className="min-h-screen bg-warm-beige-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Dr. {user?.lastName || 'Doctor'}</p>
                            <p className="text-xs text-gray-500">Medical Professional</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-sage-50 hover:text-sage-700 transition-colors mb-1"
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center">
                                    <Stethoscope className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Dr. {user?.lastName || 'Doctor'}</p>
                                    <p className="text-xs text-gray-500">Medical Professional</p>
                                </div>
                            </div>
                            <button onClick={() => setSidebarOpen(false)}>
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <nav className="p-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-sage-50 hover:text-sage-700 transition-colors mb-1"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full mt-4"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-gray-200 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">PCOS Wellness - Doctor Portal</h1>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8">
                    <Routes>
                        <Route index element={<Overview />} />
                        <Route path="patients" element={<PatientsListPage />} />
                        <Route path="patients/:id" element={<PatientDetailsPage />} />
                        <Route path="community" element={<CommunityPage />} />
                        <Route path="messages" element={<MessagingPage />} />
                        <Route path="ai-chat" element={<AIChatPage />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};
