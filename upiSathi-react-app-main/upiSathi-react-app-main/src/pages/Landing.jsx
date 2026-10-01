import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Banknote, 
  Smartphone, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Zap, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Store, 
  Fuel, 
  Coffee, 
  HelpCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { userContext } from '../context/UserContext';
import ThemeToggle from '../components/ThemeToggle';
import P2PExchangeVisual from '../components/P2PExchangeVisual';

function Landing() {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const scenarios = [
    {
      title: "The Betel & Chai Stall",
      tag: "Cash-Only Vendor",
      color: "bg-[#ffd7f0]", // Petal Pink
      textColor: "text-[#111111]",
      icon: <Coffee size={24} className="text-[#111111]" />,
      problem: "You're at a local paan or chai stall that doesn't accept QR codes or digital payments. You have ₹50,000 in your bank account, but zero coins or rupee notes in your wallet.",
      solution: "Open UPI Sathi. Find a student or office worker standing 20 meters away. Hand them ₹100 via PhonePe or Google Pay, and take physical cash notes from them instantly."
    },
    {
      title: "The Auto Rickshaw Ride",
      tag: "Digital-Only / Zero Change",
      color: "bg-[#b7efb2]", // Mint Green
      textColor: "text-[#111111]",
      icon: <Store size={24} className="text-[#111111]" />,
      problem: "Your auto driver demands exact cash or their QR scanner has no network signal. You are in a rush to catch a train or meeting.",
      solution: "Match with someone waiting at the same junction. Swap ₹200 cash for UPI in 30 seconds. No awkward begging, no waiting in ATM queues."
    },
    {
      title: "The Reverse: Cash In Pocket, Need UPI",
      tag: "Online Booking / Urgent Bill",
      color: "bg-[#ffef99]", // Canary Yellow
      textColor: "text-[#111111]",
      icon: <Smartphone size={24} className="text-[#111111]" />,
      problem: "You are holding physical cash notes, but you urgently need to pay an electricity bill, book a train ticket, or send money to family via UPI.",
      solution: "Post a 'Need UPI' request. Hand physical currency to a nearby neighbor, and they immediately transfer the amount to your UPI VPA."
    },
    {
      title: "Highway Dhabas & Petrol Stations",
      tag: "Server Down / Network Failure",
      color: "bg-[#e2ddfd]", // Soft Violet
      textColor: "text-[#111111]",
      icon: <Fuel size={24} className="text-[#111111]" />,
      problem: "A roadside petrol pump's card machine is offline, and bank UPI servers are failing on your SIM network.",
      solution: "Trade with fellow travelers who have different telecom carriers or cash on hand. Verify face-to-face on the spot."
    },
    {
      title: "The Empty ATM Crisis",
      tag: "Broken Machine / Dry Dispenser",
      color: "bg-[#99fff9]", // Aqua
      textColor: "text-[#111111]",
      icon: <Banknote size={24} className="text-[#111111]" />,
      problem: "You visit three bank ATMs in a row; all three are out of cash or displaying 'Temporarily Out of Service'.",
      solution: "Skip the ATM hunt. People living right in your neighborhood have cash they want to deposit. Swap directly without bank surcharge fees."
    }
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#161514] text-[#111111] dark:text-white transition-colors duration-300 selection:bg-[#e8400d] selection:text-white font-sans">
      
      {/* ─── STICKY HEADER ─── */}
      <header className="sticky top-0 z-50 bg-[#ffffff]/90 dark:bg-[#161514]/90 backdrop-blur-md border-b border-[#111111]/[0.06] dark:border-white/[0.08] transition-colors">
        <div className="max-w-[1200px] mx-auto h-[64px] px-4 sm:px-8 flex items-center justify-between">
          {/* Logo Lockup */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#e8400d] flex items-center justify-center text-white shadow-sm">
              <ArrowLeftRight size={17} className="stroke-[2.5]" />
            </div>
            <div className="leading-none">
              <span className="text-xl font-bold tracking-tight text-[#111111] dark:text-white">
                UPI<span className="text-[#e8400d]">Sathi</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[0.03em] text-[#6d6c6b] dark:text-[#b1b1af] font-medium mt-0.5">
                PeerSync Network
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-normal text-[#111111]/80 dark:text-white/80">
            <a href="#vision" className="hover:text-[#e8400d] transition-colors">The Vision</a>
            <a href="#scenarios" className="hover:text-[#e8400d] transition-colors">Everyday Scenarios</a>
            <a href="#how-it-works" className="hover:text-[#e8400d] transition-colors">How It Works</a>
            <a href="#safety" className="hover:text-[#e8400d] transition-colors">Trust & Safety</a>
            <a href="#faq" className="hover:text-[#e8400d] transition-colors">FAQ</a>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {user ? (
              <button
                onClick={() => navigate('/')}
                className="ample-ink-btn flex items-center space-x-2 text-sm"
              >
                <span>Open App</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block px-3.5 py-2 text-sm text-[#111111] dark:text-white hover:text-[#e8400d] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="ample-ink-btn flex items-center space-x-1.5 text-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION (Amplemarket Radial Atmosphere) ─── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Soft radial background wash (Phoenix orange -> Cream -> Violet) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 -z-10"
          style={{
            background: 'radial-gradient(120% 80% at 50% -10%, #e8400d 0%, #ffeed8 35%, #d0b2ff 75%, transparent 100%)'
          }}
        />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* White Pill Eyebrow */}
            <div className="inline-flex items-center space-x-2 bg-white dark:bg-[#272625] border border-[#111111]/[0.08] dark:border-white/10 rounded-full px-3.5 py-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#e8400d] animate-pulse"></span>
              <span className="text-[11px] font-medium tracking-[0.03em] uppercase text-[#111111] dark:text-white">
                Decentralized Community Money Swap
              </span>
            </div>

            {/* Poster Display Headline with negative tracking */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-[-0.05em] leading-[0.95] text-[#111111] dark:text-white">
              STUCK AT A CASH-ONLY SHOP? <br className="hidden sm:inline" />
              <span className="font-black text-[#e8400d]">SWAP CASH FOR UPI</span> INSTANTLY.
            </h1>

            {/* Calm Subheading */}
            <p className="text-base sm:text-xl font-normal text-[#6d6c6b] dark:text-[#b1b1af] leading-relaxed max-w-2xl mx-auto">
              Never get stranded at a betel stall, auto rickshaw, or dry ATM again. Connect with verified people 50 meters away and exchange physical currency for digital bank transfer with <strong>zero platform fees</strong>.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate(user ? '/' : '/register')}
                className="w-full sm:w-auto ample-ink-btn px-6 py-3.5 text-base flex items-center justify-center space-x-2"
              >
                <span>{user ? 'Open Dashboard' : 'Start Swapping Nearby'}</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => navigate('/find-requests')}
                className="w-full sm:w-auto ample-outline-btn px-6 py-3.5 text-base flex items-center justify-center space-x-2"
              >
                <span>Help Someone Nearby</span>
                <Users size={17} />
              </button>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-[#6d6c6b] dark:text-[#b1b1af] font-medium">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck size={16} className="text-[#e8400d]" />
                <span>100% In-Person Verified</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Zap size={16} className="text-[#e8400d]" />
                <span>Under 3 Mins Meetup</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 size={16} className="text-[#e8400d]" />
                <span>₹0 Platform Fee</span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Frame */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="bg-[#f6f5f3] dark:bg-[#272625] border border-[#111111]/[0.08] dark:border-white/10 rounded-[12px] p-4 sm:p-8">
              <div className="text-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.03em] text-[#6d6c6b] dark:text-[#b1b1af]">
                  Live Visual Demonstration
                </span>
                <h3 className="text-lg font-normal text-[#111111] dark:text-white mt-1">
                  How a 20-second exchange takes place in your neighborhood
                </h3>
              </div>
              <P2PExchangeVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE VISION & PROBLEM STATEMENT ─── */}
      <section id="vision" className="py-20 border-t border-[#111111]/[0.06] dark:border-white/[0.08] bg-[#f6f5f3] dark:bg-[#1a1918] transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.03em] text-[#e8400d]">
              The Core Problem
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.04em] text-[#111111] dark:text-white mt-2 leading-[1.05]">
              India has 500 million UPI users. Yet cash friction happens every single day.
            </h2>
            <p className="text-base sm:text-lg text-[#6d6c6b] dark:text-[#b1b1af] font-normal mt-4 leading-relaxed">
              We live in a world where you have lakhs in your bank account, but you cannot buy a ₹10 bottle of water or a ₹20 cup of tea because the stall has no scanner. Or you have a 500-rupee paper note, but need to book an urgent train ticket online.
            </p>
          </div>

          {/* 3 Pillars of Vision */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#ffffff] dark:bg-[#272625] rounded-[12px] p-6 border border-[#111111]/[0.06] dark:border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#ffd7f0] flex items-center justify-center text-[#111111]">
                <Coffee size={20} />
              </div>
              <h3 className="text-xl font-normal text-[#111111] dark:text-white">Eliminate Awkward Begging</h3>
              <p className="text-sm text-[#6d6c6b] dark:text-[#b1b1af] leading-relaxed">
                No more asking strangers, <em>"Bhaiya, can you please Google Pay me cash?"</em>. UPI Sathi turns awkward favors into an everyday, organized, mutually beneficial community network.
              </p>
            </div>

            <div className="bg-[#ffffff] dark:bg-[#272625] rounded-[12px] p-6 border border-[#111111]/[0.06] dark:border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#b7efb2] flex items-center justify-center text-[#111111]">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-xl font-normal text-[#111111] dark:text-white">Zero Escrow Risk</h3>
              <p className="text-sm text-[#6d6c6b] dark:text-[#b1b1af] leading-relaxed">
                You never deposit money into our platform. The cash is handed physically into your hand, and the UPI is sent directly to your bank account via your official banking app.
              </p>
            </div>

            <div className="bg-[#ffffff] dark:bg-[#272625] rounded-[12px] p-6 border border-[#111111]/[0.06] dark:border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#ffef99] flex items-center justify-center text-[#111111]">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-normal text-[#111111] dark:text-white">Real-Time Proximity Sockets</h3>
              <p className="text-sm text-[#6d6c6b] dark:text-[#b1b1af] leading-relaxed">
                Powered by low-latency Socket.io events. When you post a request, anyone within 500 meters gets an instant ping on their screen without refreshing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EVERYDAY SCENARIOS (Amplemarket Multi-Hue Pastel Tiles) ─── */}
      <section id="scenarios" className="py-20 bg-[#ffffff] dark:bg-[#161514] transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.03em] text-[#e8400d]">
              Real-World Taxonomy
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.04em] text-[#111111] dark:text-white">
              Everyday situations solved in seconds.
            </h2>
            <p className="text-sm sm:text-base text-[#6d6c6b] dark:text-[#b1b1af]">
              Color-coded scenarios where UPI Sathi gets you out of sticky payment situations.
            </p>
          </div>

          {/* Pastel Taxonomy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenarios.map((sc, index) => (
              <div
                key={sc.title}
                className={`${sc.color} ${sc.textColor} ample-pastel-tile flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.03em] bg-black/10 px-2 py-0.5 rounded-[4px]">
                      {sc.tag}
                    </span>
                    {sc.icon}
                  </div>
                  <h3 className="text-2xl font-normal tracking-[-0.02em] leading-tight">
                    {sc.title}
                  </h3>
                  <div className="pt-2">
                    <div className="text-[11px] font-bold uppercase text-black/60 tracking-wider">The Dilemma</div>
                    <p className="text-xs text-black/80 mt-0.5 leading-relaxed font-normal">
                      {sc.problem}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/10">
                  <div className="text-[11px] font-bold uppercase text-black/60 tracking-wider">How UPI Sathi Solves It</div>
                  <p className="text-xs text-black/90 font-medium mt-0.5 leading-relaxed">
                    {sc.solution}
                  </p>
                </div>
              </div>
            ))}

            {/* 6th Card: Your Turn */}
            <div className="bg-[#111111] text-white rounded-[12px] p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.03em] text-[#e8400d]">
                  Ready to Try?
                </span>
                <h3 className="text-2xl font-normal tracking-[-0.02em]">
                  Have a similar situation right now?
                </h3>
                <p className="text-xs text-[#b1b1af] leading-relaxed">
                  Join hundreds of verified locals in your city who swap cash & UPI daily. No credit cards, no KYC, no waiting.
                </p>
              </div>

              <button
                onClick={() => navigate('/create-request')}
                className="w-full py-3 bg-[#e8400d] hover:bg-[#d03709] text-white font-medium text-xs rounded-[8px] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Post Your Request</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (Restrained 3 Steps) ─── */}
      <section id="how-it-works" className="py-20 bg-[#f6f5f3] dark:bg-[#1a1918] border-t border-[#111111]/[0.06] dark:border-white/[0.08] transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.03em] text-[#e8400d]">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.04em] text-[#111111] dark:text-white">
              Three steps. Done in 3 minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white dark:bg-[#272625] border border-[#111111]/[0.06] dark:border-white/10 rounded-[12px] p-6 space-y-3">
              <span className="text-3xl font-black text-[#e8400d]">01</span>
              <h3 className="text-xl font-normal text-[#111111] dark:text-white">Post or Browse</h3>
              <p className="text-sm text-[#6d6c6b] dark:text-[#b1b1af] leading-relaxed">
                Choose whether you need Cash or UPI, enter the amount (₹100 to ₹5,000), and let our GPS radius broadcast to nearby peers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-[#272625] border border-[#111111]/[0.06] dark:border-white/10 rounded-[12px] p-6 space-y-3">
              <span className="text-3xl font-black text-[#e8400d]">02</span>
              <h3 className="text-xl font-normal text-[#111111] dark:text-white">Match & Coordinate</h3>
              <p className="text-sm text-[#6d6c6b] dark:text-[#b1b1af] leading-relaxed">
                A nearby user accepts your offer. You enter an instant, private chat to pick a crowded public spot (like a metro gate or coffee shop).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-[#272625] border border-[#111111]/[0.06] dark:border-white/10 rounded-[12px] p-6 space-y-3">
              <span className="text-3xl font-black text-[#e8400d]">03</span>
              <h3 className="text-xl font-normal text-[#111111] dark:text-white">Verify & Mark Done</h3>
              <p className="text-sm text-[#6d6c6b] dark:text-[#b1b1af] leading-relaxed">
                Meet up, count physical notes, verify the UPI transaction on your banking app, and both tap 'Mark Done' to record your trust score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DARK SECTION PANEL (Amplemarket Charcoal #272625 / Midnight Indigo) ─── */}
      <section id="safety" className="py-24 bg-[#272625] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.03em] text-[#e8400d]">
                Trust & Verification
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.04em] leading-[1.05]">
                Built for safe, public, peer-to-peer handovers.
              </h2>
              <p className="text-base text-[#b1b1af] font-normal leading-relaxed">
                Safety isn't an afterthought. We've built multiple safety layers to ensure every transaction is completely legitimate and stress-free.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-[8px] bg-[#e8400d] flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Crowded Public Meeting Spots Only</h4>
                    <p className="text-xs text-[#b1b1af] mt-0.5">Always coordinate in well-lit public places like metro stations, mall lobbies, or bank branches.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-[8px] bg-[#e8400d] flex items-center justify-center shrink-0">
                    <Star size={16} className="text-white fill-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Community Trust Scores & Reviews</h4>
                    <p className="text-xs text-[#b1b1af] mt-0.5">Every user builds a public 1 to 5 star rating. Review partner profiles and completed swap counts before accepting.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-[8px] bg-[#e8400d] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Double Confirmation Completion</h4>
                    <p className="text-xs text-[#b1b1af] mt-0.5">A swap is only finalized when both people confirm receipt on their respective phones.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial / Community Card in Charcoal */}
            <div className="lg:col-span-6 bg-[#161514] border border-white/10 rounded-[12px] p-6 sm:p-8 space-y-6">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400" />
                ))}
              </div>
              <blockquote className="text-base sm:text-lg text-white font-normal leading-relaxed italic">
                "I was at a small tea stall in Koramangala. The vendor's PhonePe QR was damaged, and I had zero cash for my ₹40 breakfast. I posted on UPI Sathi and a software engineer standing right beside me gave me a ₹50 note while I sent him ₹50 on UPI. Saved me so much embarrassment!"
              </blockquote>
              <div className="flex items-center space-x-3 border-t border-white/10 pt-4">
                <div className="w-10 h-10 rounded-full bg-[#e8400d] text-white font-bold text-sm flex items-center justify-center">
                  A
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Aditya Verma</div>
                  <div className="text-xs text-[#b1b1af]">Bangalore • 18 verified swaps</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS ─── */}
      <section id="faq" className="py-20 bg-[#ffffff] dark:bg-[#161514] transition-colors">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.03em] text-[#e8400d]">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-[#111111] dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="border border-[#111111]/[0.08] dark:border-white/10 rounded-[12px] p-5 bg-[#f6f5f3] dark:bg-[#272625]">
              <h4 className="text-base font-bold text-[#111111] dark:text-white">Is peer-to-peer cash exchange legal in India?</h4>
              <p className="text-xs sm:text-sm text-[#6d6c6b] dark:text-[#b1b1af] mt-2 leading-relaxed font-normal">
                Yes. Exchanging physical cash for digital bank money of equal value with zero commission is a direct peer barter and private mutual exchange. It is completely legal and common in everyday life.
              </p>
            </div>

            <div className="border border-[#111111]/[0.08] dark:border-white/10 rounded-[12px] p-5 bg-[#f6f5f3] dark:bg-[#272625]">
              <h4 className="text-base font-bold text-[#111111] dark:text-white">Does UPI Sathi charge any convenience fee or commission?</h4>
              <p className="text-xs sm:text-sm text-[#6d6c6b] dark:text-[#b1b1af] mt-2 leading-relaxed font-normal">
                No. UPI Sathi is 100% free and community-powered. You swap ₹500 cash for ₹500 UPI. Zero deductions.
              </p>
            </div>

            <div className="border border-[#111111]/[0.08] dark:border-white/10 rounded-[12px] p-5 bg-[#f6f5f3] dark:bg-[#272625]">
              <h4 className="text-base font-bold text-[#111111] dark:text-white">What if the person doesn't show up after matching?</h4>
              <p className="text-xs sm:text-sm text-[#6d6c6b] dark:text-[#b1b1af] mt-2 leading-relaxed font-normal">
                You can easily cancel the swap anytime before handing over funds. Because no money is locked in escrow, you never lose anything. Unresponsive users can be reported and lose their trust rating.
              </p>
            </div>

            <div className="border border-[#111111]/[0.08] dark:border-white/10 rounded-[12px] p-5 bg-[#f6f5f3] dark:bg-[#272625]">
              <h4 className="text-base font-bold text-[#111111] dark:text-white">How do I verify the transfer?</h4>
              <p className="text-xs sm:text-sm text-[#6d6c6b] dark:text-[#b1b1af] mt-2 leading-relaxed font-normal">
                When swapping in person, watch the person scan your QR code and verify the received SMS / push notification in your bank app before walking away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA BANNER ─── */}
      <section className="py-20 bg-[#f6f5f3] dark:bg-[#1a1918] border-t border-[#111111]/[0.06] dark:border-white/10 transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.04em] text-[#111111] dark:text-white">
            Ready to experience frictionless neighborhood cash?
          </h2>
          <p className="text-base text-[#6d6c6b] dark:text-[#b1b1af] max-w-xl mx-auto font-normal">
            Join thousands of neighbors exchanging cash and UPI safely every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(user ? '/' : '/register')}
              className="w-full sm:w-auto ample-ink-btn px-8 py-4 text-base flex items-center justify-center space-x-2"
            >
              <span>{user ? 'Go to Your Dashboard' : 'Create Free Account'}</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => navigate('/find-requests')}
              className="w-full sm:w-auto ample-outline-btn px-8 py-4 text-base"
            >
              <span>Explore Active Swaps</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER (Amplemarket Charcoal #272625) ─── */}
      <footer className="bg-[#111111] text-[#b1b1af] py-12 border-t border-white/10 text-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-[6px] bg-[#e8400d] flex items-center justify-center text-white font-bold text-xs">
              <ArrowLeftRight size={14} />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              UPI<span className="text-[#e8400d]">Sathi</span>
            </span>
            <span className="text-[10px] text-[#6d6c6b] pl-2 border-l border-white/10">
              © 2026 UPI Sathi (PeerSync). All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-6 text-[11px] font-medium text-white/70">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <a href="#safety" className="hover:text-white transition-colors">Safety Rules</a>
            <a href="#vision" className="hover:text-white transition-colors">Vision</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
