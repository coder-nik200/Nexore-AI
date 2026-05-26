// components/Footer.jsx

import {
  Zap,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Cpu,
} from "lucide-react";

export default function GlobalFooter() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full py-8 sm:py-12 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 max-w-7xl mx-auto border-t border-[#494454]/10 bg-[#0e0e0f] shrink-0 mt-auto">
      
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#d0bcff]/20 flex items-center justify-center text-[#d0bcff]">
            <Cpu size={16} />
          </div>

          <span className="font-bold text-white text-base">
            Nexora AI
          </span>
        </div>

        <p className="text-xs text-[#cbc3d7] max-w-xs leading-relaxed">
          Building the future of intelligent orchestration.
          Productivity, redefined by AI.
        </p>

        <div className="flex gap-3 mt-5">
          {[
            {
              icon: Twitter,
              href: "https://x.com/code_Bharti07",
            },
            {
              icon: Instagram,
              href: "https://www.instagram.com/wohh.nitish",
            },
            {
              icon: Linkedin,
              href: "https://www.linkedin.com/in/nitish-kumar-bharti-631a37359/",
            },
            {
              icon: Github,
              href: "https://github.com/coder-nik200",
            },
          ].map((social, i) => {
            const Icon = social.icon;

            return (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-[#494454]/20 flex items-center justify-center hover:bg-[#1b1b1d] hover:border-[#7c3aed]/30 transition-all"
              >
                <Icon
                  size={16}
                  className="text-[#cbc3d7]"
                />
              </a>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] text-[#cbc3d7]/50 font-mono">
          © 2026 Nexora AI. All rights reserved.
        </p>
      </div>

      <div>
        <h5 className="font-bold text-white text-xs mb-4">
          Product
        </h5>

        <ul className="space-y-2 text-xs text-[#cbc3d7]">
          {["Features", "Solutions", "Pricing"].map((item, i) => (
            <li key={i}>
              <a
                href="/solutions"
                onClick={scrollToTop}
                className="hover:text-[#d0bcff] transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-bold text-white text-xs mb-4">
          Company
        </h5>

        <ul className="space-y-2 text-xs text-[#cbc3d7]">
          {["About", "Careers", "Blog"].map((item, i) => (
            <li key={i}>
              <a
                href="/about"
                onClick={scrollToTop}
                className="hover:text-[#d0bcff] transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-bold text-white text-xs mb-4">
          Legal
        </h5>

        <ul className="space-y-2 text-xs text-[#cbc3d7]">
          {["Privacy", "Terms"].map((item, i) => (
            <li key={i}>
              <a
                href="/about"
                onClick={scrollToTop}
                className="hover:text-[#d0bcff] transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-bold text-white text-xs mb-4">
          Contact
        </h5>

        <ul className="space-y-2 text-xs text-[#cbc3d7]">
          {["Support", "Twitter"].map((item, i) => (
            <li key={i}>
              <a
                href="/about"
                onClick={scrollToTop}
                className="hover:text-[#d0bcff] transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}