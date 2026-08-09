import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiShield, FiMail, FiChevronRight, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function DisclaimerPage() {
  const sections = [
    { id: "nature", title: "1. Nature of the Platform" },
    { id: "no-involvement", title: "2. No Involvement in Transactions" },
    { id: "no-financial", title: "3. No Financial Services" },
    { id: "responsibility", title: "4. User Responsibility" },
    { id: "no-guarantee", title: "5. No Guarantee" },
    { id: "safety", title: "6. Safety Disclaimer" },
    { id: "fraud", title: "7. Fraud & Illegal Activity" },
    { id: "third-party", title: "8. Third-Party Links" },
    { id: "liability", title: "9. Limitation of Liability" },
    { id: "no-warranty", title: "10. No Warranty" },
    { id: "compliance", title: "11. Compliance With Laws" },
    { id: "changes", title: "12. Changes to Disclaimer" },
    { id: "contact", title: "13. Contact Us" }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip font-sans bg-[#F7F5F2] text-black">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-16 w-full">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3 text-[#4A7DFF] font-space font-extrabold text-[10px] tracking-widest uppercase">
            <FiShield size={14} />
            <span>Legal Disclaimer</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight font-sans">
            Disclaimer
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

          {/* Disclaimer Content Column */}
          <article className="lg:col-span-8 flex flex-col gap-10 text-black/70 leading-relaxed font-space text-sm md:text-base font-semibold">
            
            {/* Intro paragraph */}
            <p className="font-medium text-black/80 leading-relaxed text-base md:text-lg">
              Please read this Disclaimer carefully before using <strong>upiSathi</strong> (&quot;Platform&quot;, &quot;Service&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
            </p>
            <p className="font-medium text-black/80 leading-relaxed -mt-4">
              By accessing or using the Platform, you acknowledge that you have read, understood, and agreed to the terms outlined below.
            </p>

            <hr className="border-black/5" />

            {/* 1. Nature of the Platform */}
            <section id="nature" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">1. Nature of the Platform</h2>
              <p className="mb-4">
                upiSathi is a peer-to-peer discovery and communication platform that helps users connect with one another for UPI-to-cash and cash-to-UPI exchange opportunities.
              </p>
              <p className="mb-4">
                The Platform&apos;s sole purpose is to facilitate user discovery, communication, and coordination.
              </p>
              <div className="bg-[#4A7DFF]/5 border border-[#4A7DFF]/10 rounded-3xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-[#4A7DFF] font-space font-extrabold text-xs uppercase">
                  <FiShield size={18} />
                  <span>Platform Scope</span>
                </div>
                <p className="text-xs md:text-sm text-[#1E3A8A] font-space font-extrabold">
                  upiSathi is not a financial institution, bank, payment processor, money transmitter, escrow service, brokerage, or exchange service.
                </p>
              </div>
            </section>

            {/* 2. No Involvement in Transactions */}
            <section id="no-involvement" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">2. No Involvement in Transactions</h2>
              <p className="mb-3">upiSathi does not:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Process payments</li>
                <li>Hold funds</li>
                <li>Transfer money</li>
                <li>Verify payment completion</li>
                <li>Verify currency authenticity</li>
                <li>Guarantee transactions</li>
                <li>Participate in exchanges between users</li>
              </ul>
              <p className="font-semibold text-black/80">
                All transactions occur directly between users at their own discretion and risk.
              </p>
            </section>

            {/* 3. No Financial Services */}
            <section id="no-financial" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">3. No Financial Services</h2>
              <p className="mb-3">The information and services provided through the Platform are not intended to constitute:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Financial advice</li>
                <li>Banking services</li>
                <li>Investment advice</li>
                <li>Legal advice</li>
                <li>Tax advice</li>
                <li>Regulatory guidance</li>
              </ul>
              <p>Users should seek professional advice when necessary.</p>
            </section>

            {/* 4. User Responsibility */}
            <section id="responsibility" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">4. User Responsibility</h2>
              <p className="mb-3">Users are solely responsible for:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Verifying the identity of other users</li>
                <li>Verifying payment completion</li>
                <li>Verifying cash authenticity</li>
                <li>Confirming exchange details</li>
                <li>Selecting safe meeting locations</li>
                <li>Following applicable laws and regulations</li>
                <li>Exercising reasonable caution during all interactions</li>
              </ul>
              <p className="font-semibold text-black/80">
                All decisions regarding participation in an exchange are made entirely by the users involved.
              </p>
            </section>

            {/* 5. No Guarantee of Users or Transactions */}
            <section id="no-guarantee" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">5. No Guarantee of Users or Transactions</h2>
              <p className="mb-3">upiSathi does not guarantee:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>The accuracy of user profiles</li>
                <li>The authenticity of information provided by users</li>
                <li>The reliability of users</li>
                <li>The completion of exchanges</li>
                <li>The availability of users</li>
                <li>The quality of interactions</li>
                <li>The outcome of any transaction</li>
              </ul>
              <p className="font-semibold text-black/80">
                Users interact with one another entirely at their own risk.
              </p>
            </section>

            {/* 6. Safety Disclaimer */}
            <section id="safety" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">6. Safety Disclaimer</h2>
              <p className="mb-3">Although we encourage safe practices and provide safety recommendations, upiSathi cannot guarantee:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>User behavior</li>
                <li>User intentions</li>
                <li>Personal safety</li>
                <li>Meeting safety</li>
                <li>Transaction safety</li>
              </ul>
              <p>Users should always take appropriate precautions when interacting with others.</p>
            </section>

            {/* 7. Fraud and Illegal Activity */}
            <section id="fraud" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">7. Fraud and Illegal Activity</h2>
              <p className="mb-3">While we may take reasonable steps to prevent misuse of the Platform, we do not guarantee that the Platform will be free from:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Fraudulent users</li>
                <li>Misrepresentation</li>
                <li>Scams</li>
                <li>Counterfeit currency</li>
                <li>Unlawful activity</li>
              </ul>
              <p className="font-semibold text-black/80">
                Users should independently verify all information before proceeding with an exchange.
              </p>
            </section>

            {/* 8. Third-Party Content and Links */}
            <section id="third-party" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">8. Third-Party Content and Links</h2>
              <p className="mb-3">The Platform may contain links to third-party websites, services, or resources.</p>
              <p className="mb-3">upiSathi does not control or endorse third-party content and is not responsible for:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Accuracy</li>
                <li>Availability</li>
                <li>Security</li>
                <li>Privacy practices</li>
                <li>Services provided by third parties</li>
              </ul>
              <p className="text-xs md:text-sm text-black/50">
                Accessing third-party services is done at the user&apos;s own risk.
              </p>
            </section>

            {/* 9. Limitation of Liability */}
            <section id="liability" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">9. Limitation of Liability</h2>
              <p className="mb-3">To the maximum extent permitted by applicable law, upiSathi, its owners, employees, affiliates, contractors, and partners shall not be liable for:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>User disputes</li>
                <li>Failed transactions</li>
                <li>Payment issues</li>
                <li>Counterfeit currency</li>
                <li>Fraudulent activity</li>
                <li>Personal injury</li>
                <li>Property damage</li>
                <li>Financial loss</li>
                <li>Lost profits</li>
                <li>Data loss</li>
                <li>Indirect, incidental, special, or consequential damages</li>
              </ul>
              <p className="font-semibold text-black/85">
                arising from the use of, or inability to use, the Platform.
              </p>
            </section>

            {/* 10. No Warranty */}
            <section id="no-warranty" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">10. No Warranty</h2>
              <p className="mb-3">The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.</p>
              <p className="mb-3">We make no warranties, express or implied, regarding:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mb-3">
                <li>Availability</li>
                <li>Reliability</li>
                <li>Accuracy</li>
                <li>Security</li>
                <li>Suitability for a particular purpose</li>
                <li>Continuous operation</li>
              </ul>
              <p className="font-semibold text-black/85">
                Use of the Platform is entirely at your own risk.
              </p>
            </section>

            {/* 11. Compliance With Laws */}
            <section id="compliance" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">11. Compliance With Laws</h2>
              <p className="mb-3">Users are responsible for ensuring that their activities on and off the Platform comply with all applicable local, state, national, and international laws.</p>
              <p>upiSathi does not guarantee that any specific transaction, exchange, or user activity is lawful in every jurisdiction.</p>
            </section>

            {/* 12. Changes to This Disclaimer */}
            <section id="changes" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">12. Changes to This Disclaimer</h2>
              <p className="mb-3">We may update this Disclaimer from time to time. Any changes will become effective when posted on the Platform.</p>
              <p>Continued use of the Platform after such updates constitutes acceptance of the revised Disclaimer.</p>
            </section>

            {/* 13. Contact Us */}
            <section id="contact" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-black mb-3 font-sans">13. Contact Us</h2>
              <p className="mb-3">For questions regarding this Disclaimer, please contact:</p>
              <div className="flex items-center gap-2.5 font-space font-bold text-[#4A7DFF] bg-[#4A7DFF]/5 border border-[#4A7DFF]/15 px-4 py-3 rounded-2xl w-fit">
                <FiMail size={16} />
                <a href="mailto:support@upisathi.com" className="hover:underline">support@upisathi.com</a>
              </div>
            </section>

            <hr className="border-black/5" />

            {/* Acknowledgment Card */}
            <section className="bg-[#10B981]/5 border border-[#10B981]/15 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 flex items-center justify-center shrink-0">
                <FiCheckCircle size={24} className="text-[#10B981]" />
              </div>
              <div className="flex-1 font-space text-xs md:text-sm text-black/75 leading-relaxed">
                <h3 className="font-extrabold text-[#065F46] text-base mb-1">Acknowledgment</h3>
                <p className="mb-3">
                  By using upiSathi, you acknowledge and agree that:
                </p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>upiSathi is a discovery platform only.</li>
                  <li>upiSathi is not involved in financial transactions.</li>
                  <li>All exchanges occur directly between users.</li>
                  <li>You assume full responsibility for your interactions, meetings, and transactions.</li>
                  <li>You use the Platform at your own risk.</li>
                </ul>
              </div>
            </section>

          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}
