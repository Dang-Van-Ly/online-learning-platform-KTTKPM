import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, MessageSquare, Clock, History } from 'lucide-react';
import api from '../api/axios';

const AIChatAssistant = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input, timestamp: new Date() };
        // Thêm tin nhắn mới vào đầu mảng để hiển thị ở trên cùng
        setMessages(prev => [userMessage, ...prev]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/chat/ask', { message: currentInput });
            const aiMessage = { 
                role: 'ai', 
                content: response.data.assistantMessage || response.data, 
                timestamp: new Date() 
            };
            setMessages(prev => [aiMessage, ...prev]);
        } catch (error) {
            const errorMessage = { 
                role: 'ai', 
                content: "Xin lỗi, tôi gặp trục trặc khi kết nối với máy chủ. Vui lòng thử lại sau.", 
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [errorMessage, ...prev]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Bạn có muốn xóa lịch sử trò chuyện này không?")) {
            setMessages([]);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center text-white shadow-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">Trợ lý KhoKhoaHoc</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs text-blue-100">AI trực tuyến</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={clearChat}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Xóa lịch sử"
                >
                    <Trash2 className="h-5 w-5 opacity-80" />
                </button>
            </div>

            {/* Input Area (Đặt ở trên nếu muốn phong cách feed hoặc dưới tùy chọn - ở đây tôi để dưới cho truyền thống nhưng đảo ngược tin nhắn) */}
            <form onSubmit={handleSend} className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Hỏi về khóa học, hướng dẫn mua hàng..."
                        className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
                    >
                        {isLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send className="h-5 w-5" />}
                    </button>
                </div>
            </form>

            {/* Messages Area - Latest at Top */}
            <div 
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                        <Sparkles className="h-12 w-12 mb-3" />
                        <p className="text-sm">Hãy đặt câu hỏi để bắt đầu trò chuyện</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div 
                            key={idx} 
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                                    msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-600 text-white'
                                }`}>
                                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                </div>
                                <div className={`p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : msg.isError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                    <div className={`text-[10px] mt-1.5 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && messages.length > 0 && messages[0].role === 'user' && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white border border-gray-100 p-3 rounded-2xl flex gap-2 items-center">
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIChatAssistant;