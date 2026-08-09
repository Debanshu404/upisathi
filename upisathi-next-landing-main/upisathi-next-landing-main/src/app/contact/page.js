import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiShield, FiMail, FiChevronRight, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function ContactUsPage() {
  const sections = [
    { id: "get-in-touch", title: "1. Get in Touch" },
    { id: "what-we-help", title: "2. What Can We Help With?" },
    { id: "safety-concerns", title: "3. Reporting Safety Concerns" },
    { id: "before-contact", title: "4. Before You Contact Us" },
    { id: "commitment", title: "5. Our Commitment" }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip font-sans bg-[#F7F5F2] text-black">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-16 w-full">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3 text-[#4A7DFF] font-space font-extrabold text-[10px] tracking-widest uppercase">
            <FiShield size={14} />
            <span>Support &amp; Feedback</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight font-sans">
            Contact Us
          </h1>
          <div className="flex items-center gap-2 text-black/50 text-xs md:text-sm font-space font-bold mt-2">
            <FiClock size={14} />
            <span>We respond within 24–48 hours</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start relative">
          
          {/* Table of Contents - Sticky sidebar on Desktop */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 bg-white border border-black/[0.04] p-6 rounded-3xl shadow-xs hidden lg:block">
            <h2 className="font-space font-black text-xs uppercase tracking-wider text-black mb-4 select-none pb-2 border-b border-black/5">
              Table of Contents
            </h2>
            <nav className="flex flex-col gap-2.5">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="font-space font-bold text-xs text-black/50 hover:text-[#4A7DFF] transition-colors flex items-center gap-1.5 group"
                >
                  <FiChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#4A7DFF]" />
                  <span>{sec.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Contact Content Column */}
          <article className="lg:col-span-8 flex flex-col gap-10 text-black/70 leading-relaxed font-space text-sm md:text-base font-semibold">
            
            {/* Intro paragraph */}
            <p className="font-medium text-black/80 leading-relaxed text-base md:text-lg">
              We&apos;re always happy to hear from you.
            </p>
            <p className="font-medium text-black/80 leading-relaxed -mt-4">
              Whether you have a question, found a bug, want to suggest a feature, or need help using upiSathi, feel free to reach out.
            </p>

            <hr className="border-black/5" />

            {/* 1. Get in Touch */}
            <section id="get-in-touch" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">1. Get in Touch</h2>
              <p className="mb-4">
                For support, feedback, partnership inquiries, or general questions:
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2.5 font-space font-bold text-[#4A7DFF] bg-[#4A7DFF]/5 border border-[#4A7DFF]/15 px-5 py-4 rounded-2xl w-fit">
                  <FiMail size={18} />
                  <a href="mailto:support@upisathi.com" className="hover:underline text-sm md:text-base">support@upisathi.com</a>
                </div>
                <span className="text-xs text-black/40 font-space font-bold">
                  We typically respond within 24–48 hours.
                </span>
              </div>
            </section>

            {/* 2. What Can We Help With? */}
            <section id="what-we-help" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">2. What Can We Help With?</h2>
              <p className="mb-3">We are here to assist you with:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Account-related issues</li>
                <li>Technical problems or bugs</li>
                <li>Feature requests and suggestions</li>
                <li>Safety concerns</li>
                <li>General feedback</li>
                <li>Business and partnership inquiries</li>
              </ul>
            </section>

            {/* 3. Reporting Safety Concerns */}
            <section id="safety-concerns" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">3. Reporting Safety Concerns</h2>
              <p className="mb-4">
                If you encounter suspicious activity, fraudulent behavior, harassment, or any safety-related issue on the platform, please contact us immediately.
              </p>
              <div className="bg-[#FF5E97]/5 border border-[#FF5E97]/15 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5E97]/10 flex items-center justify-center shrink-0">
                  <FiAlertTriangle size={24} className="text-[#FF5E97]" />
                </div>
                <div className="flex-1 font-space text-xs md:text-sm text-black/75 leading-relaxed">
                  <h3 className="font-extrabold text-[#9C3A27] text-base mb-1">Safety First</h3>
                  <p>
                    Please include as much detail as possible in your report so we can investigate the matter effectively and take appropriate actions.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Before You Contact Us */}
            <section id="before-contact" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">4. Before You Contact Us</h2>
              <p className="mb-3">To help us resolve your issue faster, please include:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Your registered email address (if applicable)</li>
                <li>A description of the issue</li>
                <li>Relevant screenshots (if available)</li>
                <li>Steps to reproduce the problem (for technical issues)</li>
              </ul>
            </section>

            {/* 5. Our Commitment */}
            <section id="commitment" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">5. Our Commitment</h2>
              <p className="mb-4">
                We&apos;re committed to building a simple, reliable, and community-driven platform that helps people connect safely.
              </p>
              <p className="mb-4">
                Your feedback helps us improve upiSathi for everyone.
              </p>
              
              <div className="bg-[#10B981]/5 border border-[#10B981]/15 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 flex items-center justify-center shrink-0">
                  <FiCheckCircle size={24} className="text-[#10B981]" />
                </div>
                <div className="flex-1 font-space text-xs md:text-sm text-black/75 leading-relaxed">
                  <h3 className="font-extrabold text-[#065F46] text-base mb-1">Thank You</h3>
                  <p>
                    Thank you for being part of the upiSathi community.
                  </p>
                </div>
              </div>
            </section>

          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}
