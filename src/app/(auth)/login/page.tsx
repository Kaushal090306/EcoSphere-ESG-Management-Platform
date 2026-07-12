"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Leaf, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.91c1.7-1.57 2.68-3.88 2.68-6.57z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.24c-.8.54-1.84.87-3.05.87-2.35 0-4.33-1.59-5.05-3.73H.95v2.3C2.43 15.93 5.48 18 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.95 10.73A5.4 5.4 0 0 1 3.6 9c0-.6.1-1.2.28-1.73V4.97H.95A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.95 4.03l3-2.3z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.89 11.43 0 9 0 5.48 0 2.43 2.07.95 4.97l3 2.3c.72-2.14 2.7-3.73 5.05-3.73z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-slate-950 shrink-0">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleSocialLogin = (provider: string) => {
    setError(`Social authentication with ${provider} is disabled for this workspace.`);
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-x-hidden font-sans select-none"
      style={{
        background: 'linear-gradient(135deg, #CA9CF7 0%, #ECC6F4 20%, #F5D3D6 45%, #FFF5EE 65%, #FFFFFF 85%)'
      }}
    >
      
      {/* Header Area */}
      <header className="absolute top-6 left-0 right-0 px-8 flex justify-between items-center w-full z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-300">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-base font-bold tracking-wider text-slate-800 uppercase">
            EcoSphere
          </span>
        </div>
        <div className="text-sm text-slate-600 hidden sm:block">
          Don't have an account?{" "}
          <span
            onClick={() => handleSocialLogin("Sign Up")}
            className="hover:underline font-semibold text-slate-900 cursor-pointer inline-flex items-center gap-0.5"
          >
            Sign up <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-[400px] flex flex-col items-center py-8 z-10">
        
        <h2 className="text-[20px] font-medium text-slate-800 tracking-tight mb-6">
          Log in to your account
        </h2>

        {/* Social Buttons */}
        <div className="w-full space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="relative w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 rounded-full text-[13px] flex items-center justify-center transition-colors shadow-sm focus:outline-hidden"
          >
            <div className="absolute left-2.5 top-1.5 h-8 w-8 bg-white rounded-full flex items-center justify-center">
              <GoogleIcon />
            </div>
            Log in with Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("GitHub")}
            className="relative w-full bg-[#1F2937] hover:bg-[#111827] text-white font-medium py-3 rounded-full text-[13px] flex items-center justify-center transition-colors shadow-sm focus:outline-hidden"
          >
            <div className="absolute left-2.5 top-1.5 h-8 w-8 bg-white rounded-full flex items-center justify-center">
              <GithubIcon />
            </div>
            Log in with GitHub
          </button>
        </div>

        {/* Separator */}
        <div className="w-full flex items-center justify-center gap-3 mb-6">
          <div className="h-px bg-slate-300 flex-1" />
          <span className="text-[11px] text-slate-500 uppercase tracking-widest">or</span>
          <div className="h-px bg-slate-300 flex-1" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative flex items-center">
            <Mail className="absolute left-4 text-slate-400 h-5 w-5" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              className="w-full bg-[#F3F4F6] text-slate-900 border-none rounded-xl pl-12 pr-4 h-12 focus-visible:ring-1 focus-visible:ring-violet-500 focus-visible:bg-white transition-all outline-hidden text-[13px] placeholder:text-slate-400"
            />
          </div>

          <div className="relative flex items-center">
            <Lock className="absolute left-4 text-slate-400 h-5 w-5" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              className="w-full bg-[#F3F4F6] text-slate-900 border-none rounded-xl pl-12 pr-4 h-12 focus-visible:ring-1 focus-visible:ring-violet-500 focus-visible:bg-white transition-all outline-hidden text-[13px] placeholder:text-slate-400"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-600 text-center animate-fade-in">
              {error}
            </div>
          )}

          <div className="text-center">
            <span
              onClick={() => handleSocialLogin("Password Recovery")}
              className="text-[12px] text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Don't remember your password?
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#000000] hover:bg-slate-800 text-white font-medium py-3 rounded-full text-[13px] transition-colors focus:outline-hidden"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>

        {/* Credentials Sandbox */}
        <div className="w-full mt-6 bg-slate-50/80 border border-slate-200/60 rounded-xl p-4 text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
          <div className="font-semibold text-slate-700 mb-1">Developer testing credentials</div>
          <div className="flex justify-between items-center">
            <span>Superadmin:</span>
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600 font-mono">
              admin@ecosphere.com / password123
            </code>
          </div>
          <div className="flex justify-between items-center">
            <span>ESG Manager:</span>
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600 font-mono">
              manager@ecosphere.com / password123
            </code>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center text-[11px] text-slate-500">
        © 2026 EcoSphere. All rights reserved.
      </footer>
    </div>
  );
}

