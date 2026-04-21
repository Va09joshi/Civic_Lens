"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const helplineData: Record<string, { label: string; num: string }[]> = {
  "Emergency & Safety": [
    { label: "National Emergency Helpline", num: "112" },
    { label: "Police", num: "100" },
    { label: "Fire", num: "101" },
    { label: "Ambulance", num: "102" },
    { label: "Emergency Ambulance Service", num: "108" },
    { label: "Women Helpline", num: "1091" },
    { label: "Child Helpline", num: "1098" },
    { label: "Women in Distress", num: "181" },
    { label: "Disaster Management", num: "1070" },
    { label: "Disaster Relief", num: "1078" }
  ],
  "Health & Crisis Support": [
    { label: "Health Helpline", num: "104" },
    { label: "National Health Helpline", num: "1075" },
    { label: "AIDS Helpline", num: "1097" },
    { label: "Mental Health Helpline", num: "14567" },
    { label: "Tele Mental Health Support", num: "14416" }
  ],
  "Law, Crime & Cyber": [
    { label: "Cyber Crime Helpline", num: "155260" },
    { label: "Online Financial Fraud", num: "1930" },
    { label: "Women Power Line", num: "1090" },
    { label: "Domestic Violence Help", num: "181" },
    { label: "Railway Security", num: "1291" }
  ],
  "Transport & Road": [
    { label: "Traffic Police", num: "103" },
    { label: "Highway Emergency", num: "1073" },
    { label: "Railway Enquiry", num: "139" },
    { label: "Railway Protection Force", num: "182" },
    { label: "Road Transport Helpline", num: "1800-11-0400" }
  ],
  "Utilities & Civic Services": [
    { label: "Electricity Complaint", num: "1912" },
    { label: "Water Supply Complaint", num: "1916" },
    { label: "LPG Leak Helpline", num: "155303" },
    { label: "LPG Emergency", num: "1906" },
    { label: "Gas Booking", num: "1969" }
  ],
  "Municipal & Civic Issues": [
    { label: "Swachh Bharat Helpline", num: "155304" },
    { label: "Cleanliness Complaint", num: "1969" },
    { label: "Public Grievance", num: "155300" },
    { label: "Consumer Helpline", num: "1800-180-1551" },
    { label: "Anti-Corruption Helpline", num: "14420" }
  ],
  "Social Justice & Welfare": [
    { label: "Senior Citizen Helpline", num: "1093" },
    { label: "Elderly Support", num: "14567" },
    { label: "Anti-Ragging", num: "1800-111-565" },
    { label: "Food Supply Complaint", num: "1967" },
    { label: "Farmer Helpline", num: "155368" }
  ]
};

const suggestedQuestions = [
  "Emergency & Safety",
  "Municipal & Civic Issues",
  "Health & Crisis Support",
  "Law, Crime & Cyber",
  "Utilities & Civic Services",
  "Transport & Road"
];

type Message = {
  id: string;
  sender: "bot" | "user";
  text?: string;
  numbers?: { label: string; num: string }[];
};

