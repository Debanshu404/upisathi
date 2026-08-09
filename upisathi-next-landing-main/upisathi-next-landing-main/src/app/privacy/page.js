import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiShield, FiMail, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';

export default function PrivacyPolicy() {
  const sections = [
    { id: "about", title: "1. About upiSathi" },
    { id: "collection", title: "2. Information We Collect" },
    { id: "usage", title: "3. How We Use Your Information" },
    { id: "public-content", title: "4. Reviews and Public Content" },
    { id: "sharing", title: "5. How We Share Information" },
    { id: "security", title: "6. Data Security" },
    { id: "retention", title: "7. Data Retention" },
    { id: "rights", title: "8. Your Rights" },
    { id: "deletion", title: "9. Account Deletion" },
    { id: "children", title: "10. Children&apos;s Privacy" },
    { id: "third-party", title: "11. Third-Party Services" },
    { id: "international", title: "12. International Data Processing" },
    { id: "changes", title: "13. Changes to This Policy" },
    { id: "contact", title: "14. Contact Us" }
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
            Privacy Policy
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

          {/* Privacy Content Column */}
          <article className="lg:col-span-8 flex flex-col gap-10 text-black/70 leading-relaxed font-space text-sm md:text-base font-semibold">
            
            {/* Intro paragraph */}
            <p className="font-medium text-black/80 leading-relaxed text-base md:text-lg">
              Welcome to <strong>upiSathi</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website, applications, and related services (collectively, the &quot;Platform&quot;).
            </p>
            <p className="font-medium text-black/80 leading-relaxed -mt-4">
              By accessing or using upiSathi, you agree to the practices described in this Privacy Policy.
            </p>

            <hr className="border-black/5" />

            {/* 1. About upiSathi */}
            <section id="about" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">1. About upiSathi</h2>
              <p>
                upiSathi is a peer-to-peer discovery platform that helps users connect with one another for UPI-to-cash and cash-to-UPI exchange requests.
              </p>
              <div className="bg-[#4A7DFF]/5 border border-[#4A7DFF]/10 rounded-2xl p-4 flex gap-3 mt-4 items-start">
                <FiShield size={18} className="text-[#4A7DFF] mt-0.5 shrink-0" />
                <p className="text-xs md:text-sm text-black/75 leading-relaxed font-space font-semibold">
                  <strong>Important:</strong> upiSathi does not process payments, hold funds, verify currency authenticity, or participate in financial transactions between users.
                </p>
              </div>
            </section>

            {/* 2. Information We Collect */}
            <section id="collection" className="scroll-mt-24 flex flex-col gap-6">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-sans">2. Information We Collect</h2>
              
              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider">2.1 Account Information</h3>
                <p className="mb-2">When you create an account, we may collect:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Username</li>
                  <li>Profile photo (optional)</li>
                  <li>Password (stored in encrypted form)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider">2.2 Profile Information</h3>
                <p className="mb-2">You may choose to provide:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Bio or profile description</li>
                  <li>City or general location</li>
                  <li>User preferences</li>
                  <li>Ratings and reviews</li>
                </ul>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider">2.3 Request and Listing Information</h3>
                <p className="mb-2">When using the Platform, we may collect:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Request title</li>
                  <li>Request description</li>
                  <li>Exchange amount</li>
                  <li>Preferred meeting location</li>
                  <li>Availability information</li>
                  <li>Associated metadata</li>
                </ul>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider">2.4 Communication Data</h3>
                <p>
                  When users communicate through our messaging system, we may collect:
                </p>
                <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
                  <li>Chat messages</li>
                  <li>Message timestamps</li>
                  <li>Conversation metadata</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-black/50">
                  This information is collected to provide messaging functionality, investigate abuse, and improve platform safety.
                </p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider">2.5 Location Information</h3>
                <p>
                  To help users discover nearby exchange opportunities, we may collect:
                </p>
                <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
                  <li>Device location (with permission)</li>
                  <li>Approximate geographic coordinates</li>
                  <li>Location-based preferences</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-black/50">
                  You may disable location access through your device settings; however, some features may not function properly.
                </p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider">2.6 Technical Information</h3>
                <p className="mb-2">We automatically collect certain technical information, including:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device type</li>
                  <li>Operating system</li>
                  <li>Referral URLs</li>
                  <li>Pages visited</li>
                  <li>Access times</li>
                  <li>Usage statistics</li>
                </ul>
              </div>
            </section>

            {/* 3. How We Use Your Information */}
            <section id="usage" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">3. How We Use Your Information</h2>
              <p className="mb-3">We use information to:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Create and manage user accounts</li>
                <li>Provide platform functionality</li>
                <li>Match users based on location and requests</li>
                <li>Enable messaging between users</li>
                <li>Improve user experience</li>
                <li>Detect fraud, abuse, and misuse</li>
                <li>Monitor platform performance</li>
                <li>Respond to support requests</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* 4. Reviews and Public Content */}
            <section id="public-content" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">4. Reviews and Public Content</h2>
              <p className="mb-3">Certain information may be visible to other users, including:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Username</li>
                <li>Profile information you choose to share</li>
                <li>Ratings and reviews</li>
                <li>Requests you publish</li>
                <li>Public profile activity</li>
              </ul>
              <p className="mt-3 text-xs md:text-sm text-black/50 font-space font-semibold">
                Please avoid posting sensitive personal information publicly.
              </p>
            </section>

            {/* 5. How We Share Information */}
            <section id="sharing" className="scroll-mt-24 flex flex-col gap-6">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-sans">5. How We Share Information</h2>
              <p className="-mb-2">We do not sell your personal information. We may share information in the following situations:</p>
              
              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-1.5 tracking-wider">Service Providers</h3>
                <p>We may work with trusted third-party providers that help us host the Platform, store data securely, send emails and notifications, and monitor performance and security. These providers only receive information necessary to perform their services.</p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-1.5 tracking-wider">Legal Requirements</h3>
                <p>We may disclose information if required by applicable laws, court orders, government requests, or law enforcement investigations.</p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-1.5 tracking-wider">Safety and Security</h3>
                <p>We may share information when necessary to prevent fraud, investigate suspicious activity, protect users, and enforce our Terms of Service.</p>
              </div>
            </section>

            {/* 6. Data Security */}
            <section id="security" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">6. Data Security</h2>
              <p className="mb-3">We implement reasonable technical and organizational safeguards to protect user information. These measures may include:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Encrypted connections (HTTPS)</li>
                <li>Secure authentication systems</li>
                <li>Password hashing</li>
                <li>Access controls</li>
                <li>Security monitoring</li>
              </ul>
              <p className="mt-3 text-xs md:text-sm text-black/50">
                However, no system can guarantee absolute security.
              </p>
            </section>

            {/* 7. Data Retention */}
            <section id="retention" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">7. Data Retention</h2>
              <p className="mb-3">We retain information for as long as necessary to provide our services, maintain platform integrity, resolve disputes, and meet legal obligations.</p>
              <p>We may retain certain information after account deletion where legally required or necessary for security purposes.</p>
            </section>

            {/* 8. Your Rights */}
            <section id="rights" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">8. Your Rights</h2>
              <p className="mb-3">Depending on applicable laws, you may have the right to:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent</li>
                <li>Object to certain processing activities</li>
              </ul>
              <p>To exercise these rights, contact us using the information provided below.</p>
            </section>

            {/* 9. Account Deletion */}
            <section id="deletion" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">9. Account Deletion</h2>
              <p className="mb-3">You may request deletion of your account at any time. Upon receiving a valid deletion request:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Your profile may be removed from public visibility.</li>
                <li>Certain records may be retained for legal, fraud-prevention, and security purposes.</li>
                <li>Reviews, transaction history references, or system logs may remain where necessary for platform integrity.</li>
              </ul>
            </section>

            {/* 10. Children's Privacy */}
            <section id="children" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">10. Children&apos;s Privacy</h2>
              <p className="mb-3">upiSathi is intended for users who are at least 18 years old.</p>
              <p>We do not knowingly collect personal information from children under 18. If we become aware that such information has been collected, we will take appropriate steps to remove it.</p>
            </section>

            {/* 11. Third-Party Services */}
            <section id="third-party" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">11. Third-Party Services</h2>
              <p className="mb-3">The Platform may contain links to third-party websites or services.</p>
              <p>We are not responsible for the privacy practices of those third parties. Users should review the privacy policies of any external services they access.</p>
            </section>

            {/* 12. International Data Processing */}
            <section id="international" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">12. International Data Processing</h2>
              <p className="mb-3">Your information may be processed and stored in locations where our service providers operate.</p>
              <p>By using the Platform, you consent to such processing and storage where permitted by law.</p>
            </section>

            {/* 13. Changes to This Privacy Policy */}
            <section id="changes" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">13. Changes to This Privacy Policy</h2>
              <p className="mb-3">We may update this Privacy Policy from time to time. When significant changes occur, we may:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Update the &quot;Last Updated&quot; date</li>
                <li>Display a notice on the Platform</li>
                <li>Notify users through email or other appropriate methods</li>
              </ul>
              <p>Continued use of the Platform after changes become effective constitutes acceptance of the revised Privacy Policy.</p>
            </section>

            {/* 14. Contact Us */}
            <section id="contact" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">14. Contact Us</h2>
              <p className="mb-3">If you have questions regarding this Privacy Policy, please contact us:</p>
              <div className="flex items-center gap-2.5 font-space font-bold text-[#4A7DFF] bg-[#4A7DFF]/5 border border-[#4A7DFF]/15 px-4 py-3 rounded-2xl w-fit">
                <FiMail size={16} />
                <a href="mailto:support@upisathi.com" className="hover:underline">support@upisathi.com</a>
              </div>
            </section>

            <hr className="border-black/5" />

            {/* Disclaimer Banner Card */}
            <section className="bg-[#FF5E97]/5 border border-[#FF5E97]/15 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5E97]/10 flex items-center justify-center shrink-0">
                <FiAlertTriangle size={24} className="text-[#FF5E97]" />
              </div>
              <div className="flex-1 font-space text-xs md:text-sm text-black/75 leading-relaxed">
                <h3 className="font-extrabold text-[#9C3A27] text-base mb-1">Disclaimer</h3>
                <p className="mb-1">
                  upiSathi is a platform that connects users with one another. We do not process payments, hold money, verify currency authenticity, guarantee exchanges, or act as a financial intermediary.
                </p>
                <p className="font-extrabold text-[#9C3A27]">
                  Users are solely responsible for their interactions and transactions conducted outside the Platform.
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
