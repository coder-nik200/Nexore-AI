import {
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);

    // Force page to top after navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  };

  return (
    <footer className="w-full py-16 px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-7xl mx-auto border-t border-[#494454]/10 bg-[#0e0e0f]">
      <div className="col-span-2">
        <span className="text-2xl font-bold tracking-tight text-white mb-4 block">
          Nexora AI
        </span>

        <p className="text-[#cbc3d7] text-sm max-w-xs mb-6 font-light leading-relaxed">
          Building the infrastructure for the next generation of intelligent
          work.
        </p>

        <div className="flex gap-4">
          {[
            { icon: Twitter, href: "https://x.com/code_Bharti07" },
            {
              icon: Instagram,
              href: "https://www.instagram.com/wohh.nitish",
            },
            {
              icon: Linkedin,
              href: "https://www.linkedin.com/in/nitish-kumar-bharti-631a37359/",
            },
            { icon: Github, href: "https://github.com/coder-nik200" },
            {
              icon: Mail,
              href: "https://mail.google.com/mail/?view=cm&fs=1&to=codesnippet17@gmail.com",
            },
          ].map((social, i) => {
            const Icon = social.icon;

            return (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#494454]/30 flex items-center justify-center hover:bg-[#353436] transition-all"
              >
                <Icon size={18} className="text-[#cbc3d7]" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Product */}
      <div>
        <h5 className="font-bold text-white text-sm mb-6">Product</h5>

        <ul className="space-y-4 text-sm text-[#cbc3d7]">
          {["Features", "Integrations", "API", "Changelog"].map((item) => (
            <li key={item}>
              <button
                onClick={() => handleNavigate("/solutions")}
                className="hover:text-[#d0bcff] transition-colors text-left"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Company */}
      <div>
        <h5 className="font-bold text-white text-sm mb-6">Company</h5>

        <ul className="space-y-4 text-sm text-[#cbc3d7]">
          {["About Us", "Careers", "Blog"].map((item) => (
            <li key={item}>
              <button
                onClick={() => handleNavigate("/about")}
                className="hover:text-[#d0bcff] transition-colors text-left"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h5 className="font-bold text-white text-sm mb-6">Legal</h5>

        <ul className="space-y-4 text-sm text-[#cbc3d7]">
          {["Privacy Policy", "Terms of Service", "Security"].map((item) => (
            <li key={item}>
              <button
                onClick={() => handleNavigate("/about")}
                className="hover:text-[#d0bcff] transition-colors text-left"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h5 className="font-bold text-white text-sm mb-6">Contact</h5>

        <ul className="space-y-4 text-sm text-[#cbc3d7]">
          {["Support", "Sales", "Press"].map((item) => (
            <li key={item}>
              <button
                onClick={() => handleNavigate("/about")}
                className="hover:text-[#d0bcff] transition-colors text-left"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom */}
      <div className="col-span-full pt-12 border-t border-[#494454]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p className="text-[#cbc3d7]">
          © 2026 Nexora AI. All rights reserved.
        </p>

        <div className="flex items-center gap-2 text-[#958ea0]">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          System Operational
        </div>
      </div>
    </footer>
  );
}