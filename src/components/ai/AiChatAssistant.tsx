import React, { useState, useRef, useEffect } from 'react';
import { GlassCard, PremiumButton } from '../common/PremiumUI';

/**
 * PHASE 10 - TASK 10.8: AI Chat Assistant (Mini)
 */
export const AiChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: 'Xin chào! Tôi có thể giúp gì bạn về phân tích rủi ro hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages([...messages, { role: 'user', text: userMsg }]);
    setInput('');

    // Giả lập AI phản hồi (Trong thực tế sẽ gọi AiReportService/Gemma)
    setTimeout(() => {
      let response = "Tôi đang phân tích dữ liệu...";
      if (userMsg.toLowerCase().includes('rủi ro')) {
        response = "Hiện tại thiết bị EQUIP-BRAKE-X đang có rủi ro cao nhất (92%). Bạn nên kiểm tra sớm.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 1000);
  };

  return (
    <div className="ai-assistant-fixed">
      {!isOpen ? (
        <PremiumButton 
          onClick={() => setIsOpen(true)}
          className="ai-assistant-toggle"
        >
          💬
        </PremiumButton>
      ) : (
        <GlassCard 
          title="🤖 AI Assistant" 
          className="ai-assistant-card"
        >
          <div className="ai-chat-close" onClick={() => setIsOpen(false)}>✖️</div>
          
          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="ai-chat-messages"
          >
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`ai-bubble-container ${m.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`ai-chat-bubble ${m.role === 'user' ? 'ai-bubble-user' : 'ai-bubble-ai'}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="ai-chat-input-area">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi AI..."
              className="ai-chat-input"
            />
            <PremiumButton onClick={handleSend} className="p-sm">➡️</PremiumButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
