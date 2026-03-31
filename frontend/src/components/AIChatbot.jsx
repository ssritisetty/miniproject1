import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

import dataService from '../services/data.service';

const AIChatbot = ({ providers: initialProviders = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [providers, setProviders] = useState(initialProviders);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your ServiceConnect AI Assistant. I know everything about our professionals. Ask me anything!", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialProviders && initialProviders.length > 0) {
      setProviders(initialProviders);
    } else {
      // Internal fetch if not provided via props
      dataService.getProviders()
        .then(res => setProviders(res.data))
        .catch(err => console.error("Chatbot failed to fetch providers:", err));
    }
  }, [initialProviders]);

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
      
      // Dynamic Provider Matching Logic
      const foundProviders = providers.filter(p => 
        (p.user?.username || '').toLowerCase().includes(userMsg) ||
        (p.category?.name || '').toLowerCase().includes(userMsg) ||
        (p.bio || '').toLowerCase().includes(userMsg)
      );

      if (userMsg.includes("best") || userMsg.includes("top rated") || userMsg.includes("highest rating")) {
        const best = [...providers].sort((a, b) => b.rating - a.rating)[0];
        if (best) {
          botResponse = `The top-rated professional is ${best.user?.username} (${best.category?.name}) with a rating of ${best.rating.toFixed(1)} stars! They charge $${best.hourlyRate}/hr.`;
        }
      } else if (userMsg.includes("cheapest") || userMsg.includes("lowest price") || userMsg.includes("budget")) {
        const cheapest = [...providers].sort((a, b) => a.hourlyRate - b.hourlyRate)[0];
        if (cheapest) {
          botResponse = `${cheapest.user?.username} offers the most affordable rate at just $${cheapest.hourlyRate} per hour for ${cheapest.category?.name} services.`;
        }
      } else if (foundProviders.length > 0 && (userMsg.includes("who") || userMsg.includes("tell me about") || userMsg.includes("price of"))) {
        const p = foundProviders[0];
        botResponse = `${p.user?.username} is an expert in ${p.category?.name}. They have ${p.experience || 'years of'} experience and a rating of ${p.rating.toFixed(1)}. Their hourly rate is $${p.hourlyRate}. Would you like to book them?`;
      } else if (userMsg.includes("how do i book") || userMsg.includes("book a service") || userMsg.includes("booking process")) {
        botResponse = "It's easy! 1. Choose a provider. 2. Select your date and time (mention if it's an emergency). 3. Apply your Reward Scratch Card for discounts. 4. Choose your payment method (UPI, Net Banking, or Cash). 5. Confirm!";
      } else if (userMsg.includes("reward") || userMsg.includes("scratch card") || userMsg.includes("points")) {
        botResponse = "You earn 50 points for every completed booking! Once you have points, you can use our new interactive Scratch Card during the booking process to unlock instant discounts.";
      } else if (userMsg.includes("emergency") || userMsg.includes("urgent")) {
        botResponse = "For emergencies, select 'Today' as your booking date. You'll be asked for an emergency reason, and we'll prioritize your request for immediate dispatch!";
      } else if (userMsg.includes("hello") || userMsg.includes("hi")) {
        botResponse = "Hello! I can tell you about our " + providers.length + " active service professionals. Who are you looking for?";
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
