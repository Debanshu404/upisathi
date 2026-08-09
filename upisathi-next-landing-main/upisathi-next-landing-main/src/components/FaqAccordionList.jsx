"use client";

import React, { useState } from 'react';
import { FiShield, FiLock, FiMessageSquare } from 'react-icons/fi';
import { TbCurrencyRupee } from 'react-icons/tb';
import { LuWallet } from 'react-icons/lu';

export default function FaqAccordionList() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setActiveIndex(activeIndex === idx ? -1 : idx);
  };

  const faqItems = [
    {
      question: "Is UPI cash exchange legal?",
      answer: "Yes, exchanging UPI for cash (and vice versa) is not illegal in India. However, always ensure your transactions are for genuine purposes and follow applicable laws.",
      icon: <FiShield className="w-6 h-6 text-[#4A7DFF]" />,
      bgColor: "bg-[#4A7DFF]/10",
      activeBgColor: "bg-[#4A7DFF]/5",
      activeBorderColor: "border-[#4A7DFF]/20"
    },
    {
      question: "Does upiSathi handle payments?",
      answer: "No, upiSathi does not process payments, hold funds, or participate in any transactions. All payments and exchanges are made directly between users offline or peer-to-peer.",
      icon: <LuWallet className="w-6 h-6 text-[#FF5E97]" />,
      bgColor: "bg-[#FF5E97]/10",
      activeBgColor: "bg-[#FF5E97]/5",
      activeBorderColor: "border-[#FF5E97]/20"
    },
    {
      question: "How do I stay safe while exchanging?",
      answer: "Always meet in crowded public locations, coordinate details via in-app chat before meeting, check community reviews, and never transfer money before verifying the exchange in person.",
      icon: <FiLock className="w-6 h-6 text-[#FBBF24]" />,
      bgColor: "bg-[#FBBF24]/10",
      activeBgColor: "bg-[#FBBF24]/5",
      activeBorderColor: "border-[#FBBF24]/20"
    },
    {
      question: "Is there a fee to use upiSathi?",
      answer: "No, upiSathi is free to use for browsing and posting requests. We do not charge subscription fees or transaction commissions.",
      icon: <TbCurrencyRupee className="w-6 h-6 text-[#4A7DFF]" />,
      bgColor: "bg-[#4A7DFF]/10",
      activeBgColor: "bg-[#4A7DFF]/5",
      activeBorderColor: "border-[#4A7DFF]/20"
    },
    {
      question: "What if someone doesn't show up?",
      answer: "If a user fails to show up or breaches the agreed terms, you can report them directly in the app. Users with repeated reports or poor ratings will be restricted from the platform.",
      icon: <FiMessageSquare className="w-6 h-6 text-[#10B981]" />,
      bgColor: "bg-[#10B981]/10",
      activeBgColor: "bg-[#10B981]/5",
      activeBorderColor: "border-[#10B981]/20"
    }
  ];

  return (
    <>
      {faqItems.map((item, idx) => {
        const isOpen = activeIndex === idx;
        return (
          <div
            key={idx}
            onClick={() => toggleAccordion(idx)}
            className={`transition-all duration-300 border mb-3 rounded-2xl p-4 md:p-5 cursor-pointer select-none flex flex-col ${
              isOpen 
                ? `${item.activeBgColor} ${item.activeBorderColor} shadow-xs` 
                : 'bg-white border-black/[0.04] hover:border-black/10 shadow-xs'
            }`}
          >
            {/* Accordion Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Icon Circle */}
                <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                
                {/* Question Text */}
                <h3 className="font-space font-bold text-sm md:text-base text-black leading-snug">
                  {item.question}
                </h3>
              </div>

              {/* Plus/Minus Indicator */}
              <span className={`text-xl font-extrabold shrink-0 ${isOpen ? 'text-[#4A7DFF]' : 'text-black/65'}`}>
                {isOpen ? '—' : '+'}
              </span>
            </div>

            {/* Accordion Content */}
            <div 
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0 overflow-hidden'
              }`}
            >
              <div className="overflow-hidden">
                <p className="font-space font-semibold text-xs md:text-sm text-black/70 leading-relaxed pl-14">
                  {item.answer}
                </p>
              </div>
            </div>

          </div>
        );
      })}
    </>
  );
}
