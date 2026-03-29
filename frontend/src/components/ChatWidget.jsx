import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { X, Send } from 'lucide-react';
import api from '../services/api';

const ChatWidget = ({ bookingId, currentUser, recipientName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadHistory();
    connectWebSocket();
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await api.get(`/messages/${bookingId}`);
      setMessages(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS('/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 2000,
      onConnect: () => {
        stompClient.subscribe(`/topic/messages/${bookingId}`, (msg) => {
          const newMsg = JSON.parse(msg.body);
          setMessages((prev) => [...prev, newMsg]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker error', frame);
      }
    });

    stompClient.activate();
    clientRef.current = stompClient;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !clientRef.current?.connected) return;

    const chatMessage = {
      senderId: currentUser.id,
      senderName: currentUser.username,
      content: inputValue
    };

    clientRef.current.publish({
      destination: `/app/chat/${bookingId}`,
      body: JSON.stringify(chatMessage)
    });

    setInputValue('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden animate-slideUp">
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-3 flex justify-between items-center text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <h3 className="font-bold leading-none">Live Chat</h3>
          </div>
          <p className="text-xs text-white/80 mt-1">{recipientName || 'Service Provider'}</p>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-400 text-sm bg-white p-4 rounded-xl shadow-sm border border-dashed border-gray-200">
              No messages yet.<br/>Send a message to start chatting!
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && <span className="text-[10px] text-gray-500 ml-1 mb-0.5 font-medium">{msg.senderName}</span>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] shadow-sm ${isMe ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white border text-gray-800 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-gray-50 border-gray-200 border rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
        />
        <button type="submit" disabled={!inputValue.trim()} className="p-2.5 bg-primary-600 text-white rounded-full flex-shrink-0 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
export default ChatWidget;
