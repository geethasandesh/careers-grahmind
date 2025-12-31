import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, ArrowRight, Sparkles, Users, Zap } from 'lucide-react';

const CareersPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        if (value && !validateEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            console.warn('Form submission blocked: Invalid email format -', email);
            return;
        }

        setStatus('loading');
        setEmailError('');
        console.log('Starting email submission process for:', email);
        
        try {
            console.log('Sending email to JSONBin database');
            console.log('Environment check:', {
                hasApiKey: !!import.meta.env.VITE_JSONBIN_API_KEY,
                hasBinId: !!import.meta.env.VITE_JSONBIN_BIN_ID,
                binId: import.meta.env.VITE_JSONBIN_BIN_ID
            });
            
            // Get existing emails from JSONBin
            const getResponse = await fetch(
                `https://api.jsonbin.io/v3/b/${import.meta.env.VITE_JSONBIN_BIN_ID}/latest`,
                {
                    headers: {
                        'X-Master-Key': import.meta.env.VITE_JSONBIN_API_KEY
                    }
                }
            );
            
            const existingData = getResponse.ok ? await getResponse.json() : { record: [] };
            console.log('JSONBin data structure:', existingData);
            
            // Handle different data structures
            let emails = [];
            if (Array.isArray(existingData.record)) {
                emails = existingData.record;
            } else if (existingData.record && Array.isArray(existingData.record.emails)) {
                emails = existingData.record.emails;
            } else {
                emails = []; // Start fresh if structure is unexpected
            }
            
            // Add new email
            const newEmail = {
                email,
                timestamp: new Date().toISOString(),
                source: 'careers-waitlist'
            };
            emails.push(newEmail);
            
            // Update JSONBin
            const response = await fetch(
                `https://api.jsonbin.io/v3/b/${import.meta.env.VITE_JSONBIN_BIN_ID}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': import.meta.env.VITE_JSONBIN_API_KEY
                    },
                    body: JSON.stringify(emails)
                }
            );
            
            console.log('✅ Email stored in cloud database:', email);

            console.log('API Response status:', response.status);
            console.log('API Response ok:', response.ok);

            if (response.ok) {
                console.log('✅ Email submission successful');
                setStatus('success');
                setEmail('');
            } else {
                throw new Error(`Submission failed`);
            }
        } catch (error) {
            console.error('❌ Email submission failed - Detailed Error:', {
                errorMessage: error.message,
                errorStack: error.stack,
                email: email,
                timestamp: new Date().toISOString(),
                apiKey: import.meta.env.VITE_JSONBIN_API_KEY ? 'Present' : 'Missing',
                binId: import.meta.env.VITE_JSONBIN_BIN_ID ? 'Present' : 'Missing'
            });
            
            // Set user-friendly error message based on error type
            if (error.message.includes('fetch')) {
                setEmailError('Network error. Please check your connection and try again.');
            } else if (error.message.includes('API Error: 500')) {
                setEmailError('Server error. Please try again later.');
            } else if (error.message.includes('API Error: 400')) {
                setEmailError('Invalid request. Please refresh and try again.');
            } else {
                setEmailError('Failed to submit. Please try again.');
            }
            
            setStatus('idle');
        }
    };

    return (
        <main className="min-h-screen w-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white selection:bg-purple-400/20" role="main">

            {/* Enhanced Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                {/* Gradient orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-l from-pink-500/20 to-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-[100px] animate-pulse delay-500" />
                
                {/* Floating particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce delay-300" />
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/60 rounded-full animate-bounce delay-700" />
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-bounce delay-1000" />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            <div className="z-10 w-full max-w-7xl flex flex-col items-center text-center gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <header className="space-y-8">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-purple-500/20 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl shadow-2xl"
                    >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium tracking-wide text-purple-300">Careers at Grahmind - AI Innovation Company</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-[0.9] drop-shadow-2xl"
                    >
                        Join Grahmind's
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">AI Revolution</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light px-4"
                    >
                        Be part of Grahmind's mission to revolutionize AI and technology. We're building the future of artificial intelligence, and we want 
                        <span className="text-purple-300 font-medium"> visionary innovators like you</span> to join our remote-first team.
                    </motion.p>
                </header>

                {/* Features */}
                <section className="w-full max-w-5xl" aria-labelledby="features-heading">
                    <h2 id="features-heading" className="sr-only">Why Join Grahmind</h2>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl"
                    >
                        {[
                            { icon: Users, title: "Remote-First Culture", desc: "Work from anywhere in the world with flexible hours" },
                            { icon: Zap, title: "AI Innovation", desc: "Build cutting-edge AI solutions that impact millions" },
                            { icon: Sparkles, title: "Career Growth", desc: "Accelerate your career in the fastest-growing tech field" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
                                className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 group hover:bg-white/10"
                            >
                                <item.icon className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300" />
                                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-300">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Enhanced Form */}
                <section className="w-full max-w-xl" aria-labelledby="signup-heading">
                    <h2 id="signup-heading" className="sr-only">Join Our Talent Waitlist</h2>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                        className="w-full max-w-xl"
                    >
                        <div className="p-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl shadow-2xl">
                            <div className="bg-white/10 backdrop-blur-xl rounded-[22px] p-2 border border-white/20">
                                <form onSubmit={handleSubmit} className="relative flex items-center" role="form" aria-label="Career opportunities signup form">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Enter your email to join our talent pool"
                                        disabled={status === 'success'}
                                        className="w-full bg-white/5 text-white px-6 sm:px-8 py-4 sm:py-5 outline-none placeholder:text-gray-300 text-base sm:text-lg font-light rounded-2xl focus:placeholder:text-gray-400 focus:bg-white/10 transition-all duration-300 border border-white/10"
                                        aria-label="Email address for career opportunities"
                                    />

                                    <motion.button
                                        type="submit"
                                        disabled={status !== 'idle' || !email || !validateEmail(email)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`absolute right-2 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-2 sm:gap-3 shadow-xl text-sm sm:text-base
                          ${status === 'success'
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default'
                                                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 disabled:hover:scale-100 shadow-purple-500/25'
                                            }`}
                                    >
                                        {status === 'loading' && (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        )}
                                        {status === 'success' && (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                <span>Subscribed</span>
                                            </>
                                        )}
                                        {status === 'idle' && (
                                            <>
                                                <span>Join Talent Pool</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </div>

                        {emailError && (
                            <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 text-sm text-red-400 flex items-center justify-center gap-2"
                            >
                                <span className="w-2 h-2 bg-red-400 rounded-full" />
                                {emailError}
                            </motion.p>
                        )}

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                            className="mt-6 text-sm text-gray-300 flex items-center justify-center gap-2"
                        >
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
                            No spam. Get notified about AI and technology career opportunities at Grahmind.
                        </motion.p>
                    </motion.div>
                </section>

                {/* Enhanced Footer */}
                <footer className="mt-20 pt-8 border-t border-gradient-to-r from-transparent via-white/10 to-transparent w-full" role="contentinfo">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.6 }}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                                <span className="font-medium">© 2025 Grahmind Pvt Ltd.</span>
                            </div>
                            
                            <div className="hidden md:flex items-center gap-6 text-xs">
                                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">India</span>
                                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Remote First</span>
                            </div>
                            
                            <motion.a 
                                href="https://www.grahmind.com/contact" 
                                whileHover={{ scale: 1.05 }}
                                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                                aria-label="Contact Grahmind for career inquiries"
                            >
                                Contact Us →
                            </motion.a>
                        </div>
                    </motion.div>
                </footer>

            </div>
        </main>
    );
};

export default CareersPage;