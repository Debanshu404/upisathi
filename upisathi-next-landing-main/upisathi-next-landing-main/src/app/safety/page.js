import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiShield, FiMail, FiChevronRight, FiAlertTriangle, FiCheckCircle, FiInfo, FiMapPin, FiMessageSquare } from 'react-icons/fi';

export default function SafetyGuidelines() {
  const sections = [
    { id: "reminder", title: "1. Important Reminder" },
    { id: "before-meet", title: "2. Before You Meet" },
    { id: "location", title: "3. Safe Meeting Locations" },
    { id: "exchange", title: "4. During the Exchange" },
    { id: "personal-info", title: "5. Personal Information" },
    { id: "warning-signs", title: "6. Warning Signs" },
    { id: "no-show", title: "7. If a User Fails to Show Up" },
    { id: "reporting", title: "8. Reporting Suspicious Activity" },
    { id: "emergency", title: "9. Emergency Situations" },
    { id: "disclaimer", title: "10. Safety Disclaimer" },
    { id: "contact", title: "11. Contact Us" }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip font-sans bg-[#F7F5F2] text-black">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-16 w-full">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3 text-[#4A7DFF] font-space font-extrabold text-[10px] tracking-widest uppercase">
            <FiShield size={14} />
            <span>Community Safety</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight font-sans">
            Safety Guidelines
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

          {/* Safety Content Column */}
          <article className="lg:col-span-8 flex flex-col gap-10 text-black/70 leading-relaxed font-space text-sm md:text-base font-semibold">
            
            {/* Intro paragraph */}
            <p className="font-medium text-black/80 leading-relaxed text-base md:text-lg">
              At <strong>upiSathi</strong>, user safety is our highest priority. While our platform helps users discover and connect with one another, all exchanges occur directly between users.
            </p>
            <p className="font-medium text-black/80 leading-relaxed -mt-4">
              Please read and follow these safety guidelines before participating in any exchange.
            </p>

            <hr className="border-black/5" />

            {/* 1. Important Reminder */}
            <section id="reminder" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">1. Important Reminder</h2>
              <p className="mb-4">
                upiSathi is a discovery and communication platform.
              </p>
              
              <div className="bg-[#4A7DFF]/5 border border-[#4A7DFF]/10 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2.5 text-[#4A7DFF] font-space font-extrabold text-sm uppercase">
                  <FiShield size={18} />
                  <span>We Do Not:</span>
                </div>
                
                <ul className="list-disc pl-5 text-xs md:text-sm text-black/75 flex flex-col gap-1.5 font-space font-semibold">
                  <li>Process payments</li>
                  <li>Hold funds</li>
                  <li>Verify cash authenticity</li>
                  <li>Guarantee transactions</li>
                  <li>Supervise in-person meetings</li>
                </ul>
                <p className="text-xs md:text-sm text-[#1E3A8A] font-space font-extrabold mt-1">
                  Users are solely responsible for their interactions and exchanges.
                </p>
              </div>
            </section>

            {/* 2. Before You Meet */}
            <section id="before-meet" className="scroll-mt-24 flex flex-col gap-6">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-sans">2. Before You Meet</h2>
              
              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider flex items-center gap-2">
                  <FiCheckCircle size={14} className="text-[#4A7DFF]" />
                  Verify Exchange Details
                </h3>
                <p className="mb-2">Before agreeing to meet:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Confirm the exchange amount.</li>
                  <li>Confirm whether the exchange is UPI-to-cash or cash-to-UPI.</li>
                  <li>Clarify any fees, if applicable.</li>
                  <li>Agree on a meeting location.</li>
                  <li>Agree on a meeting time.</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-black/50">
                  Avoid assumptions and ensure both parties clearly understand the arrangement.
                </p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider flex items-center gap-2">
                  <FiMessageSquare size={14} className="text-[#4A7DFF]" />
                  Use In-App Chat
                </h3>
                <p className="mb-2">Whenever possible:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Communicate through the upiSathi chat system.</li>
                  <li>Keep discussions related to the exchange.</li>
                  <li>Review previous messages before meeting.</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-black/50">
                  This helps reduce misunderstandings and creates a record of communication.
                </p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider flex items-center gap-2">
                  <FiInfo size={14} className="text-[#4A7DFF]" />
                  Review User Profiles
                </h3>
                <p className="mb-2">Before accepting a request:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Check ratings and reviews.</li>
                  <li>Review profile information.</li>
                  <li>Consider account activity and reputation.</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-black/50">
                  Be cautious when dealing with newly created or incomplete profiles.
                </p>
              </div>
            </section>

            {/* 3. Choosing a Safe Meeting Location */}
            <section id="location" className="scroll-mt-24 flex flex-col gap-6">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-sans">3. Choosing a Safe Meeting Location</h2>
              
              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider flex items-center gap-2">
                  <FiMapPin size={14} className="text-[#4A7DFF]" />
                  Meet in Public Places
                </h3>
                <p className="mb-2">Always choose busy public locations such as:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Shopping malls</li>
                  <li>Coffee shops</li>
                  <li>Restaurants</li>
                  <li>Metro stations</li>
                  <li>Bank branches</li>
                  <li>Public marketplaces</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-[#10B981] font-space font-semibold">
                  Public environments provide greater visibility and safety.
                </p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-[#E11D48] mb-2 tracking-wider flex items-center gap-2">
                  <FiAlertTriangle size={14} />
                  Avoid Isolated Locations
                </h3>
                <p className="mb-2">Do not meet in:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Empty parking lots</li>
                  <li>Remote streets</li>
                  <li>Private residences</li>
                  <li>Unfamiliar secluded areas</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-[#E11D48] font-space font-semibold">
                  If a user insists on meeting in an unsafe location, cancel the exchange.
                </p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider">
                  Prefer Daytime Meetings
                </h3>
                <p className="mb-2">When possible:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Schedule meetings during daylight hours.</li>
                  <li>Choose locations with security personnel or CCTV coverage.</li>
                </ul>
              </div>
            </section>

            {/* 4. During the Exchange */}
            <section id="exchange" className="scroll-mt-24 flex flex-col gap-6">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-sans">4. During the Exchange</h2>
              
              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider">
                  Verify Cash Carefully
                </h3>
                <p className="mb-2">If receiving cash:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Count the cash before completing the exchange.</li>
                  <li>Verify denominations.</li>
                  <li>Check for obvious signs of counterfeit currency.</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-black/50">
                  If anything appears suspicious, do not proceed.
                </p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-black mb-2 tracking-wider">
                  Verify UPI Payment Completion
                </h3>
                <p className="mb-2">If receiving a UPI payment:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Confirm the payment has been successfully credited.</li>
                  <li>Check your banking or payment application directly.</li>
                  <li>Do not rely solely on screenshots.</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-[#10B981] font-space font-semibold">
                  Only proceed once payment confirmation is visible in your account.
                </p>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xs uppercase text-[#E11D48] mb-2 tracking-wider flex items-center gap-2">
                  <FiAlertTriangle size={14} />
                  Do Not Rush
                </h3>
                <p className="mb-2">Fraudsters often create urgency. Be cautious if someone:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Pressures you to act quickly.</li>
                  <li>Changes terms at the last minute.</li>
                  <li>Refuses verification steps.</li>
                  <li>Insists on unusual arrangements.</li>
                </ul>
                <p className="mt-2 text-xs md:text-sm text-black/50">
                  Take your time and verify everything carefully.
                </p>
              </div>
            </section>

            {/* 5. Protect Your Personal Information */}
            <section id="personal-info" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">5. Protect Your Personal Information</h2>
              <p className="mb-3">Never share:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Bank account passwords</li>
                <li>UPI PINs</li>
                <li>OTPs (One-Time Passwords)</li>
                <li>Debit or credit card details</li>
                <li>Identity documents unless legally required</li>
                <li>Sensitive personal information</li>
              </ul>
              <div className="bg-[#FF5E97]/5 border border-[#FF5E97]/15 rounded-2xl p-4 flex gap-3 mt-4 items-start">
                <FiAlertTriangle size={18} className="text-[#FF5E97] mt-0.5 shrink-0" />
                <p className="text-xs md:text-sm text-black/75 leading-relaxed font-space font-semibold">
                  <strong>Important:</strong> No legitimate exchange requires your OTP or UPI PIN.
                </p>
              </div>
            </section>

            {/* 6. Watch for Common Warning Signs */}
            <section id="warning-signs" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">6. Watch for Common Warning Signs</h2>
              <p className="mb-3">Be cautious if a user:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Refuses to meet in public.</li>
                <li>Refuses to use chat.</li>
                <li>Requests advance payments.</li>
                <li>Sends suspicious links.</li>
                <li>Uses abusive or threatening language.</li>
                <li>Creates pressure to act immediately.</li>
                <li>Provides inconsistent information.</li>
              </ul>
              <p className="font-semibold text-black/80">
                Trust your instincts. If something feels wrong, do not proceed.
              </p>
            </section>

            {/* 7. If a User Fails to Show Up */}
            <section id="no-show" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">7. If a User Fails to Show Up</h2>
              <p className="mb-3">If the other party does not arrive:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Wait only a reasonable amount of time.</li>
                <li>Attempt communication through chat.</li>
                <li>Leave the location if you feel uncomfortable.</li>
                <li>Consider leaving an honest review when appropriate.</li>
              </ul>
            </section>

            {/* 8. Reporting Suspicious Activity */}
            <section id="reporting" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">8. Reporting Suspicious Activity</h2>
              <p className="mb-3">You should report users who:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Attempt fraud</li>
                <li>Harass others</li>
                <li>Violate platform rules</li>
                <li>Misrepresent exchange details</li>
                <li>Engage in suspicious behavior</li>
              </ul>
              <p>Reports help keep the community safer for everyone.</p>
            </section>

            {/* 9. Emergency Situations */}
            <section id="emergency" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">9. Emergency Situations</h2>
              <p className="mb-3">If you feel unsafe:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Leave the location immediately.</li>
                <li>Contact local authorities if necessary.</li>
                <li>Seek assistance from nearby security personnel or trusted individuals.</li>
              </ul>
              <p className="font-semibold text-[#E11D48] mt-3">
                Your personal safety is more important than completing any exchange.
              </p>
            </section>

            <hr className="border-black/5" />

            {/* 10. Safety Disclaimer */}
            <section id="disclaimer" className="scroll-mt-24 bg-[#FF5E97]/5 border border-[#FF5E97]/15 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5E97]/10 flex items-center justify-center shrink-0">
                <FiAlertTriangle size={24} className="text-[#FF5E97]" />
              </div>
              <div className="flex-1 font-space text-xs md:text-sm text-black/75 leading-relaxed">
                <h3 className="font-extrabold text-[#9C3A27] text-base mb-1">Safety Disclaimer</h3>
                <p className="mb-3">
                  While upiSathi encourages safe practices, we cannot guarantee the behavior, identity, intentions, or actions of users.
                </p>
                <p className="mb-3">
                  All interactions, meetings, and exchanges occur at the sole risk and responsibility of participating users.
                </p>
                <p className="mb-1 font-bold text-black/90">
                  Users are responsible for:
                </p>
                <ul className="list-disc pl-5 flex flex-col gap-1 mb-3">
                  <li>Verifying identities</li>
                  <li>Verifying payment completion</li>
                  <li>Verifying cash authenticity</li>
                  <li>Following local laws</li>
                  <li>Exercising reasonable caution</li>
                </ul>
                <p className="font-extrabold text-[#9C3A27]">
                  By using the Platform, you acknowledge and accept these responsibilities.
                </p>
              </div>
            </section>

            {/* 11. Contact Us */}
            <section id="contact" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">11. Contact Us</h2>
              <p className="mb-3">If you have questions or wish to report safety concerns, please contact:</p>
              <div className="flex items-center gap-2.5 font-space font-bold text-[#4A7DFF] bg-[#4A7DFF]/5 border border-[#4A7DFF]/15 px-4 py-3 rounded-2xl w-fit">
                <FiMail size={16} />
                <a href="mailto:support@upisathi.com" className="hover:underline">support@upisathi.com</a>
              </div>
            </section>

          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}
