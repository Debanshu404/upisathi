"use client";

import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { LuBadgeIndianRupee } from "react-icons/lu";
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (e, targetId) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        if (window.location.hash !== `#${targetId}`) {
          window.history.pushState(window.history.state, '', `/#${targetId}`);
        }
      }
    }
  };

  const handleScrollToTop = (e) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.pushState(window.history.state, '', '/');
      }
    }
  };

  return (
    <header className="border-b border-black/10 bg-[#F7F5F2]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        <Link 
          href="/" 
          onClick={handleScrollToTop}
          className="flex items-center gap-1"
        >
          <LuBadgeIndianRupee size={35} className="text-black" />
          <span className="font-space font-black text-2xl bg-gradient-to-r from-[#4A7DFF] to-blue-600 bg-clip-text text-transparent tracking-tight flex items-center gap-2 select-none">
            UpiSathi
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            onClick={handleScrollToTop}
            className="font-space font-extrabold text-sm tracking-tight text-[#4A7DFF] hover-underline-animation"
          >
            Home
          </Link>
          <Link
            href="/#how-it-works"
            onClick={(e) => handleScroll(e, 'how-it-works')}
            className="font-space font-bold text-sm tracking-tight text-black/75 hover:text-black hover-underline-animation"
          >
            How It Works
          </Link>
          <Link
            href="/#safety"
            onClick={(e) => handleScroll(e, 'safety')}
            className="font-space font-bold text-sm tracking-tight text-black/75 hover:text-black hover-underline-animation"
          >
            Safety
          </Link>
          <Link
            href="/#faq"
            onClick={(e) => handleScroll(e, 'faq')}
            className="font-space font-bold text-sm tracking-tight text-black/75 hover:text-black hover-underline-animation"
          >
            FAQ
          </Link>
          <Link
            href="/built-by"
            className="font-space font-bold text-sm tracking-tight text-black/75 hover:text-black hover-underline-animation"
          >
            Built By
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden sm:block bg-black border-2 border-black text-[#F7F5F2] font-space font-extrabold text-xs px-5 py-2.5 hover:bg-transparent hover:text-black transition-colors duration-150 rounded-none shadow-[3px_3px_0px_0px_rgba(74,125,255,1)] cursor-pointer">
            Launch App
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-black hover:text-[#4A7DFF] transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div 
          className={`absolute top-20 left-0 w-full bg-[#F7F5F2]/95 backdrop-blur-md border-b border-black/10 p-6 flex flex-col gap-5 z-30 transition-all duration-300 md:hidden shadow-md ${
            isMenuOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <Link
            href="/"
            onClick={(e) => {
              setIsMenuOpen(false);
              handleScrollToTop(e);
            }}
            className="font-space font-extrabold text-base tracking-tight text-[#4A7DFF]"
          >
            Home
          </Link>
          <Link
            href="/#how-it-works"
            onClick={(e) => {
              setIsMenuOpen(false);
              handleScroll(e, 'how-it-works');
            }}
            className="font-space font-bold text-base tracking-tight text-black/75 hover:text-black"
          >
            How It Works
          </Link>
          <Link
            href="/#safety"
            onClick={(e) => {
              setIsMenuOpen(false);
              handleScroll(e, 'safety');
            }}
            className="font-space font-bold text-base tracking-tight text-black/75 hover:text-black"
          >
            Safety
          </Link>
          <Link
            href="/#faq"
            onClick={(e) => {
              setIsMenuOpen(false);
              handleScroll(e, 'faq');
            }}
            className="font-space font-bold text-base tracking-tight text-black/75 hover:text-black"
          >
            FAQ
          </Link>
          <Link
            href="/built-by"
            onClick={() => setIsMenuOpen(false)}
            className="font-space font-bold text-base tracking-tight text-black/75 hover:text-black"
          >
            Built By
          </Link>
          
          <button className="w-full bg-black border-2 border-black text-[#F7F5F2] font-space font-extrabold text-sm py-3 hover:bg-transparent hover:text-black transition-colors duration-150 rounded-none shadow-[3px_3px_0px_0px_rgba(74,125,255,1)] mt-2">
            Launch App
          </button>
        </div>
      </div>
    </header>
  );
}
