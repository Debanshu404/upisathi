import "./globals.css";

export const metadata = {
  title: "UpiSathi — P2P Cash & UPI Exchange",
  description: "Need cash? Find someone who needs UPI. Post a request, browse active listings, chat with users, and coordinate your peer-to-peer exchange directly.",
  keywords: ["UPI", "Cash", "Peer-to-peer exchange", "Cash to UPI", "UPI to Cash", "UpiSathi", "India peer-to-peer cash exchange"],
  authors: [{ name: "UpiSathi Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="min-h-screen flex flex-col bg-[#F7F5F2] text-[#000000] font-sans selection:bg-[#4A7DFF]/25">
        {children}
      </body>
    </html>
  );
}
