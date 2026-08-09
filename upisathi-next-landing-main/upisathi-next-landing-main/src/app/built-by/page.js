import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { FiGithub, FiLinkedin, FiGlobe, FiCpu, FiHeart, FiCode } from 'react-icons/fi';

export default function BuiltByPage() {
  const technologies = [
    "React",
    "Next.js",
    "JavaScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Tailwind CSS",
    "WebSockets"
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip font-sans bg-[#F7F5F2] text-black">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-24 w-full flex flex-col justify-center">
        
        {/* Single Cohesive Card Layout */}
        <div className="bg-white border border-black/[0.05] rounded-[32px] shadow-sm hover:shadow-md transition-all duration-350 overflow-hidden grid grid-cols-1 md:grid-cols-12 w-full max-w-4xl mx-auto">
          
          {/* Left Column: Profile Panel (md:col-span-5) */}
          <div className="md:col-span-5 bg-[#FAF9F6] border-b md:border-b-0 md:border-r border-black/[0.04] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Ambient background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#4A7DFF]/5 blur-2xl -z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#FF5E97]/5 blur-2xl -z-0 pointer-events-none" />
            
            {/* Avatar Image Wrapper */}
            <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-[#4A7DFF]/10 to-[#FF5E97]/10 p-1 border border-black/5 shadow-xs mb-5 flex items-center justify-center z-10 transition-transform duration-300 hover:scale-[1.03]">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/pf-profile.png"
                  alt="Joydip Bag"
                  fill
                  priority
                  className="object-cover select-none"
                />
              </div>
            </div>

            {/* Title & Metadata */}
            <h1 className="font-sans font-extrabold text-2xl text-black leading-tight z-10">
              Joydip Bag
            </h1>
            <p className="font-space font-bold text-xs uppercase tracking-wider text-[#4A7DFF] mt-1.5 z-10">
              Full Stack &amp; Backend Engineer
            </p>
            
            {/* Connect Section (Horizontal Inline Icons) */}
            <div className="flex items-center gap-3 mt-6 z-10">
              <a
                href="https://github.com/joydipbag27/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-black/[0.05] flex items-center justify-center text-black/70 hover:border-black/20 hover:text-black transition-all duration-200 shadow-xs hover:-translate-y-0.5"
                title="GitHub"
              >
                <FiGithub size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/joydipbag27/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-black/[0.05] flex items-center justify-center text-[#0077B5]/70 hover:border-[#0077B5]/30 hover:text-[#0077B5] transition-all duration-200 shadow-xs hover:-translate-y-0.5"
                title="LinkedIn"
              >
                <FiLinkedin size={18} />
              </a>
              <a
                href="https://joydip.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-black/[0.05] flex items-center justify-center text-[#4A7DFF]/70 hover:border-[#4A7DFF]/30 hover:text-[#4A7DFF] transition-all duration-200 shadow-xs hover:-translate-y-0.5"
                title="Portfolio"
              >
                <FiGlobe size={18} />
              </a>
            </div>

            {/* Bottom mini footer on left column */}
            <p className="font-space font-semibold text-[10px] text-black/65 mt-8 pt-4 border-t border-black/5 w-full z-10 flex items-center justify-center gap-1">
              Built with <FiHeart className="text-[#FF5E97] fill-[#FF5E97]" size={9} /> for utility
            </p>
          </div>

          {/* Right Column: Bio & Content Panel (md:col-span-7) */}
          <div className="md:col-span-7 p-8 md:p-10 flex flex-col gap-6 justify-center">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#4A7DFF] font-space font-extrabold text-[9px] tracking-widest uppercase">
                <FiCode size={12} />
                <span>Developer Profile</span>
              </div>
              <h2 className="font-sans font-bold text-xl text-black">
                Hey there, I&apos;m Joydip Bag.
              </h2>
            </div>

            {/* Biography */}
            <div className="font-space font-semibold text-sm text-black/70 leading-relaxed flex flex-col gap-3">
              <p>
                I&apos;m a Full Stack Developer and Backend Engineer passionate about building practical software that solves real-world problems.
              </p>
              <p>
                My primary focus is designing scalable backend systems, APIs, and modern web applications while maintaining intuitive user experiences on the frontend.
              </p>
            </div>

            {/* why upisathi highlighted card */}
            <div className="bg-[#4A7DFF]/5 border border-[#4A7DFF]/10 rounded-2xl p-4.5">
              <h3 className="font-sans font-bold text-xs text-[#2563EB] mb-1">
                About upiSathi
              </h3>
              <p className="font-space font-semibold text-xs text-black/70 leading-relaxed">
                upiSathi was built as an independent project to solve a common problem: helping people quickly find nearby users for UPI &harr; Cash exchanges without relying on scattered WhatsApp groups or personal networks.
              </p>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="font-sans font-bold text-xs text-black mb-2.5 flex items-center gap-1.5">
                <FiCpu size={14} className="text-[#FF5E97]" />
                <span>Technologies Used</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="font-space font-bold text-[10px] md:text-xs px-2.5 py-1 rounded-lg bg-black/[0.03] border border-black/[0.04] text-black/70 hover:bg-black/[0.05] transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
