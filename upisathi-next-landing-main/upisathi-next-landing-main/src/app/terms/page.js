import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiShield, FiMail, FiChevronRight, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function TermsOfService() {
  const sections = [
    { id: "about", title: "1. About upiSathi" },
    { id: "eligibility", title: "2. Eligibility" },
    { id: "registration", title: "3. Account Registration" },
    { id: "conduct", title: "4. User Conduct" },
    { id: "responsibility", title: "5. User Responsibility" },
    { id: "transactions", title: "6. Transactions & Exchanges" },
    { id: "safety", title: "7. Safety Guidelines" },
    { id: "ratings", title: "8. Ratings & Reviews" },
    { id: "intellectual", title: "9. Intellectual Property" },
    { id: "privacy", title: "10. Privacy" },
    { id: "termination", title: "11. Suspension & Termination" },
    { id: "warranties", title: "12. Disclaimer of Warranties" },
    { id: "liability", title: "13. Limitation of Liability" },
    { id: "indemnification", title: "14. Indemnification" },
    { id: "modifications", title: "15. Modifications to Service" },
    { id: "changes", title: "16. Changes to These Terms" },
    { id: "governing", title: "17. Governing Law" },
    { id: "contact", title: "18. Contact Information" }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip font-sans bg-[#F7F5F2] text-black">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-16 w-full">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3 text-[#4A7DFF] font-space font-extrabold text-[10px] tracking-widest uppercase">
            <FiShield size={14} />
            <span>Legal Document</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight font-sans">
            Terms of Service
          </h1>
          <div className="flex items-center gap-2 text-black/50 text-xs md:text-sm font-space font-bold mt-2">
            <FiClock size={14} />
            <span>Last Updated: June 2026</span>
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

          {/* Terms Content Column */}
          <article className="lg:col-span-8 flex flex-col gap-10 text-black/70 leading-relaxed font-space text-sm md:text-base font-semibold">
            
            {/* Intro paragraph */}
            <p className="font-medium text-black/80 leading-relaxed text-base md:text-lg">
              Welcome to <strong>upiSathi</strong> (&quot;Platform&quot;, &quot;Service&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
            </p>
            <p className="font-medium text-black/80 leading-relaxed -mt-4">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the upiSathi website, applications, and related services.
            </p>
            <p className="font-medium text-black/80 leading-relaxed -mt-4">
              By creating an account or using the Platform, you agree to be bound by these Terms. If you do not agree, you may not access or use the Platform.
            </p>

            <hr className="border-black/5" />

            {/* 1. About upiSathi */}
            <section id="about" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">1. About upiSathi</h2>
              <p className="mb-4">
                upiSathi is a peer-to-peer discovery platform that enables users to connect with one another for UPI-to-cash and cash-to-UPI exchange opportunities.
              </p>
              
              <div className="bg-[#4A7DFF]/5 border border-[#4A7DFF]/10 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2.5 text-[#4A7DFF] font-space font-extrabold text-sm uppercase">
                  <FiShield size={18} />
                  <span>Important Notice</span>
                </div>
                
                <p className="text-xs md:text-sm text-black/75 leading-relaxed font-medium">
                  upiSathi:
                </p>
                <ul className="list-disc pl-5 text-xs md:text-sm text-black/75 flex flex-col gap-1 font-space font-semibold">
                  <li>Does not process payments</li>
                  <li>Does not hold funds</li>
                  <li>Does not verify currency authenticity</li>
                  <li>Does not guarantee transactions</li>
                  <li>Does not act as a bank, financial institution, money transmitter, payment processor, escrow service, or intermediary</li>
                </ul>
                <p className="text-xs md:text-sm text-[#1E3A8A] font-space font-extrabold mt-1">
                  All exchanges occur solely between users.
                </p>
              </div>
            </section>

            {/* 2. Eligibility */}
            <section id="eligibility" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">2. Eligibility</h2>
              <p className="mb-3">To use the Platform, you must:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Be at least 18 years old</li>
                <li>Have the legal capacity to enter into agreements</li>
                <li>Comply with applicable laws and regulations</li>
                <li>Provide accurate registration information</li>
              </ul>
              <p>By using the Platform, you represent and warrant that you meet these requirements.</p>
            </section>

            {/* 3. Account Registration */}
            <section id="registration" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">3. Account Registration</h2>
              <p className="mb-3">You are responsible for:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>Securing your password</li>
                <li>All activity occurring under your account</li>
              </ul>
              <p className="mb-3">
                You agree to provide accurate and current information during registration and to keep such information updated.
              </p>
              <p>
                We reserve the right to suspend or terminate accounts that contain false, misleading, or incomplete information.
              </p>
            </section>

            {/* 4. User Conduct */}
            <section id="conduct" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">4. User Conduct</h2>
              <p className="mb-3">You agree to use the Platform responsibly and lawfully.</p>
              <p className="mb-3">You must not:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Violate any applicable laws or regulations</li>
                <li>Impersonate another person</li>
                <li>Create fraudulent requests or listings</li>
                <li>Misrepresent exchange amounts or details</li>
                <li>Harass, threaten, intimidate, or abuse other users</li>
                <li>Spam users</li>
                <li>Attempt unauthorized access to systems or accounts</li>
                <li>Use automated tools to scrape or harvest data</li>
                <li>Upload malicious software or harmful content</li>
                <li>Use the Platform for money laundering, fraud, scams, or illegal financial activity</li>
              </ul>
              <p className="mt-3 text-xs md:text-sm text-black/50">
                Any violation may result in account suspension or permanent removal.
              </p>
            </section>

            {/* 5. User Responsibility */}
            <section id="responsibility" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">5. User Responsibility</h2>
              <p className="mb-3">You acknowledge and agree that:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>You are solely responsible for your interactions with other users.</li>
                <li>You are solely responsible for verifying the identity of individuals you meet.</li>
                <li>You are solely responsible for verifying cash authenticity.</li>
                <li>You are solely responsible for verifying payment completion.</li>
                <li>You are solely responsible for complying with local laws and regulations.</li>
              </ul>
              <p>upiSathi does not supervise, monitor, or guarantee user behavior.</p>
            </section>

            {/* 6. Transactions and Exchanges */}
            <section id="transactions" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">6. Transactions and Exchanges</h2>
              <p className="mb-3 font-medium text-black/80">The Platform only facilitates user discovery and communication.</p>
              <p className="mb-3">upiSathi:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Is not a party to any exchange</li>
                <li>Does not verify transaction completion</li>
                <li>Does not verify the authenticity of currency</li>
                <li>Does not guarantee the availability of users</li>
                <li>Does not guarantee successful exchanges</li>
              </ul>
              <p className="font-semibold text-black/80">
                All risks associated with exchanges are assumed by participating users.
              </p>
            </section>

            {/* 7. Safety Guidelines */}
            <section id="safety" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">7. Safety Guidelines</h2>
              <p className="mb-3">Users should:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Meet only in safe public locations</li>
                <li>Verify exchange details before meeting</li>
                <li>Use the in-app chat system when possible</li>
                <li>Exercise reasonable caution during all interactions</li>
              </ul>
              <p className="text-xs md:text-sm text-black/50">
                Failure to follow safety recommendations is at the user&apos;s own risk.
              </p>
            </section>

            {/* 8. Ratings and Reviews */}
            <section id="ratings" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">8. Ratings and Reviews</h2>
              <p className="mb-3">Users may leave ratings and reviews based on their experiences.</p>
              <p className="mb-3">You agree that:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Reviews must be truthful and based on actual interactions.</li>
                <li>Reviews must not contain abusive, defamatory, or misleading content.</li>
              </ul>
              <p>We reserve the right to remove reviews that violate these Terms.</p>
            </section>

            {/* 9. Intellectual Property */}
            <section id="intellectual" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">9. Intellectual Property</h2>
              <p className="mb-3">The Platform, including but not limited to logos, branding, software, designs, content, and features, are owned by or licensed to upiSathi and protected by applicable intellectual property laws.</p>
              <p className="mb-3">You may not:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Copy</li>
                <li>Modify</li>
                <li>Reverse engineer</li>
                <li>Redistribute</li>
                <li>Commercially exploit</li>
              </ul>
              <p className="mt-3">any part of the Platform without prior written permission.</p>
            </section>

            {/* 10. Privacy */}
            <section id="privacy" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">10. Privacy</h2>
              <p className="mb-3">Your use of the Platform is also governed by our Privacy Policy.</p>
              <p>By using the Platform, you consent to the collection and use of information as described in that policy.</p>
            </section>

            {/* 11. Suspension and Termination */}
            <section id="termination" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">11. Suspension and Termination</h2>
              <p className="mb-3">We may suspend or terminate accounts at any time if we reasonably believe that a user:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Violates these Terms</li>
                <li>Engages in suspicious activity</li>
                <li>Creates security risks</li>
                <li>Harms other users</li>
                <li>Uses the Platform unlawfully</li>
              </ul>
              <p className="text-xs md:text-sm text-black/50">
                Termination may occur with or without prior notice.
              </p>
            </section>

            {/* 12. Disclaimer of Warranties */}
            <section id="warranties" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">12. Disclaimer of Warranties</h2>
              <p className="mb-3">The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.</p>
              <p className="mb-3">To the maximum extent permitted by law, upiSathi disclaims all warranties, whether express or implied, including but not limited to:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Availability</li>
                <li>Accuracy</li>
                <li>Reliability</li>
                <li>Non-infringement</li>
              </ul>
              <p>We do not guarantee uninterrupted or error-free operation.</p>
            </section>

            {/* 13. Limitation of Liability */}
            <section id="liability" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">13. Limitation of Liability</h2>
              <p className="mb-3">To the fullest extent permitted by law, upiSathi, its founders, employees, affiliates, and partners shall not be liable for:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>User disputes</li>
                <li>Failed exchanges</li>
                <li>Fraudulent activity</li>
                <li>Counterfeit currency</li>
                <li>Payment issues</li>
                <li>Personal injury</li>
                <li>Property damage</li>
                <li>Loss of profits</li>
                <li>Data loss</li>
                <li>Indirect or consequential damages</li>
              </ul>
              <p className="font-semibold text-black/85">
                Your use of the Platform is entirely at your own risk.
              </p>
            </section>

            {/* 14. Indemnification */}
            <section id="indemnification" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">14. Indemnification</h2>
              <p className="mb-3">
                You agree to defend, indemnify, and hold harmless upiSathi and its affiliates from any claims, liabilities, damages, losses, or expenses arising from:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Your use of the Platform</li>
                <li>Your interactions with other users</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of applicable laws</li>
              </ul>
            </section>

            {/* 15. Modifications to the Service */}
            <section id="modifications" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">15. Modifications to the Service</h2>
              <p className="mb-3">We may:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Modify features</li>
                <li>Add functionality</li>
                <li>Remove functionality</li>
                <li>Suspend portions of the Platform</li>
                <li>Discontinue the Service</li>
              </ul>
              <p>at any time without liability.</p>
            </section>

            {/* 16. Changes to These Terms */}
            <section id="changes" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">16. Changes to These Terms</h2>
              <p className="mb-3">We may update these Terms from time to time. When changes are made:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>The updated version will be posted on the Platform.</li>
                <li>The &quot;Last Updated&quot; date will be revised.</li>
              </ul>
              <p>Continued use of the Platform after changes become effective constitutes acceptance of the revised Terms.</p>
            </section>

            {/* 17. Governing Law */}
            <section id="governing" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">17. Governing Law</h2>
              <p className="mb-3">These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict-of-law principles.</p>
              <p>Any disputes arising from these Terms or use of the Platform shall be subject to the exclusive jurisdiction of the courts located in India.</p>
            </section>

            {/* 18. Contact Information */}
            <section id="contact" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">18. Contact Information</h2>
              <p className="mb-3">For questions regarding these Terms, contact:</p>
              <div className="flex items-center gap-2.5 font-space font-bold text-[#4A7DFF] bg-[#4A7DFF]/5 border border-[#4A7DFF]/15 px-4 py-3 rounded-2xl w-fit">
                <FiMail size={16} />
                <a href="mailto:support@upisathi.com" className="hover:underline">support@upisathi.com</a>
              </div>
            </section>

            <hr className="border-black/5" />

            {/* Acknowledgment Acknowledge Alert Card */}
            <section className="bg-[#10B981]/5 border border-[#10B981]/15 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 flex items-center justify-center shrink-0">
                <FiCheckCircle size={24} className="text-[#10B981]" />
              </div>
              <div className="flex-1 font-space text-xs md:text-sm text-black/75 leading-relaxed">
                <h3 className="font-extrabold text-[#065F46] text-base mb-1">Acknowledgment</h3>
                <p>
                  By accessing or using upiSathi, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </section>

          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}
