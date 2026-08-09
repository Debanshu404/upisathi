import Image from 'next/image';

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Create Request",
      line1: "Post what you're looking for.",
      line2: "UPI → Cash or Cash → UPI.",
      image: "/message,memo,paper airplane,send,throw,game,play,woman,people.svg",
      alignRight: false
    },
    {
      id: "02",
      title: "Find Match",
      line1: "Browse active requests and",
      line2: "find matching exchanges.",
      image: "/find,binoculars,man,people,explore,discover,lost,found.svg",
      alignRight: true
    },
    {
      id: "03",
      title: "Chat & Coordinate",
      line1: "Chat in-app, discuss the details,",
      line2: "and plan your meeting.",
      image: "/chat,conversation,talk,text,message,messages,messaging,people.svg",
      alignRight: false
    },
    {
      id: "04",
      title: "Meet & Exchange",
      line1: "Meet in a safe public place and",
      line2: "complete the exchange.",
      image: "/map,gps,travel,route,destination,hitchhiking,woman,people.svg",
      alignRight: true
    }
  ];

  return (
    <section id="how-it-works" className="bg-[#F7F5F2] pt-16 pb-12 border-t border-black/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Heading Block */}
        <div className="flex flex-col items-start mb-14 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3 select-none">
            
            <span className="text-[10px] uppercase font-space font-extrabold tracking-widest text-[#4A7DFF]">
              How It Works
            </span>
            
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-black relative inline-block pb-4">
            How It Works
            <svg viewBox="0 0 300 20" fill="none" stroke="#4A7DFF" strokeWidth="4" strokeLinecap="round" className="absolute left-0 bottom-0 w-[200px] h-[12px] pointer-events-none">
              <path d="M10,10 Q150,15 290,8" />
            </svg>
          </h2>
        </div>

        {/* Staggered Column Layout Grid */}
        <div className="flex flex-col max-w-5xl mx-auto relative">
          {steps.map((step, index) => {
            const isRightStep = step.alignRight; // Steps 2 and 4 have alignRight: true
            
            if (!isRightStep) {
              // Steps 1 & 3: Image on Left (md:justify-end), Number+Text on Right (md:justify-start)
              return (
                <div 
                  key={step.id} 
                  className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-0"
                >
                  {/* Left Side: SVG Image */}
                  <div className="w-full md:w-1/2 flex justify-center md:justify-end md:pr-12">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <Image 
                        src={step.image} 
                        alt={step.title} 
                        width={160}
                        height={160}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Right Side: Number & Text */}
                  <div className="w-full md:w-1/2 flex flex-row items-center gap-5 justify-center md:justify-start md:pl-12">
                    {/* Large Number */}
                    <span className="font-space font-black text-7xl md:text-8xl text-black/[0.06] tracking-tighter leading-none select-none">
                      {step.id}
                    </span>
                    {/* Text Block */}
                    <div className="text-left font-space max-w-xs">
                      <h3 className="text-xl md:text-2xl font-bold text-black mb-1.5">{step.title}</h3>
                      <p className="text-xs md:text-sm text-black/70 font-medium leading-relaxed">
                        {step.line1}
                        <span className="block">{step.line2}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            } else {
              // Steps 2 & 4: Text+Number on Left (md:justify-end), Image on Right (md:justify-start)
              // Mobile uses flex-col-reverse so Image is still on top on mobile viewports
              return (
                <div 
                  key={step.id} 
                  className="w-full flex flex-col-reverse md:flex-row items-center gap-8 md:gap-0"
                >
                  {/* Left Side: Text & Number */}
                  <div className="w-full md:w-1/2 flex flex-row items-center gap-5 justify-center md:justify-end md:pr-12">
                    {/* Text Block */}
                    <div className="text-left md:text-right font-space max-w-xs order-2 md:order-1">
                      <h3 className="text-xl md:text-2xl font-bold text-black mb-1.5">{step.title}</h3>
                      <p className="text-xs md:text-sm text-black/70 font-medium leading-relaxed">
                        {step.line1}
                        <span className="block">{step.line2}</span>
                      </p>
                    </div>
                    {/* Large Number */}
                    <span className="font-space font-black text-7xl md:text-8xl text-black/[0.06] tracking-tighter leading-none select-none order-1 md:order-2">
                      {step.id}
                    </span>
                  </div>

                  {/* Right Side: SVG Image */}
                  <div className="w-full md:w-1/2 flex justify-center md:justify-start md:pl-12">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <Image 
                        src={step.image} 
                        alt={step.title} 
                        width={160}
                        height={160}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* Bottom Safety Charter Banner */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="bg-[#4A7DFF]/5 border border-[#4A7DFF]/10 rounded-2xl p-6 flex flex-row items-center gap-4 shadow-xs relative overflow-hidden">
            {/* Blue Shield Icon */}
            <div className="w-12 h-12 rounded-xl bg-[#4A7DFF]/10 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#4A7DFF]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            {/* Charter text */}
            <div className="flex-1 font-space text-xs md:text-sm text-black/85 leading-relaxed">
              <p>
                UpiSathi helps users discover and connect with one another.
              </p>
              <p className="font-extrabold text-black mt-0.5">
                We do not process payments, hold funds, or participate in transactions.
              </p>
            </div>

            {/* Decorative Arrow Doodle */}
            <svg width="70" height="40" viewBox="0 0 70 40" fill="none" stroke="#4A7DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden lg:block shrink-0 ml-auto mr-2">
              <path d="M 5 35 C 15 35, 20 25, 15 20 C 10 15, 20 10, 35 20 C 45 27, 52 22, 60 10" />
              <path d="M 52 12 L 60 10 L 58 18" />
              <path d="M 64 6 L 66 8" />
              <path d="M 58 4 L 59 6" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
