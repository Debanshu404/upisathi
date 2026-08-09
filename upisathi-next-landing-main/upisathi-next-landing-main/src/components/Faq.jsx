import Image from 'next/image';
import { FiHelpCircle, FiShield, FiUsers, FiZap } from 'react-icons/fi';
import FaqAccordionList from './FaqAccordionList';

export default function Faq() {
  return (
    <section id="faq" className="bg-[#F7F5F2] pt-20 pb-30 border-t border-black/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* FAQ Grid block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto mb-10">
          
          {/* Left Column: Heading and Illustration (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            
            {/* FAQ Tag Badge */}
            <div className="flex items-center gap-2 mb-4 select-none">
              <FiHelpCircle size={14} className="text-[#4A7DFF]" />
              <span className="text-[10px] uppercase font-space font-extrabold tracking-widest text-[#4A7DFF]">
                FAQ
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight mb-4 font-sans">
              Frequently
              <span className="block mt-2">
                Asked <span className="text-[#4A7DFF] relative inline-block">
                  Questions
                  <svg viewBox="0 0 300 20" fill="none" stroke="#4A7DFF" strokeWidth="4" strokeLinecap="round" className="absolute left-0 -bottom-3 w-full h-[12px] pointer-events-none">
                    <path d="M10,10 Q150,15 290,8" />
                  </svg>
                </span>
              </span>
            </h2>

            {/* Description */}
            <p className="font-space font-semibold text-xs md:text-sm text-black/70 leading-relaxed max-w-sm">
              Everything you need to know about using upiSathi safely and effectively.
            </p>

            {/* SVG Illustration from Public Folder */}
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-start select-none mt-4">
              <Image
                src="/web development, games _ puzzle, piece, plugin, man, people, development, complete.svg"
                alt="Friendly illustration representing emotions and helpful responses"
                fill
                priority
                className="object-contain"
              />
            </div>

          </div>

          {/* Right Column: Accordions (7 cols) */}
          <div className="lg:col-span-7 w-full flex flex-col lg:min-h-[585px]">
            <FaqAccordionList />
          </div>

        </div>

        {/* Bottom CTA Banner */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#F0F4FF] to-[#E6EEFF] border border-[#4A7DFF]/15 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
            
            {/* Left Column: Content details */}
            <div className="flex flex-col z-10 max-w-xl">
              <h3 className="font-sans font-bold text-2xl md:text-3xl text-black mb-2">
                Ready to get started?
              </h3>
              
              <p className="font-sans font-bold text-xl md:text-2xl text-[#4A7DFF] leading-snug">
                Create a request and find your match today.
              </p>

              {/* Tag bullet checklist */}
              <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-black/75 font-space font-bold">
                <span className="flex items-center gap-2">
                  <FiShield className="w-4 h-4 text-[#4A7DFF]" />
                  Safe & Secure
                </span>
                <span className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4 text-[#4A7DFF]" />
                  Real People
                </span>
                <span className="flex items-center gap-2">
                  <FiZap className="w-4 h-4 text-[#4A7DFF]" />
                  Quick & Easy
                </span>
              </div>
            </div>

            {/* Right Column: CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start gap-4 z-10 shrink-0">
              {/* Primary button */}
              <button className="w-full sm:w-auto bg-black border-2 border-black text-[#F7F5F2] font-space font-extrabold text-sm px-6 py-3.5 hover:bg-transparent hover:text-black transition-colors duration-150 rounded-none text-center shadow-[4px_4px_0px_0px_rgba(74,125,255,1)]">
                Create Your First Request &nbsp; →
              </button>

              {/* Secondary text arrow link */}
              <a
                href="#"
                className="group flex items-center justify-start gap-2 border-2 border-transparent font-space font-extrabold text-sm py-2 px-1 text-black transition-all duration-150"
              >
                Browse Active Requests
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4A7DFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform group-hover:translate-x-1 transition-transform text-[#4A7DFF]"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>

          </div>
        </div>

        {/* Small Centered Sub-footer Label */}
        <div className="flex items-center justify-center gap-2 mt-6 text-[11px] text-black/65 font-space font-bold select-none">
          <FiShield className="w-3.5 h-3.5 text-black/55" />
          <span>upiSathi is a platform that connects users. We do not process payments or hold any funds.</span>
        </div>

      </div>
    </section>
  );
}
