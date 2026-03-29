import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your ServiceConnect AI Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim().toLowerCase();
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput('');

    // Simulate AI typing delay
    setTimeout(() => {
      let botResponse = "I can help you find services, check prices, or guide you through bookings.";
      
      // Simple AI Mock Logic
      if (userMsg.includes("how do i book") || userMsg.includes("book a service")) {
        botResponse = "Go to 'Browse Services' → choose a provider → select date → confirm booking.";
      } else if (userMsg.includes("price") && userMsg.includes("plumb")) {
        botResponse = "Estimated price for plumbing is ₹300 – ₹600 depending on the job complexity.";
      } else if (userMsg.includes("emergency") || userMsg.includes("urgent")) {
        botResponse = "If this is an emergency (like heavy leaking or electrical issues), please use our smart search to get providers available within 1 hour.";
      } else if (userMsg.includes("hello") || userMsg.includes("hi")) {
        botResponse = "Hello! What service are you looking for today?";
      }

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-primary-600 text-white shadow-xl hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 z-40 ${isOpen ? 'hidden' : 'flex'} items-center gap-2 group`}
      >
        <MessageSquare size={24} />
        <span className="font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          AI Chat Support
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={24} className="animate-pulse" />
              <div>
                <h3 className="font-bold flex items-center gap-1">ServiceAI <Sparkles size={14} className="text-yellow-300" /></h3>
                <p className="text-xs text-primary-100">Always online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} gap-2 items-end`}>
                {msg.isBot && <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600"><Bot size={14} /></div>}
                
                <div className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow-sm ${
                  msg.isBot 
                    ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100' 
                    : 'bg-primary-600 text-white rounded-br-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
