import {
    ArrowLeft,
    Sparkles,
    BrainCircuit,
    ShieldCheck,
    Rocket,
    Globe,
    Users,
    Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AVATARS } from "../data";

export default function NexoraAIAboutPage() {
    const navigate = useNavigate();

    const values = [
        {
            icon: <BrainCircuit size={28} />,
            title: "AI Innovation",
            description:
                "We build intelligent systems that help businesses automate workflows and scale faster.",
        },
        {
            icon: <ShieldCheck size={28} />,
            title: "Enterprise Security",
            description:
                "Every solution is designed with secure infrastructure and enterprise-grade reliability.",
        },
        {
            icon: <Rocket size={28} />,
            title: "Scalable Growth",
            description:
                "Nexora AI helps teams grow efficiently with modern AI-powered systems.",
        },
    ];

    const stats = [
        { number: "120+", label: "Enterprise Clients" },
        { number: "98%", label: "Customer Satisfaction" },
        { number: "24/7", label: "AI Operations" },
        { number: "10x", label: "Productivity Growth" },
    ];

    const team = [
        {
            name: "Nitish Bharti",
            role: "Founder & AI Architect",
            image: AVATARS.nitish,
        },
        {
            name: "Alex Rivera",
            role: "Lead AI Engineer",
            image: AVATARS.alexRivera,
        },
        {
            name: "Mahima",
            role: "Product Designer",
            image: AVATARS.head7,
        },
        {
            name: "Rahul Mehta",
            role: "Cloud Infrastructure Lead",
            image: AVATARS.head4,
        },
    ];

    return (
        <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 blur-[140px] rounded-full"></div>

                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full"></div>
            </div>

            {/* Hero Section */}
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
                                About Nexora AI
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
                                Building The Future Of Intelligent Business
                            </h1>

                            <p className="text-[#b6b2be] text-lg leading-relaxed max-w-2xl">
                                Nexora AI is an enterprise AI platform focused on automation,
                                productivity, and scalable intelligent systems. We help modern
                                businesses transform operations using powerful AI technologies.
                            </p>
                        </div>

                        {/* Right Card */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-500/20 blur-3xl rounded-full"></div>

                            <div className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <p className="text-sm text-[#b6b2be]">
                                            AI Infrastructure
                                        </p>

                                        <h3 className="text-2xl font-bold mt-1">
                                            Fully Operational
                                        </h3>
                                    </div>

                                    <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse"></div>
                                </div>

                                <div className="space-y-5">
                                    <div className="rounded-2xl bg-[#111114] border border-white/5 p-5 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#d0bcff]">
                                            <Cpu size={22} />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold">AI Automation Engine</h4>
                                            <p className="text-sm text-[#9f9aa8] mt-1">
                                                Smart workflow orchestration system
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-[#111114] border border-white/5 p-5 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-[#c0c1ff]">
                                            <Globe size={22} />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold">
                                                Global Cloud Infrastructure
                                            </h4>

                                            <p className="text-sm text-[#9f9aa8] mt-1">
                                                Enterprise-grade scalability & performance
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-[#111114] border border-white/5 p-5 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-pink-300">
                                            <Users size={22} />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold">
                                                Collaborative AI Workspace
                                            </h4>

                                            <p className="text-sm text-[#9f9aa8] mt-1">
                                                Built for modern enterprise teams
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="px-6 md:px-12 py-24">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 text-center hover:border-purple-500/30 transition-all"
                        >
                            <h3 className="text-4xl font-black text-white mb-3">
                                {item.number}
                            </h3>

                            <p className="text-[#b6b2be] text-sm">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="px-6 md:px-12 pb-28">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#111114] to-[#0d0d10] p-10 md:p-16">
                        <div className="max-w-3xl">
                            <h2 className="text-5xl font-bold mb-6">
                                Our Mission
                            </h2>

                            <p className="text-[#b6b2be] text-lg leading-relaxed">
                                Our mission is to empower businesses with intelligent AI systems
                                that simplify operations, reduce manual effort, and unlock
                                next-generation productivity. Nexora AI combines automation,
                                analytics, and enterprise-grade infrastructure into one unified
                                platform.
                            </p>
                        </div>

                        {/* Values */}
                        <div className="grid md:grid-cols-3 gap-8 mt-16">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:border-purple-500/30 transition-all duration-300"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#d0bcff] mb-6">
                                        {value.icon}
                                    </div>

                                    <h3 className="text-2xl font-bold mb-4">
                                        {value.title}
                                    </h3>

                                    <p className="text-[#b6b2be] leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="px-6 md:px-12 pb-28">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-5">
                            Meet The Team
                        </h2>

                        <p className="text-[#b6b2be] max-w-2xl mx-auto text-lg">
                            The people building intelligent systems and shaping the future of
                            AI-powered business operations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2"
                            >
                                {/* Team Image */}
                                <div className="relative w-28 h-28 mx-auto mb-6">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 blur-xl opacity-40"></div>

                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="relative w-28 h-28 rounded-full object-cover border-4 border-white/10 shadow-2xl"
                                    />
                                </div>

                                <h3 className="text-xl font-bold mb-2">
                                    {member.name}
                                </h3>

                                <p className="text-[#b6b2be] text-sm">
                                    {member.role}
                                </p>
                            </div>
                        ))}
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