export default function CivicBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste, citizen! 🇮🇳 I am your CivicLens AI Directory. Ask me for emergency helpline numbers, municipal contacts, or civic solutions. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasInteracted = useRef(false);

  useEffect(() => {
    if (hasInteracted.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    hasInteracted.current = true;
    
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let foundCategory: string | null = null;
      
      // keyword matching
      const keywordMap: Record<string, string[]> = {
        "Emergency & Safety": ["emergency", "police", "fire", "ambulance", "women helpline", "child", "disaster", "safety", "112", "100", "101"],
        "Health & Crisis Support": ["health", "hospital", "covid", "aids", "mental", "crisis", "doctor"],
        "Law, Crime & Cyber": ["crime", "cyber", "fraud", "law", "domestic violence", "railway security"],
        "Transport & Road": ["transport", "road", "highway", "railway", "traffic"],
        "Utilities & Civic Services": ["electricity", "water", "lpg", "gas", "utility", "utilities"],
        "Municipal & Civic Issues": ["municipal", "civic", "swachh", "cleanliness", "grievance", "consumer", "corruption"],
        "Social Justice & Welfare": ["senior", "elderly", "ragging", "farmer", "food supply", "ration", "social", "welfare"]
      };

      for (const [cat, keywords] of Object.entries(keywordMap)) {
        if (keywords.some(kw => lowerText.includes(kw))) {
          foundCategory = cat;
          break;
        }
      }

      // Also match full category names
      if (!foundCategory) {
        for (const cat of Object.keys(helplineData)) {
          if (lowerText.includes(cat.toLowerCase())) {
            foundCategory = cat;
            break;
          }
        }
      }

      const botMsgId = (Date.now() + 1).toString();
      setIsTyping(false);
      
      if (foundCategory) {
        const cat = foundCategory;
        setMessages(prev => [...prev, {
          id: botMsgId,
          sender: "bot",
          text: `Here are the verified contacts for "${cat}":`,
          numbers: helplineData[cat]
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: botMsgId,
          sender: "bot",
          text: "I can help you find civic helpline numbers across India. Try searching for:\n\n• \"Emergency\" — Police, Fire, Ambulance\n• \"Health\" — Medical helplines\n• \"Cyber Crime\" — Online fraud & safety\n• \"Municipal\" — Swachh Bharat, grievances\n• \"Transport\" — Roads, railways\n• \"Utilities\" — Electricity, water, gas\n• \"Social Welfare\" — Senior citizens, farmers"
        }]);
      }
    }, 700);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Subtle animated gradient glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-[0.08] blur-xl animate-gradient-shift"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="absolute -inset-0.5 rounded-[26px] bg-gradient-to-r from-blue-300 via-violet-400 to-purple-400 opacity-[0.05] blur-md animate-gradient-shift-reverse"
      />
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative w-full rounded-3xl shadow-lg overflow-hidden border border-slate-200 bg-white flex flex-col h-[700px] max-h-[85vh]"
    >
      {/* Header — Premium Gradient with Logo */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between z-10 shadow-lg shrink-0 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-13 h-13 bg-white/95 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/40 shadow-lg p-1.5">
            <img src="/logo.png" alt="CivicLens" className="h-9 w-9 object-contain" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight tracking-tight">CivicLens Directory</h3>
            <p className="text-blue-100/90 text-[13px] font-medium leading-tight mt-0.5">India&apos;s National Helpline Guide</p>
          </div>
        </div>
        <div className="flex items-center gap-2 pr-1 relative z-10">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          <span className="text-white/90 text-sm font-semibold">Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-blue-50/30 relative">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} w-full`}
            >
              <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 flex-shrink-0 flex items-center justify-center mt-1 border border-blue-200 overflow-hidden">
                    <img src="/logo.png" alt="CivicLens" className="w-5 h-5 object-contain" />
                  </div>
                )}
                
                <div className={`flex flex-col gap-3 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  {msg.text && (
                    <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-line ${msg.sender === "user" ? "bg-blue-600 text-white rounded-tr-[4px]" : "bg-white text-slate-700 border border-blue-100 rounded-tl-[4px] ring-1 ring-blue-900/5"}`}>
                      {msg.text}
                    </div>
                  )}
                  
                  {msg.numbers && (
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden w-full max-w-sm">
                      <div className="bg-blue-50 py-2.5 px-4 border-b border-blue-100 text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                        <FaPhoneAlt size={10} /> Verified Contacts
                      </div>
                      <div className="divide-y divide-blue-50">
                        {msg.numbers.map((item, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="px-4 py-2.5 flex justify-between items-center hover:bg-blue-50/50 transition-colors group"
                          >
                            <span className="text-[13px] font-medium text-slate-700 pr-3">{item.label}</span>
                            <a href={`tel:${item.num}`} className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg group-hover:bg-blue-100 transition-colors whitespace-nowrap text-[13px] border border-blue-100">
                              {item.num}
                            </a>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-slate-400 text-sm pl-11"
          >
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Suggested Questions */}
      <div className="px-6 py-4 bg-white border-t border-blue-50 shrink-0">
        <p className="text-[11px] font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">Quick search:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-4 py-1.5 bg-white border border-blue-100 rounded-full text-[13px] font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-blue-50 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} 
          className="flex items-center gap-3 bg-blue-50/50 rounded-full p-1.5 border border-blue-100 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search helpline numbers or ask a question..."
            className="flex-1 bg-transparent border-none focus:outline-none px-4 text-slate-700 placeholder:text-slate-400 text-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white disabled:opacity-40 transition-colors shadow-sm flex-shrink-0"
          >
            <FaPaperPlane className="ml-0.5 text-white" size={14} />
          </button>
        </form>
      </div>
    </motion.div>
    </div>
  );
}
