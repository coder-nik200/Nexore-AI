import { ArrowLeft, Sparkles, BrainCircuit, ShieldCheck, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NexoraAISolutionsPage() {
  const navigate = useNavigate();

  const solutions = [
    {
      icon: <Bot size={26} />,
      title: "AI Workflow Automation",
      description:
        "Automate repetitive workflows, approvals, reporting, and operational tasks with intelligent AI-driven pipelines.",
      features: [
        "Smart task orchestration",
        "Automated approvals",
        "Workflow analytics",
        "Cross-platform integrations",
      ],
    },
    {
      icon: <BrainCircuit size={26} />,
      title: "Enterprise Knowledge AI",
      description:
        "Turn internal documents and company knowledge into a searchable AI assistant for teams.",
      features: [
        "Private AI search",
        "Knowledge indexing",
        "Secure data access",
        "Real-time answers",
      ],
    },
    {
      icon: <ShieldCheck size={26} />,
      title: "AI Customer Support",
      description:
        "Deliver 24/7 intelligent support experiences powered by AI trained on your business data.",
      features: [
        "Instant customer replies",
        "Human handoff system",
        "Conversation insights",
        "Multi-channel support",
      ],
    },
    {
      icon: <Sparkles size={26} />,
      title: "Predictive Analytics",
      description:
        "Forecast trends, identify risks, and improve decision-making with advanced AI insights.",
      features: [
        "Business forecasting",
        "Performance tracking",
        "AI-generated insights",
        "Custom dashboards",
      ],
    },
  ];

  const industries = [
    "SaaS",
    "Healthcare",
    "Finance",
    "Education",
    "E-commerce",
    "Real Estate",
    "Operations",
    "Customer Service",
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Hero */}
      <section className="relative px-6 md:px-12 py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#cbc3d7] hover:text-white transition-all mb-16 group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </button>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-sm text-[#d0bcff] mb-6">
                <Sparkles size={16} />
                Nexora AI Solutions
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
                Smart AI Solutions For Modern Businesses
              </h1>

              <p className="text-[#b6b2be] text-lg leading-relaxed max-w-2xl">
                Build intelligent systems, automate workflows, and scale your
                business with powerful enterprise-grade AI technologies.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-5 mt-12">
                <div>
                  <h3 className="text-3xl font-bold text-white">95%</h3>
                  <p className="text-sm text-[#9f9aa8] mt-1">
                    Faster Operations
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white">24/7</h3>
                  <p className="text-sm text-[#9f9aa8] mt-1">
                    AI Automation
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white">10x</h3>
                  <p className="text-sm text-[#9f9aa8] mt-1">
                    Productivity
                  </p>
                </div>
              </div>
            </div>

            {/* Right UI Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-500/20 blur-3xl rounded-full"></div>

              <div className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-[#b6b2be]">
                      AI System Status
                    </p>

                    <h3 className="text-2xl font-bold mt-1">
                      Operational
                    </h3>
                  </div>

                  <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse"></div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-2xl bg-[#111114] border border-white/5 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-[#cbc3d7]">
                        Workflow Efficiency
                      </p>

                      <span className="text-sm text-[#d0bcff]">
                        95%
                      </span>
                    </div>

                    <div className="h-2 bg-[#1c1c22] rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#111114] border border-white/5 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-[#cbc3d7]">
                        AI Requests
                      </p>

                      <span className="text-sm text-[#d0bcff]">
                        14.2K
                      </span>
                    </div>

                    <div className="h-2 bg-[#1c1c22] rounded-full overflow-hidden">
                      <div className="h-full w-[82%] bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#111114] border border-white/5 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-[#cbc3d7]">
                        Infrastructure Health
                      </p>

                      <span className="text-sm text-[#d0bcff]">
                        Stable
                      </span>
                    </div>

                    <div className="h-2 bg-[#1c1c22] rounded-full overflow-hidden">
                      <div className="h-full w-[90%] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="px-6 md:px-12 py-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-5">
              Core AI Solutions
            </h2>

            <p className="text-[#b6b2be] max-w-2xl mx-auto text-lg">
              Enterprise-ready AI products designed to automate, optimize, and
              accelerate modern business operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-8 hover:border-purple-500/30 transition-all duration-500"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-purple-500/10 to-indigo-500/5"></div>

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#d0bcff] mb-6">
                    {solution.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    {solution.title}
                  </h3>

                  <p className="text-[#b6b2be] leading-relaxed mb-8">
                    {solution.description}
                  </p>

                  <div className="space-y-3">
                    {solution.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3 text-sm text-[#d8d5df]"
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="px-6 md:px-12 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#111114] to-[#0d0d10] p-10 md:p-16">
            <div className="text-center mb-14">
              <h2 className="text-5xl font-bold mb-5">
                Industries We Empower
              </h2>

              <p className="text-[#b6b2be] max-w-2xl mx-auto text-lg">
                Nexora AI adapts seamlessly across industries and business
                ecosystems.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 text-center hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300"
                >
                  <h4 className="font-semibold text-lg">
                    {industry}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-[#8e8997]">
        © 2026 Nexora AI. All rights reserved.
      </footer>
    </div>
  );
}