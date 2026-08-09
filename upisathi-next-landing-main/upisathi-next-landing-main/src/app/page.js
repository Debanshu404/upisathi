import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Comparison from "@/components/Comparison";
import Safety from "@/components/Safety";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip font-sans bg-[#F7F5F2] text-black">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Comparison />
        <Safety />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
