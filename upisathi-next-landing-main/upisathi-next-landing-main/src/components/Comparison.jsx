import React from 'react';
import Image from 'next/image';
import { FiSend, FiClock, FiUsers, FiShuffle, FiPlusCircle, FiSearch, FiMessageCircle, FiMapPin, FiX, FiCheck } from 'react-icons/fi';

export default function Comparison() {
  const withoutSteps = [
    {
      title: "Send a message",
      desc: "Post in groups or message people.",
      icon: <FiSend className="w-6 h-6 text-[#E11D48]" />
    },
    {
      title: "Wait for replies",
      desc: "Hope someone responds.",
      icon: <FiClock className="w-6 h-6 text-[#E11D48]" />
    },
    {
      title: "Message multiple people",
      desc: "Contact different people individually.",
      icon: <FiUsers className="w-6 h-6 text-[#E11D48]" />
    },
    {
      title: "Coordinate manually",
      desc: "Figure out location, timing and details.",
      icon: <FiShuffle className="w-6 h-6 text-[#E11D48]" />
    }
  ];

  const withSteps = [
    {
      title: "Create a request",
      desc: "Specify what you need in seconds.",
      icon: <FiPlusCircle className="w-6 h-6 text-[#4A7DFF]" />
    },
    {
      title: "Find a match",
      desc: "Browse active requests near you.",
      icon: <FiSearch className="w-6 h-6 text-[#4A7DFF]" />
    },
    {
      title: "Chat",
      desc: "Discuss details and coordinate easily.",
      icon: <FiMessageCircle className="w-6 h-6 text-[#4A7DFF]" />
    },
    {
      title: "Meet",
      desc: "Navigate to the location and complete exchange.",
      icon: <FiMapPin className="w-6 h-6 text-[#4A7DFF]" />
    }
  ];

  return (
    <section id="comparison" className="bg-[#F7F5F2] pt-12 pb-16 border-t border-black/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Top Header Block: 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-10 max-w-5xl mx-auto">
          {/* Left Column: Heading & bullet items (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* sparkles tag */}
            <div className="flex items-center gap-2 mb-4 select-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A7DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.32 11.32l.707.707" />
              </svg>
              <span className="text-[10px] uppercase font-space font-extrabold tracking-widest text-[#4A7DFF]">
                Compare matching
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-black leading-tight mb-4">
              Stop scrolling.
              <span className="block mt-2 text-[#4A7DFF] relative inline-block">
                Start matching.
                <svg viewBox="0 0 300 20" fill="none" stroke="#4A7DFF" strokeWidth="4" strokeLinecap="round" className="absolute left-0 -bottom-3 w-[260px] h-[15px] pointer-events-none">
                  <path d="M10,10 Q150,15 290,8" />
                </svg>
              </span>
            </h2>

            {/* List block */}
            <div className="flex flex-col gap-4 mt-4">
              <span className="text-black/75 font-space font-semibold text-sm md:text-base flex items-center gap-3">
                <FiX size={18} className="text-[#4A7DFF] shrink-0" strokeWidth={3} />
                No more group messages.
              </span>
              <span className="text-black/75 font-space font-semibold text-sm md:text-base flex items-center gap-3">
                <FiX size={18} className="text-[#4A7DFF] shrink-0" strokeWidth={3} />
                No more repeated requests.
              </span>
              <span className="text-black/75 font-space font-semibold text-sm md:text-base flex items-center gap-3">
                <FiX size={18} className="text-[#4A7DFF] shrink-0" strokeWidth={3} />
                No more searching through hundreds of chats.
              </span>
              <span className="text-black/90 font-space font-bold text-sm md:text-base flex items-center gap-3 mt-2">
                <FiCheck size={18} className="text-[#4A7DFF] shrink-0" strokeWidth={3.5} />
                <span>
                  <span className="relative inline-block pb-1">
                    Just create a request
                    <svg viewBox="0 0 160 10" fill="none" stroke="#4A7DFF" strokeWidth="2.5" strokeLinecap="round" className="absolute left-0 bottom-0 w-full h-[6px] pointer-events-none">
                      <path d="M5,5 Q80,8 155,3" />
                    </svg>
                  </span>
                  {" "}and find a match.
                </span>
              </span>
            </div>

          </div>

          {/* Right Column: Illustration (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
            <div className="relative w-full max-w-[220px] sm:max-w-[320px] lg:max-w-[440px] aspect-square flex items-center justify-center">
              <Image
                src="/route,lost,direction,select,choose,question,assistance,woman,people,arrows.svg"
                alt="Illustration of a person seeking directions and choosing matching routes"
                fill
                priority
                className="object-contain select-none"
              />
            </div>
          </div>
        </div>

        {/* Side-by-side Comparison Block */}
        <div className="relative max-w-5xl mx-auto mt-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-19 relative">
            
            {/* Left Card: WITHOUT UPISATHI */}
            <div className="bg-[#FFF5F3]/70 border border-[#FFE3DE] rounded-3xl p-6 md:p-8 flex flex-col">
              {/* Header Title */}
              <div className="flex items-center gap-2.5 mb-6 justify-center select-none">
                <FiX size={18} className="text-[#E11D48]" strokeWidth={3} />
                <span className="font-space font-black text-xs md:text-sm uppercase tracking-widest text-[#9C3A27] mt-0.5">
                  Without UpiSathi
                </span>
              </div>

              {/* Timeline Row */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-start gap-8 md:gap-4 relative">
                
                {/* Connecting dashed wavy line (Desktop only) */}
                <div className="hidden md:block absolute top-[20px] left-8 right-8 h-4 -z-0 pointer-events-none">
                  <svg width="100%" height="16" viewBox="0 0 400 16" fill="none" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M 0 8 C 50 0, 50 16, 100 8 C 150 0, 150 16, 200 8 C 250 0, 250 16, 300 8 C 350 0, 350 16, 400 8" stroke="#FCA5A5" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" />
                  </svg>
                </div>

                {withoutSteps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1 flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-0 relative z-10"
                  >
                    {/* Circle Icon */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-[#FCA5A5] flex items-center justify-center shadow-xs shrink-0 select-none">
                      {step.icon}
                    </div>
                    {/* Text block */}
                    <div className="flex flex-col md:items-center mt-0 md:mt-4 font-space">
                      <h3 className="font-bold text-sm md:text-xs text-black mb-1 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-[10px] md:text-[11px] text-black/70 leading-relaxed max-w-[130px]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Right Card: WITH UPISATHI */}
            <div className="bg-[#F3F6FF]/70 border border-[#E3EBFF] rounded-3xl p-6 md:p-8 flex flex-col">
              {/* Header Title */}
              <div className="flex items-center gap-2.5 mb-6 justify-center select-none">
                <FiCheck size={18} className="text-[#4A7DFF]" strokeWidth={3} />
                <span className="font-space font-black text-xs md:text-sm uppercase tracking-widest text-[#2B52B3] mt-0.5">
                  With UpiSathi
                </span>
              </div>

              {/* Timeline Row */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-start gap-8 md:gap-4 relative">
                
                {/* Connecting solid wavy line (Desktop only) */}
                <div className="hidden md:block absolute top-[20px] left-8 right-8 h-4 -z-0 pointer-events-none">
                  <svg width="100%" height="16" viewBox="0 0 400 16" fill="none" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M 0 8 C 50 16, 50 0, 100 8 C 150 16, 150 0, 200 8 C 250 16, 250 0, 300 8 C 350 16, 350 0, 400 8" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                {withSteps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1 flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-0 relative z-10"
                  >
                    {/* Circle Icon */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-[#818CF8] flex items-center justify-center shadow-xs shrink-0 select-none">
                      {step.icon}
                    </div>
                    {/* Text block */}
                    <div className="flex flex-col md:items-center mt-0 md:mt-4 font-space">
                      <h3 className="font-bold text-sm md:text-xs text-black mb-1 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-[10px] md:text-[11px] text-black/70 leading-relaxed max-w-[130px]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>

          {/* Central floating "VS" Badge (Desktop only) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center z-20 select-none pointer-events-none">
            <div className="relative">
              {/* Outer white circle with thick border to mask behind card borders */}
              <div className="w-14 h-14 rounded-full bg-[#F7F5F2] border-[6px] border-[#F7F5F2] shadow-sm flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white border border-black/5 flex items-center justify-center">
                  <span className="font-space font-black text-sm text-black/65 italic tracking-tight">VS</span>
                </div>
              </div>
              {/* Sparkles around VS */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#4A7DFF" strokeWidth="2" strokeLinecap="round" className="absolute -top-3.5 -right-3.5">
                <path d="M16,8 L16,4 M16,24 L16,28 M8,16 L4,16 M24,16 L28,16" />
              </svg>
            </div>
          </div>

          {/* Mobile "VS" separator (visible only on mobile) */}
          <div className="flex lg:hidden items-center justify-center my-8 select-none">
            <div className="w-12 h-12 rounded-full bg-white border border-black/5 shadow-xs flex items-center justify-center">
              <span className="font-space font-black text-xs text-black/65 italic">VS</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
