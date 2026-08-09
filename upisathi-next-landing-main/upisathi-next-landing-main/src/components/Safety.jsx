"use client"

import React from 'react';
import Image from 'next/image';
import { FiShield, FiMapPin, FiMessageSquare, FiStar, FiLock } from 'react-icons/fi';

export default function Safety() {
  const cards = [
    {
      title: "Meet in Public",
      desc: "Choose busy public locations for every exchange.",
      underlineColor: "bg-[#FF5E97]",
      bgColor: "bg-[#FFF1F2]",
      icon: <FiMapPin size={18} className="text-[#FF5E97]" />
    },
    {
      title: "Chat Before Meeting",
      desc: "Discuss details, timing, and expectations before you commit.",
      underlineColor: "bg-[#6366F1]",
      bgColor: "bg-[#EEF2F6]",
      icon: <FiMessageSquare size={18} className="text-[#6366F1]" />
    },
    {
      title: "Community Reviews",
      desc: "See ratings and feedback from previous exchanges.",
      underlineColor: "bg-[#F59E0B]",
      bgColor: "bg-[#FEF3C7]",
      icon: <FiStar size={18} className="text-[#F59E0B]" />
    },
    {
      title: "You Control Every Decision",
      desc: "Accept, decline, or ignore requests at any time.",
      underlineColor: "bg-[#4A7DFF]",
      bgColor: "bg-[#DBEAFE]",
      icon: <FiLock size={18} className="text-[#4A7DFF]" />
    }
  ];

  return (
    <section id="safety" className="bg-[#F7F5F2] pt-10 pb-20 border-t border-black/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Top Header Block: 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10 max-w-5xl mx-auto">
          {/* Left Column: Heading & Paragraph (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Safety tag */}
            <div className="flex items-center gap-2 mb-4 select-none">
              <FiShield size={14} className="text-[#4A7DFF]" />
              <span className="text-[10px] uppercase font-space font-extrabold tracking-widest text-[#4A7DFF]">
                Safety & Trust
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight mb-4 font-sans">
              Meet safely.
              <span className="block mt-2">
                Exchange <span className="text-[#4A7DFF]">confidently.</span>
              </span>
            </h2>

            <p className="font-space font-semibold text-sm md:text-base text-black/70 leading-relaxed max-w-xl">
              upiSathi helps people connect, but every exchange remains between users. We encourage safe, transparent, and public meetups.
            </p>

          </div>

          {/* Right Column: Illustration (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
              <Image
                src="/protection,safety,shield,antivirus,sword,fight,defense,defend,woman,people.svg"
                alt="Illustration representing safety, shield, and trust"
                fill
                priority
                className="object-contain select-none"
              />
            </div>
          </div>

        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-black/[0.04] rounded-2xl p-4 flex flex-col items-center text-center shadow-xs transition-all duration-350 hover:-translate-y-1 hover:shadow-md group"
            >
              {/* Icon Container */}
              <div className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110`}>
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="font-space font-bold text-xs md:text-sm text-black mb-1 leading-snug">
                {card.title}
              </h3>

              {/* Micro underline */}
              <div className={`w-4 h-[1.5px] ${card.underlineColor} rounded-full mb-2`} />

              {/* Description */}
              <p className="text-[10px] md:text-[11px] text-black/70 leading-relaxed font-medium">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Disclaimer Banner */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#4A7DFF]/5 border border-[#4A7DFF]/10 rounded-3xl p-5 md:p-6 flex flex-row items-center gap-5 shadow-xs relative overflow-hidden">
            {/* Blue Shield Icon */}
            <div className="w-12 h-12 rounded-xl bg-[#4A7DFF]/10 flex items-center justify-center shrink-0">
              <FiShield size={24} className="text-[#4A7DFF]" />
            </div>
            
            {/* Banner text */}
            <div className="flex-1 font-space text-xs md:text-sm text-black/75 leading-relaxed">
              <p>
                upiSathi does not process payments, hold money, verify currency authenticity, or participate in transactions.
              </p>
              <p className="font-extrabold text-[#1E3A8A] mt-0.5">
                Users are responsible for verifying exchange details and following local laws.
              </p>
            </div>

            {/* Decorative Hand-drawn Arrow SVG */}
            <svg width="70" height="40" viewBox="0 0 70 40" fill="none" stroke="#4A7DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden lg:block shrink-0 ml-auto mr-2">
              <path d="M 5 35 C 15 35, 20 25, 15 20 C 10 15, 20 10, 35 20 C 45 27, 52 22, 60 10" />
              <path d="M 52 12 L 60 10 L 58 18" />
              <path d="M 64 6 L 66 8" />
              <path d="M 58 4 L 59 6" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
