"use client";

import React from 'react';
import { FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa6';
import Link from 'next/link';

export default function Footer() {
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

  return (
    <footer className="bg-[#F7F5F2] border-t border-black/10 pt-16 pb-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 max-w-5xl mx-auto">
          
          {/* Brand & Socials Column (5 cols on large screens) */}
          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            <span className="font-space font-black text-2xl bg-gradient-to-r from-[#4A7DFF] to-blue-600 bg-clip-text text-transparent tracking-tight select-none">
              UpiSathi
            </span>
            <p className="font-space font-semibold text-xs md:text-sm text-black/70 leading-relaxed max-w-sm">
              Discover, connect, and exchange peer-to-peer cash safely and instantly near you. No middleman, no fees, just you and your sathi.
            </p>
            {/* Social Icons Container */}
            <div className="flex items-center gap-4 mt-2">
              <a 
                href="https://www.linkedin.com/in/joydipbag27/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-xl bg-black/[0.03] flex items-center justify-center text-black/50 hover:bg-[#4A7DFF]/10 hover:text-[#4A7DFF] transition-all duration-200" 
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a 
                href="https://github.com/joydipbag27/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-xl bg-black/[0.03] flex items-center justify-center text-black/50 hover:bg-[#4A7DFF]/10 hover:text-[#4A7DFF] transition-all duration-200" 
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns (7 cols split across three link lists) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
            
            {/* Column 2: Explore */}
            <div className="flex flex-col gap-4">
              <span className="font-space font-black text-xs md:text-sm uppercase tracking-wider text-black select-none">
                Explore
              </span>
              <ul className="flex flex-col gap-3 font-space text-[13px] font-bold text-black/70">
                <li>
                  <Link 
                    href="/#how-it-works" 
                    onClick={(e) => handleScroll(e, 'how-it-works')}
                    className="hover-underline-animation hover:text-black"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/#comparison" 
                    onClick={(e) => handleScroll(e, 'comparison')}
                    className="hover-underline-animation hover:text-black"
                  >
                    Comparison
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/#faq" 
                    onClick={(e) => handleScroll(e, 'faq')}
                    className="hover-underline-animation hover:text-black"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/built-by" className="hover-underline-animation hover:text-black">Built By</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Safety & Support */}
            <div className="flex flex-col gap-4">
              <span className="font-space font-black text-xs md:text-sm uppercase tracking-wider text-black select-none">
                Safety &amp; Support
              </span>
              <ul className="flex flex-col gap-3 font-space text-[13px] font-bold text-black/70">
                <li>
                  <Link href="/safety" className="hover-underline-animation hover:text-black">Safety Guidelines</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover-underline-animation hover:text-black">Contact Support</Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="flex flex-col gap-4">
              <span className="font-space font-black text-xs md:text-sm uppercase tracking-wider text-black select-none">
                Legal
              </span>
              <ul className="flex flex-col gap-3 font-space text-[13px] font-bold text-black/70">
                <li>
                  <Link href="/privacy" className="hover-underline-animation hover:text-black">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover-underline-animation hover:text-black">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/terms#conduct" className="hover-underline-animation hover:text-black">Platform Rules</Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover-underline-animation hover:text-black">Disclaimers</Link>
                </li>
              </ul>
            </div>

          </div>
          
        </div>

        {/* Divider and Copyright bottom block */}
        <div className="max-w-5xl mx-auto border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-space text-xs font-bold text-black/70">
            &copy; {new Date().getFullYear()} UpiSathi. All rights reserved.
          </span>
          <span className="font-space text-xs font-bold text-black/70 flex items-center gap-1.5 select-none">
            Built with <FaHeart className="text-[#FF5E97]" size={10} /> by <Link href="/built-by" className="hover:underline text-black/75 font-black">Joydip Bag</Link>
          </span>
        </div>

      </div>
    </footer>
  );
}
