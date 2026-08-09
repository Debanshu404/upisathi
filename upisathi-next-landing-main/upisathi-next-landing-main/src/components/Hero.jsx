import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative py-16 md:py-24 flex-1 flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Hero text (60%) */}
        <div className="lg:col-span-7 flex flex-col pr-0 lg:pr-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tighter font-bold text-black leading-tight mb-6">
            Need cash?
            <span className="block mt-1">Find people</span>
            <span className="block mt-1 text-[#4A7DFF] hero-underline-container">
              who needs UPI.
              <svg
                viewBox="0 0 300 20"
                fill="none"
                stroke="#4A7DFF"
                strokeWidth="4"
                strokeLinecap="round"
                className="hero-underline-svg"
              >
                <path d="M10,10 Q150,15 290,8 C190,12 80,10 20,13" />
              </svg>
            </span>
          </h1>

          <p className="font-space font-bold text-base sm:text-lg text-black/75 max-w-lg mb-8 leading-relaxed mt-2">
            Post a request, browse active listings, chat with users, and
            coordinate your exchange.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <button className="bg-black border-2 border-black text-[#F7F5F2] font-space font-extrabold text-sm px-6 py-3.5 hover:bg-transparent hover:text-black transition-colors duration-150 rounded-none text-center shadow-[4px_4px_0px_0px_rgba(74,125,255,1)]">
              Create a Request
            </button>

            <a
              href="#"
              className="group flex items-center justify-center gap-2 border-2 border-transparent font-space font-extrabold text-sm px-6 py-3.5 text-black hover:border-black transition-all duration-150"
            >
              Browse Requests
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform group-hover:translate-x-1 transition-transform"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

        {/* Hero illustration (40%) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
          <div className="relative w-full max-w-[220px] sm:max-w-[320px] lg:max-w-full aspect-square flex items-center justify-center">
            <Image
              src="/laptop,computer,brightness,ui,user experience,flash,bright,device.svg"
              alt="Playful illustration of a laptop representing digital cash and interface exchanges"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
