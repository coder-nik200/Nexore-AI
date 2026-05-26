import React from 'react';

import {
  ArrowRight,
  Play,
  CheckCircle,
  ExternalLink,
  Globe,
  Mail,
  Twitter,
  Instagram,
  Linkedin,
  Github,
} from 'lucide-react';

import { Link } from 'react-router-dom';
import Footer from './Footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  React.useEffect(() => {
    // Subtle mouse tracking glow effect for the hero
    const handleMouseMove = (e: MouseEvent) => {
      const glow = document.querySelector('.hero-glow') as HTMLElement;
      if (glow) {
        const x = (e.clientX / window.innerWidth - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        glow.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#e5e2e3]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-[#131314]/10 backdrop-blur-md border-b border-[#494454]/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6d3bd7] to-[#3131c0] flex items-center justify-center">
            <span className="font-bold text-white text-base">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexora AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a className="text-[#d0bcff] font-medium hover:text-white transition-colors" href="#features">Features</a>
          <Link
            to="/solutions"
            className="text-[#cbc3d7] hover:text-white transition-colors"
          >
            Solutions
          </Link>
          <a className="text-[#cbc3d7] hover:text-white transition-colors" href="#pricing">Pricing</a>
          <Link
            to="/about"
            className="text-[#cbc3d7] hover:text-white transition-colors"
          >
            About
          </Link>
        </div>
        <button
          onClick={onGetStarted}
          className="primary-button px-6 py-2 rounded-xl text-white font-medium hover:opacity-90 active:scale-95 transition-transform text-sm cursor-pointer"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 flex flex-col items-center text-center max-w-5xl mx-auto overflow-visible">
        <div className="hero-glow"></div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d0bcff]/10 border border-[#d0bcff]/20 mb-8">
          <span className="text-[12px] font-mono tracking-widest text-[#d0bcff] uppercase">v2.0 is live</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none mb-6 text-white max-w-4xl">
          Automate your workflow with the power of <span className="gradient-text">Intelligence</span>.
        </h1>
        <p className="text-lg md:text-xl text-[#cbc3d7] max-w-3xl mb-10 leading-relaxed font-light">
          Nexora AI helps teams manage tasks, automate workflows, and generate content in one seamless workspace. Experience the next generation of productivity.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
          <button
            onClick={onGetStarted}
            className="primary-button px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg shadow-[#d0bcff]/15 hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
          >
            Start for free <ArrowRight size={18} />
          </button>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-xl border border-[#494454] text-white font-semibold text-lg glass-card hover:bg-[#353436]/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play size={20} className="fill-current text-[#d0bcff]" />
            Watch Demo
          </button>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="mt-16 w-full rounded-2xl overflow-hidden glass-card p-2 relative group cursor-pointer z-10" onClick={onGetStarted}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity z-10 flex items-center justify-center">
            <span className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold border border-white/20 shadow-xl scale-75 group-hover:scale-100 transition-all">Launch Nexora AI Developer Sandbox</span>
          </div>
          <img
            alt="Nexora Dashboard Preview"
            className="w-full h-auto rounded-xl border border-[#494454]/20 shadow-2xl block"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBWqTn6XFaOvhlghieIUJiTxz-5zZPyXs2zhjKVDrLblYv-cYguEJEPLQmt2c6Vkm-6Kde7yAUa31Bs-OgB1iYZN4V9ByxnMC2Xwz2lgGfATsc8rJtdWHoZuwuRxo3A77LKQsift2t7PVXKoicIoIDPdNC0lFromgFAyimgwyMeZ_mRR-_-ej3wvZcs9WjyW3gYSDpN4KY0y0G5fDhXV2LDhQrozfqfSrX-uXwwjO07TANFPlrX5ADiNCsK2mAJWip_mPyjFP3wHr0"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Marquee Ticker */}
      <section className="py-12 border-y border-[#494454]/10 overflow-hidden bg-[#0e0e0f]">
        <p className="text-center text-xs tracking-widest text-[#958ea0] mb-8 font-mono uppercase">Trusted by industry leaders</p>
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-16 px-8 select-none animate-marquee text-[#cbc3d7]">
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">QUANTUM</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">SYNERGY</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">NEXUS</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">VERTEX</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">VELOCITY</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">AURORA</span>
          </div>
          <div className="flex items-center gap-16 px-8 select-none animate-marquee text-[#cbc3d7]" aria-hidden="true">
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">QUANTUM</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">SYNERGY</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">NEXUS</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">VERTEX</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">VELOCITY</span>
            <span className="text-xl md:text-2xl font-bold tracking-tighter opacity-40">AURORA</span>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="features">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Precision Engineering for Modern Teams</h2>
          <p className="text-[#cbc3d7] max-w-xl mx-auto font-light text-base">Our AI-driven modules are designed to handle complexity so you can focus on creative velocity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#d0bcff]/10 flex items-center justify-center text-[#d0bcff]">
              <span className="text-xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-white">AI Workflow Automation</h3>
            <p className="text-sm text-[#cbc3d7] leading-relaxed">Intelligent triggers that learn your habits and automate repetitive tasks across all your favorite tools.</p>
            <div className="mt-4 w-full h-48 bg-[#201f20] rounded-xl overflow-hidden border border-[#494454]/10 relative group">
              <img
                alt="Automation Illustration"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdoClTOwOhfXSzenGGgI1IKaWal7NhdiK7V0i3OEiYIOBeYI9iydyzBOyL3_8Xdd-RCXbu7yNoeBIdC26vw8689Esvl451vKVaxihE5WEULM4F_KFPaPWbDG7VT-258U_sSlqycPSM_DbB0NSQjzpR9j16wcdoq5if6Umck8uaZipU7jUcTZuFcIfSv1dozW6WZ131bwyEsXxga1XyCSFDII3h-fH16Tf4NwZPRaGE-o_6DbPqVJgyaVJUQxj0Atgv1yh8OQqw6Sk3"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-white">Smart Task Management</h3>
            <p className="text-sm text-[#cbc3d7] leading-relaxed">Nexora prioritizes your tasks based on deadlines, effort, and team velocity using advanced models.</p>
            <div className="mt-4 w-full h-48 bg-[#201f20] rounded-xl overflow-hidden border border-[#494454]/10 relative group">
              <img
                alt="Task Management Illustration"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPkLUpe80FNl1yc9W7Mpy6s1umFCtWigxpK6q3xq0F3Gey4Wg-jxm_O4MXi8EajkjZIN_V4JfafmM_PdHmHKYq9CfsyGgmc_nUO9o4sdI7FN9wY0626h45EUyl1wVBuoemOjP3Hzmjh5SzW7EC5uQb5wOb2jbQbxgql8-oRcJJK8XamLbxa7b_XAN222Kxi4ixncKPTWE-w8PZoxiK7QPGxdnACQFTWZ2APCLxjLGdX4oAhyTCmwrdTyvAVYq30s2G4cxyDAWlWGuu"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffb869]/10 flex items-center justify-center text-[#ffb869]">
              <span className="text-xl">📈</span>
            </div>
            <h3 className="text-xl font-bold text-white">Predictive Analytics</h3>
            <p className="text-sm text-[#cbc3d7] leading-relaxed">Stay three steps ahead with analytics that predict bottlenecks before they even happen in your pipeline.</p>
            <div className="mt-4 w-full h-48 bg-[#201f20] rounded-xl overflow-hidden border border-[#494454]/10 relative group">
              <img
                alt="Analytics Illustration"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD36ZIOQnkuZU_JBbw5_j2-3skEizGedo-Qu31IXAsK7wjrWT7_9LpA9D4uzSvScJnhOUWBk9heQKTaWvm7sTypKRztNvLbOdfqCnwe352Vxx9cC2AI2ZcsQBEczG_KeQDR16sCuX1XNm21mNfFg9zl5Y85W-8JG19HwwQDesmRXU_FHtDjiEF023HP_I5loPaZgcnlB7OZWSqv6-NRrdeOvW9H7pjODhS8T84N2OjmvEYg4f40IKwIBfS-3Z9v7iFEQ-gXe1Q2Ury8"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Pricing Section */}
      <section className="py-24 px-6 bg-[#0e0e0f] relative overflow-hidden" id="pricing">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(109,59,215,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Scalable Plans for Scaling Teams</h2>
          <p className="text-[#cbc3d7] max-w-xl mx-auto font-light text-base">Choose the tier that matches your current momentum.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {/* Individual */}
          <div className="glass-card p-10 rounded-2xl flex flex-col h-full border border-[#494454]/10">
            <div className="mb-8">
              <h4 className="text-xs font-mono tracking-widest text-[#958ea0] uppercase mb-2">Individual</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-[#cbc3d7] text-sm">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow text-sm">
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Up to 3 projects</span>
              </li>
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Basic AI assistance</span>
              </li>
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Community support</span>
              </li>
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 rounded-xl border border-[#494454] text-white font-medium hover:bg-[#353436] transition-all cursor-pointer text-sm"
            >
              Get Started
            </button>
          </div>

          {/* Professional */}
          <div className="glass-card p-10 rounded-2xl flex flex-col h-full border-[#d0bcff]/40 relative transform md:scale-105 shadow-2xl shadow-[#d0bcff]/5">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#d0bcff] text-[#3c0091] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight shadow">
              Most Popular
            </div>
            <div className="mb-8">
              <h4 className="text-xs font-mono tracking-widest text-[#d0bcff] uppercase mb-2">Professional</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$24</span>
                <span className="text-[#cbc3d7] text-sm">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow text-sm">
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Advanced AI automation</span>
              </li>
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Priority email support</span>
              </li>
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Analytics dashboard</span>
              </li>
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 rounded-xl primary-button text-white font-bold transition-all cursor-pointer text-sm shadow shadow-[#6d3bd7]/20"
            >
              Choose Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="glass-card p-10 rounded-2xl flex flex-col h-full border border-[#494454]/10">
            <div className="mb-8">
              <h4 className="text-xs font-mono tracking-widest text-[#958ea0] uppercase mb-2">Enterprise</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">Custom</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow text-sm">
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Bespoke AI training</span>
              </li>
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Dedicated success manager</span>
              </li>
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>SSO & Enterprise security</span>
              </li>
              <li className="flex items-center gap-3 text-[#cbc3d7]">
                <CheckCircle size={16} className="text-[#d0bcff]" />
                <span>Unlimited seats</span>
              </li>
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 rounded-xl border border-[#494454] text-white font-medium hover:bg-[#353436] transition-all cursor-pointer text-sm"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Brand CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-[2rem] p-12 text-center relative overflow-hidden border border-[#d0bcff]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d0bcff]/5 to-[#c0c1ff]/5 pointer-events-none"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Ready to transform your productivity?</h2>
          <p className="text-[#cbc3d7] mb-10 max-w-xl mx-auto leading-relaxed">Join over 10,000 teams who trust Nexora AI to handle their complex workflows.</p>
          <button
            onClick={onGetStarted}
            className="primary-button px-12 py-5 rounded-2xl text-white font-bold text-xl shadow-xl shadow-[#d0bcff]/20 hover:scale-[1.03] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Start for free <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
