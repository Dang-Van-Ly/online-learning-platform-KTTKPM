import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/axios";
import { Send, Bot, User, Sparkles, Trash2, MessageSquare, History } from 'lucide-react';

const ChatAgent = () => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const submitMessage = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    const request = {
      message: message.trim(),
      orderId: null, // Hệ thống tự trích xuất ID từ nội dung tin nhắn ở Backend
    };

    const userMsg = { role: "user", text: request.message, timestamp: new Date() };
    
    // Thêm tin nhắn người dùng vào cuối danh sách để trả lời "dẫn xuống"
    setHistory((prev) => [...prev, userMsg]);
    const currentInput = message;
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/chat/ask", { message: currentInput });
      const data = response.data;
      
      const aiMsg = { 
        role: "assistant", 
        text: data.assistantMessage || data, 
        timestamp: new Date() 
      };

      setHistory((prev) => [
        ...prev,
        aiMsg,
      ]);
    } catch (err) {
      console.error("Chat Error:", err);
      const errorMsg = { 
        role: "assistant", 
        text: `Lỗi kết nối: ${err.response?.status === 404 ? "Không tìm thấy dịch vụ (404)" : "Server AI đang bận"}.`, 
        isError: true,
        timestamp: new Date() 
      };
      setHistory((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Bạn có muốn xóa lịch sử trò chuyện này không?")) {
      setHistory([]);
    }
  };

  // Lấy danh sách các câu hỏi của người dùng để hiện ở Sidebar
  const userQuestions = [...history].reverse().filter(m => m.role === 'user');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        <div className="flex h-[700px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          
          {/* LEFT SIDEBAR: History */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-100 hidden md:flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center gap-2">
              <History className="text-blue-600 h-5 w-5" />
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Lịch sử câu hỏi</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {userQuestions.length === 0 ? (
                <p className="text-center py-10 text-gray-400 text-xs italic">Chưa có câu hỏi nào</p>
              ) : (
                userQuestions.map((q, i) => (
                  <div 
                    key={i} 
                    onClick={() => setMessage(q.text)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-blue-100 group"
                  >
                    <MessageSquare className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                    <span className="text-sm text-gray-600 truncate group-hover:text-blue-700">{q.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-100">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">AI Expert Support</h2>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span> Trực tuyến
                  </p>
                </div>
              </div>
              <button onClick={clearChat} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
            </div>

            {/* Input at Top (Newest flow) */}
            <form className="p-6 border-b border-gray-50" onSubmit={submitMessage}>
              <div className="relative">
                <input
                  className="w-full pl-5 pr-14 py-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all text-sm shadow-inner"
                  placeholder="Hỏi về khóa học, quy trình thanh toán hoặc hủy đơn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-30 transition-all shadow-lg shadow-blue-200"
                >
                  {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send size={20} />}
                </button>
              </div>
            </form>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <Sparkles size={48} className="text-blue-600 mb-4 animate-pulse" />
                  <p className="text-sm font-medium">Hệ thống trợ lý AI đã sẵn sàng hỗ trợ bạn</p>
                </div>
              ) : (
                <>
                  {history.map((item, index) => (
                    <div key={index} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`flex gap-3 max-w-[80%] ${item.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`h-9 w-9 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 ${item.role === "user" ? "bg-indigo-600 text-white" : "bg-white border text-blue-600"}`}>
                          {item.role === "user" ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div className={`p-4 rounded-3xl text-sm shadow-sm ${item.role === "user" ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none" : "bg-white border text-gray-700 rounded-tl-none"}`}>
                          <p className="leading-relaxed">{item.text}</p>
                          <span className="text-[9px] mt-2 block opacity-40 font-bold uppercase">{item.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatAgent;
