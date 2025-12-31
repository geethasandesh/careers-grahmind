import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Users, LogOut, Trash2, RefreshCw, Calendar, TrendingUp, Filter, Search } from 'lucide-react';
import AdminLogin from './AdminLogin';

const AdminPage = () => {
    const [emails, setEmails] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const authStatus = localStorage.getItem('adminAuth');
        setIsAuthenticated(authStatus === 'true');
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
    };

    const fetchEmails = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.jsonbin.io/v3/b/${import.meta.env.VITE_JSONBIN_BIN_ID}/latest`,
                {
                    headers: {
                        'X-Master-Key': import.meta.env.VITE_JSONBIN_API_KEY
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                setEmails(data.record || []);
            }
        } catch (error) {
            console.error('Error fetching emails:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchEmails();
        }
    }, [isAuthenticated]);

    const downloadCSV = () => {
        const csvContent = [
            ['Email', 'Timestamp', 'Source'],
            ...filteredEmails.map(item => [item.email, item.timestamp, item.source])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `waitlist-emails-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const clearAllEmails = async () => {
        if (window.confirm('Are you sure you want to delete all emails? This cannot be undone.')) {
            try {
                await fetch(
                    `https://api.jsonbin.io/v3/b/${import.meta.env.VITE_JSONBIN_BIN_ID}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Master-Key': import.meta.env.VITE_JSONBIN_API_KEY
                        },
                        body: JSON.stringify([])
                    }
                );
                setEmails([]);
            } catch (error) {
                console.error('Error clearing emails:', error);
            }
        }
    };

    const filteredEmails = emails.filter(email => {
        const matchesSearch = email.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const today = new Date().toDateString();
        const emailDate = new Date(email.timestamp).toDateString();
        
        if (filter === 'today') return matchesSearch && emailDate === today;
        if (filter === 'week') {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return matchesSearch && new Date(email.timestamp) >= weekAgo;
        }
        return matchesSearch;
    });

    const getStats = () => {
        const today = new Date().toDateString();
        const todayCount = emails.filter(e => new Date(e.timestamp).toDateString() === today).length;
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weekCount = emails.filter(e => new Date(e.timestamp) >= weekAgo).length;
        
        return { total: emails.length, today: todayCount, week: weekCount };
    };

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    const stats = getStats();

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white overflow-x-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-gradient-to-l from-pink-500/10 to-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full h-full p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 sm:mb-8 gap-4 sm:gap-6"
                >
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">Manage waitlist signups and analytics</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <button
                            onClick={fetchEmails}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10 text-sm sm:text-base w-full sm:w-auto"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors border border-red-500/20 text-sm sm:text-base w-full sm:w-auto"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
                >
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
                                <p className="text-gray-400 text-sm">Total Signups</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <Calendar className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-white">{stats.today}</p>
                                <p className="text-gray-400 text-sm">Today</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-white">{stats.week}</p>
                                <p className="text-gray-400 text-sm">This Week</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col xl:flex-row gap-4 mb-6"
                >
                    {/* Search */}
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 outline-none text-sm sm:text-base"
                        />
                    </div>
                    
                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 outline-none text-sm sm:text-base min-w-0 w-full sm:w-auto"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                    </select>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
                        <button
                            onClick={downloadCSV}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors text-sm sm:text-base w-full sm:w-auto"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        
                        <button
                            onClick={clearAllEmails}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors border border-red-500/20 text-sm sm:text-base w-full sm:w-auto"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    </div>
                </motion.div>

                {/* Email Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                >
                    {filteredEmails.length === 0 ? (
                        <div className="p-8 sm:p-12 text-center text-gray-400">
                            <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg sm:text-xl mb-2">No emails found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <table className="w-full min-w-[600px] sm:min-w-0">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Email</th>
                                        <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Date & Time</th>
                                        <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmails.map((item, index) => (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-4 sm:px-6 py-4 text-white font-medium text-sm sm:text-base break-all">{item.email}</td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                                                {new Date(item.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                                                    {item.source}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center text-gray-500 text-sm"
                >
                    <p>Showing {filteredEmails.length} of {emails.length} emails • Grahmind Admin Dashboard</p>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPage;