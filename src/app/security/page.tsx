import Link from "next/link";
import { ArrowLeft, ShieldCheck, Key, RefreshCw, Cpu, Server } from "lucide-react";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SecurityPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-[#f4f4f5] dark:bg-[#111113] text-[#18181b] dark:text-[#eeeeef] font-sans antialiased selection:bg-[#ff5a00] selection:text-white transition-colors duration-200">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#161618]/80 backdrop-blur-md border-b border-[#ececee] dark:border-[#2e2e32]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#09090b] dark:bg-[#eeeeef] border border-[#2c2e34] dark:border-[#d4d4d8]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="2" fill="none" className="stroke-white dark:stroke-[#111113]" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" fill="none" className="stroke-white dark:stroke-[#111113]" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" fill="none" className="stroke-white dark:stroke-[#111113]" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" fill="#ff5a00" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#09090b] dark:text-[#eeeeef] tracking-tight">EcoSphere</span>
          </Link>

          {/* Centered Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#52525b] dark:text-[#8c8c94]">
            <Link href="/#pillars" className="hover:text-[#09090b] dark:hover:text-[#eeeeef] transition-colors">Pillars</Link>
            <Link href="/#features" className="hover:text-[#09090b] dark:hover:text-[#eeeeef] transition-colors">Features</Link>
            <Link href="/#impact" className="hover:text-[#09090b] dark:hover:text-[#eeeeef] transition-colors">Impact</Link>
            <Link href="/#about" className="hover:text-[#09090b] dark:hover:text-[#eeeeef] transition-colors">Platform</Link>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-[10000px] bg-[#09090b] dark:bg-[#eeeeef] text-white dark:text-[#111113] px-5 py-2 text-[14px] font-medium transition-all hover:bg-[#18181b] dark:hover:bg-[#d4d4d8] border border-[#2c2e34] dark:border-[#d4d4d8]"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-[14px] font-medium text-[#52525b] dark:text-[#8c8c94] hover:text-[#09090b] dark:hover:text-[#eeeeef] transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-[10000px] bg-[#09090b] dark:bg-[#eeeeef] text-white dark:text-[#111113] px-5 py-2 text-[14px] font-medium transition-all hover:bg-[#18181b] dark:hover:bg-[#d4d4d8] border border-[#2c2e34] dark:border-[#d4d4d8]"
                >
                  Book Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[800px] mx-auto px-6 py-16 md:py-24 space-y-12">
        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ff5a00] hover:text-[#ff7830] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        {/* Page Title & Intro */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#ff5a00]/10 dark:bg-[#ff5a00]/20 text-[#ff5a00] px-3 py-1 text-[12px] font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-3 w-3" />
            <span>Infrastructure Integrity</span>
          </div>
          <h1 className="text-4xl md:text-[52px] font-semibold text-[#09090b] dark:text-[#eeeeef] leading-[1.12] tracking-tight">
            Security & Compliance
          </h1>
          <p className="text-[#52525b] dark:text-[#8c8c94] text-[16px] md:text-[18px] leading-[1.45]">
            EcoSphere operates with infrastructure-grade data controls, ensuring that your ESG audits, carbon numbers, and employee transactions are protected by industry-standard encryption protocols.
          </p>
        </div>

        {/* Editorial Content Card */}
        <div className="bg-white dark:bg-[#1c1c1f] border border-[#ececee] dark:border-[#2e2e32] rounded-[36px] p-8 md:p-12 space-y-10 shadow-sm">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#2a2a2e] text-[#ff5a00]">
                <Key className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold text-[#09090b] dark:text-[#eeeeef] tracking-tight">1. Data Encryption</h2>
            </div>
            <p className="text-[14px] text-[#52525b] dark:text-[#8c8c94] leading-relaxed">
              All organizational ESG data is encrypted in transit using TLS 1.3 and at rest using AES-256. This applies to all database tables (carbon transactions, CSR submissions, policies, and XP logs).
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#2a2a2e] text-[#ff5a00]">
                <Cpu className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold text-[#09090b] dark:text-[#eeeeef] tracking-tight">2. API Security & Role-Based Access</h2>
            </div>
            <p className="text-[14px] text-[#52525b] dark:text-[#8c8c94] leading-relaxed">
              We enforce strict RBAC (Role-Based Access Control) defined in our master schema:
            </p>
            <ul className="list-disc list-inside text-[14px] text-[#52525b] dark:text-[#8c8c94] space-y-2 pl-4">
              <li><strong>Auditors:</strong> Scope limited to internal auditing tools and compliance tracking.</li>
              <li><strong>Employees:</strong> Profile limits; points redemption is restricted to current employee balance.</li>
              <li><strong>ESG Managers:</strong> Access to configure emission factors, categories, and policies.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#2a2a2e] text-[#ff5a00]">
                <Server className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold text-[#09090b] dark:text-[#eeeeef] tracking-tight">3. Hosting and Availability</h2>
            </div>
            <p className="text-[14px] text-[#52525b] dark:text-[#8c8c94] leading-relaxed">
              Our servers reside in SOC 2 Type II certified cloud data centers. We maintain daily database snapshots and automated backups to guarantee zero-data-loss recovery targets.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#2a2a2e] text-[#ff5a00]">
                <RefreshCw className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold text-[#09090b] dark:text-[#eeeeef] tracking-tight">4. Audit Trails & Logs</h2>
            </div>
            <p className="text-[14px] text-[#52525b] dark:text-[#8c8c94] leading-relaxed">
              Every data modification, policy acknowledgement, and CSR approval is tracked with an immutable timestamp and auditor reference, establishing an audit-ready compliance system.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ececee] dark:border-[#2e2e32] bg-white dark:bg-[#1c1c1f] py-12 text-[13px] text-[#71717a] dark:text-[#8c8c94] transition-colors duration-200">
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
