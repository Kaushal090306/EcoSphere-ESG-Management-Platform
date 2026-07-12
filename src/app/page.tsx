import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Shield, Users, Leaf, ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-[#18181b] font-sans antialiased selection:bg-[#ff5a00] selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#18181b]/80 backdrop-blur-md border-b border-[#ececee]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#09090b] border border-[#2c2e34]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="2" fill="#ffffff" />
                <rect x="14" y="3" width="7" height="7" rx="2" fill="#ffffff" />
                <rect x="3" y="14" width="7" height="7" rx="2" fill="#ffffff" />
                <rect x="14" y="14" width="7" height="7" rx="2" fill="#ff5a00" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#09090b] tracking-tight">EcoSphere</span>
          </Link>

          {/* Centered Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#52525b]">
            <a href="#pillars" className="hover:text-[#09090b] transition-colors">Pillars</a>
            <a href="#features" className="hover:text-[#09090b] transition-colors">Features</a>
            <a href="#impact" className="hover:text-[#09090b] transition-colors">Impact</a>
            <a href="#about" className="hover:text-[#09090b] transition-colors">Platform</a>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-[10000px] bg-[#09090b] text-white px-5 py-2 text-[14px] font-medium transition-all hover:bg-[#18181b] border border-[#2c2e34]"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-[14px] font-medium text-[#52525b] hover:text-[#09090b] transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-[10000px] bg-[#09090b] text-white px-5 py-2 text-[14px] font-medium transition-all hover:bg-[#18181b] border border-[#2c2e34]"
                >
                  Book Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Orange Accent Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#ff5a00] text-white px-3 py-1 text-[12px] font-semibold uppercase tracking-wider">
              <span>EcoSphere ESG v2.0</span>
            </div>

            <h1 className="text-4xl md:text-[56px] lg:text-[64px] font-semibold text-[#09090b] leading-[1.12] tracking-tight">
              Standardize your ESG Management.
            </h1>
            
            <p className="text-[#52525b] text-[16px] md:text-[18px] leading-[1.45] max-w-[540px]">
              EcoSphere helps organizations automate carbon accounting, track CSR initiatives, audit governance compliance, and engage employees through eco-challenges in one beautiful infrastructure-grade system.
            </p>
          </div>

          {/* Right Column (CTA Form) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#18181b] border border-[#ececee] rounded-[36px] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#09090b] mb-2">Request Access</h3>
            <p className="text-sm text-[#52525b] mb-6">
              Start measuring your ecological, social, and governance metrics with precision.
            </p>

            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="bg-[#fafafa] rounded-[14px] p-4 text-center border border-[#ececee]">
                  <p className="text-[14px] text-[#52525b] font-medium">Logged in as {session.user?.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 rounded-[14px] bg-[#09090b] hover:bg-[#18181b] text-white py-3.5 text-[14px] font-medium transition-all border border-[#2c2e34]"
                >
                  Enter ESG Workspace <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form action="/login" className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    required
                    className="w-full bg-[#f4f4f5] text-[#18181b] placeholder-[#a1a1aa] rounded-[14px] px-4 py-3.5 text-[14px] border border-transparent focus:border-[#ececee] outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-[14px] bg-[#09090b] hover:bg-[#18181b] text-white py-3.5 text-[14px] font-medium transition-all border border-[#2c2e34]"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
            
            <p className="text-[11px] text-[#71717a] text-center mt-4">
              By submitting, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </section>

      {/* Logo Strip (Social Proof) */}
      <section className="border-y border-[#ececee] bg-white dark:bg-[#18181b] py-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-8 md:gap-4 opacity-70">
            <span className="text-[12px] font-bold text-[#71717a] uppercase tracking-wider">Trusted by leaders</span>
            <div className="flex items-center gap-8 flex-wrap justify-center">
              <span className="text-[15px] font-bold text-[#71717a] tracking-tight">COCA-COLA</span>
              <span className="text-[15px] font-bold text-[#71717a] tracking-tight">DISNEY</span>
              <span className="text-[15px] font-bold text-[#71717a] tracking-tight">GENESIS</span>
              <span className="text-[15px] font-bold text-[#71717a] tracking-tight">UDEMY</span>
              <span className="text-[15px] font-bold text-[#71717a] tracking-tight">ERNST & YOUNG</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section: Category Card Grid */}
      <section id="pillars" className="max-w-[1200px] mx-auto px-6 py-24 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-semibold text-[#09090b] tracking-tight leading-tight">
            Comprehensive ESG Pillars
          </h2>
          <p className="text-[#52525b] text-[15px]">
            Streamline your organizational compliance and sustainability reporting across four core functional modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Environmental */}
          <div className="bg-white dark:bg-[#18181b] border border-[#ececee] rounded-[36px] overflow-hidden flex flex-col justify-between hover:border-[#ff5a00]/30 transition-all group">
            <div className="relative h-48 w-full bg-[#f4f4f5]">
              <Image
                src="/images/landing/environmental.png"
                alt="Environmental and Carbon Accounting"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-7 space-y-4">
              <span className="inline-flex rounded-[12px] border border-[#ececee] px-2.5 py-0.5 text-[12px] font-medium text-[#18181b]">
                Scope 1, 2 & 3
              </span>
              <h4 className="text-lg font-bold text-[#09090b] tracking-tight">Environmental</h4>
              <p className="text-[13px] text-[#52525b] leading-relaxed">
                Log energy consumption, automate emissions calculation with pre-loaded factors, and manage carbon transactions.
              </p>
            </div>
          </div>

          {/* Card 2: Social */}
          <div className="bg-white dark:bg-[#18181b] border border-[#ececee] rounded-[36px] overflow-hidden flex flex-col justify-between hover:border-[#ff5a00]/30 transition-all group">
            <div className="relative h-48 w-full bg-[#f4f4f5]">
              <Image
                src="/images/landing/social.png"
                alt="Social Impact & CSR"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-7 space-y-4">
              <span className="inline-flex rounded-[12px] border border-[#ececee] px-2.5 py-0.5 text-[12px] font-medium text-[#18181b]">
                Corporate Responsibility
              </span>
              <h4 className="text-lg font-bold text-[#09090b] tracking-tight">Social Impact</h4>
              <p className="text-[13px] text-[#52525b] leading-relaxed">
                Monitor CSR activities, track community volunteer participation, and report on corporate diversity and inclusion.
              </p>
            </div>
          </div>

          {/* Card 3: Governance */}
          <div className="bg-white dark:bg-[#18181b] border border-[#ececee] rounded-[36px] overflow-hidden flex flex-col justify-between hover:border-[#ff5a00]/30 transition-all group">
            <div className="relative h-48 w-full bg-[#f4f4f5]">
              <Image
                src="/images/landing/governance.png"
                alt="Governance & Auditing"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-7 space-y-4">
              <span className="inline-flex rounded-[12px] border border-[#ececee] px-2.5 py-0.5 text-[12px] font-medium text-[#18181b]">
                Compliance & Audits
              </span>
              <h4 className="text-lg font-bold text-[#09090b] tracking-tight">Governance</h4>
              <p className="text-[13px] text-[#52525b] leading-relaxed">
                Manage board policies, coordinate compliance audits, flag corporate risks, and prepare board-ready ESG documentation.
              </p>
            </div>
          </div>

          {/* Card 4: Gamification */}
          <div className="bg-white dark:bg-[#18181b] border border-[#ececee] rounded-[36px] overflow-hidden flex flex-col justify-between hover:border-[#ff5a00]/30 transition-all group">
            <div className="relative h-48 w-full bg-[#f4f4f5]">
              <Image
                src="/images/landing/gamification.png"
                alt="Gamification Overview"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-7 space-y-4">
              <span className="inline-flex rounded-[12px] border border-[#ececee] px-2.5 py-0.5 text-[12px] font-medium text-[#18181b]">
                Eco-Gamification
              </span>
              <h4 className="text-lg font-bold text-[#09090b] tracking-tight">Engagement</h4>
              <p className="text-[13px] text-[#52525b] leading-relaxed">
                Foster sustainability culture with active eco-challenges, leaderboard tracking, and rewarding eco-participation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Feature Card Block */}
      <section id="features" className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="bg-[#18181b] rounded-[36px] p-8 md:p-14 text-white space-y-10">
          <div className="max-w-2xl space-y-4">
            <span className="text-[#ff5a00] text-xs font-bold uppercase tracking-wider">Solve ESG Complexity</span>
            <h2 className="text-2xl md:text-[32px] font-semibold text-white tracking-tight leading-tight">
              Why infrastructure-grade ESG management matters
            </h2>
            <p className="text-[#a1a1aa] text-[15px]">
              Siloed spreadsheets are prone to compliance risk. EcoSphere establishes a secure single source of truth for all sustainable governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#18181b]/10 text-[#ff5a00]">
                <Leaf className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold">Automated Carbon Math</h4>
              <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
                Connect your energy bills and logistics data. Our preloaded emission factor libraries translate activity into CO₂e automatically.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#18181b]/10 text-[#ff5a00]">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold">Audit-Ready Compliance</h4>
              <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
                No more guessing. Log policies, attach audit history, and prepare reports aligned with CSRD, SASB, and SEC disclosure guidelines.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#18181b]/10 text-[#ff5a00]">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold">Incentivized Actions</h4>
              <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
                Create friendly team challenges for sustainable practices. Let employees earn digital badges, climbs leaderboards, and redeem rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Block Section */}
      <section id="impact" className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="bg-white dark:bg-[#18181b] border border-[#ececee] rounded-[36px] p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Stat 1 */}
            <div className="flex flex-col md:flex-row items-baseline gap-4 md:border-r border-[#ececee] last:border-r-0 pr-4">
              <span className="text-5xl md:text-[56px] font-bold text-[#09090b] tracking-tight font-mono">40%</span>
              <div className="space-y-1">
                <h5 className="text-[13px] font-semibold text-[#09090b]">Faster Reporting</h5>
                <p className="text-[12px] text-[#52525b]">Average reduction in yearly ESG audit compilation cycles.</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col md:flex-row items-baseline gap-4 md:border-r border-[#ececee] last:border-r-0 pr-4">
              <span className="text-5xl md:text-[56px] font-bold text-[#09090b] tracking-tight font-mono">1.2k+</span>
              <div className="space-y-1">
                <h5 className="text-[13px] font-semibold text-[#09090b]">Tons Offset</h5>
                <p className="text-[12px] text-[#52525b]">Carbon dioxide emissions mitigated through audited offsets.</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col md:flex-row items-baseline gap-4">
              <span className="text-5xl md:text-[56px] font-bold text-[#09090b] tracking-tight font-mono">15k+</span>
              <div className="space-y-1">
                <h5 className="text-[13px] font-semibold text-[#09090b]">Employees Engaged</h5>
                <p className="text-[12px] text-[#52525b]">Active users taking part in organizational eco-challenges.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breakthrough Image Section */}
      <section className="max-w-[1200px] mx-auto px-6 pb-24">
        <div className="relative h-64 md:h-96 w-full rounded-[48px] overflow-hidden">
          <Image
            src="/images/landing/nature-breakthrough.png"
            alt="Organic green forest moss close-up representing carbon offset focus"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#09090b]/10 backdrop-blur-[0px]" />
        </div>
      </section>

      {/* Testimonial / Final CTA */}
      <section className="max-w-[1200px] mx-auto px-6 pb-32">
        <div className="bg-white dark:bg-[#18181b] border border-[#ececee] rounded-[36px] p-8 md:p-14 text-center max-w-4xl mx-auto space-y-8">
          <p className="text-xl md:text-2xl font-medium text-[#09090b] leading-relaxed italic">
            "EcoSphere completely centralized our Scope 1 and 2 carbon ledger. We consolidated data from three subsidiaries and finished our annual compliance review in just one week."
          </p>
          <div className="space-y-1">
            <h5 className="text-[14px] font-bold text-[#09090b]">Elena Rostova</h5>
            <p className="text-[12px] text-[#71717a]">Director of Sustainability, GreenTech Industries</p>
          </div>
          
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-[14px] bg-[#09090b] hover:bg-[#18181b] text-white px-8 py-3.5 text-[14px] font-medium transition-all border border-[#2c2e34]"
            >
              Get Started with EcoSphere <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ececee] dark:border-[#2e2e32] bg-white dark:bg-[#1c1c1f] py-12 text-[13px] text-[#71717a] dark:text-[#8c8c94]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#09090b] dark:text-[#eeeeef]">EcoSphere</span>
            <span>© {new Date().getFullYear()} EcoSphere. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#09090b] dark:hover:text-[#eeeeef] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#09090b] dark:hover:text-[#eeeeef] transition-colors">Terms of Service</Link>
            <Link href="/security" className="hover:text-[#09090b] dark:hover:text-[#eeeeef] transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
