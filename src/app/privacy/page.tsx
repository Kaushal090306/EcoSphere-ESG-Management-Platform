import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function PrivacyPage() {
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
            <Lock className="h-3 w-3" />
            <span>Updated July 2026</span>
          </div>
          <h1 className="text-4xl md:text-[52px] font-semibold text-[#09090b] dark:text-[#eeeeef] leading-[1.12] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-[#52525b] dark:text-[#8c8c94] text-[16px] md:text-[18px] leading-[1.45]">
            At EcoSphere, we respect your privacy and are committed to protecting the organizational and individual data you entrust to our ESG platform.
          </p>
        </div>

        {/* Editorial Content Card */}
        <div className="bg-white dark:bg-[#1c1c1f] border border-[#ececee] dark:border-[#2e2e32] rounded-[36px] p-8 md:p-12 space-y-10 shadow-sm">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#2a2a2e] text-[#ff5a00]">
                <Eye className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold text-[#09090b] dark:text-[#eeeeef] tracking-tight">1. Information We Collect</h2>
            </div>
            <p className="text-[14px] text-[#52525b] dark:text-[#8c8c94] leading-relaxed">
              We collect organizational data necessary to perform automated carbon math and track compliance. This includes:
            </p>
            <ul className="list-disc list-inside text-[14px] text-[#52525b] dark:text-[#8c8c94] space-y-2 pl-4">
              <li><strong>User Profile Info:</strong> Name, work email, and role configuration.</li>
              <li><strong>ERP Integrations:</strong> Logistics logs, energy bills, and purchase receipts containing energy values.</li>
              <li><strong>CSR & Challenges:</strong> Voluntary employee participation, milestone badges, and evidence files.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#2a2a2e] text-[#ff5a00]">
                <Shield className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold text-[#09090b] dark:text-[#eeeeef] tracking-tight">2. How We Use Information</h2>
            </div>
            <p className="text-[14px] text-[#52525b] dark:text-[#8c8c94] leading-relaxed">
              All data collected is used solely to facilitate the features outlined in our ESG requirements:
            </p>
            <ul className="list-disc list-inside text-[14px] text-[#52525b] dark:text-[#8c8c94] space-y-2 pl-4">
              <li>To calculate and aggregate greenhouse gas emissions using authorized emission factors.</li>
              <li>To maintain public (internal) leaderboards showing XP, badges, and volunteer rates.</li>
              <li>To run policy acknowledgement workflows and trigger compliance reminders.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#2a2a2e] text-[#ff5a00]">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold text-[#09090b] dark:text-[#eeeeef] tracking-tight">3. Data Sharing & Security</h2>
            </div>
            <p className="text-[14px] text-[#52525b] dark:text-[#8c8c94] leading-relaxed">
              We do not sell organizational data. Data is shared only with trusted sub-processors necessary to run the database hosting, email triggers, or when requested by authorized external compliance auditors appointed by your organization.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#09090b] dark:text-[#eeeeef] tracking-tight">4. Retention and Choice</h2>
            <p className="text-[14px] text-[#52525b] dark:text-[#8c8c94] leading-relaxed">
              We retain ESG logs for the duration of your service subscription. Organizations can request data exports in CSV or PDF format at any point. When a profile is deleted, we remove personal references within 30 days.
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
