import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (
            credentials.username === import.meta.env.VITE_ADMIN_USERNAME &&
            credentials.password === import.meta.env.VITE_ADMIN_PASSWORD
        ) {
            localStorage.setItem('adminAuth', 'true');
            onLogin();
        } else {
            setError('Invalid credentials');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white p-4 sm:p-6 lg:p-8 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-l from-pink-500/15 to-purple-500/15 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-sm sm:max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6"
                    >
                        <Shield className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">Secure access to Grahmind dashboard</p>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 sm:py-4 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 outline-none text-sm sm:text-base"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 sm:py-4 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 outline-none text-sm sm:text-base"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Access Dashboard
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-xs text-gray-500">
                            Authorized personnel only • Grahmind Inc.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;