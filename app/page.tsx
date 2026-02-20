"use client";

import { useState, useEffect } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Student" | "Professor" | "Mentor">("Student");
  const [school, setSchool] = useState("");
  const [referral, setReferral] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("Please enter your email.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          role,
          school: school.trim() || undefined,
          referral: referral.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setMessage(data.message || "You're on the list!");
      setEmail("");
      setSchool("");
      setReferral("");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav - white text over hero, dark text + light bg when scrolled */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm border-b border-[#e8e8e8]" : ""}`}>
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className={`text-xl font-semibold transition-colors ${scrolled ? "text-[#1a2332] hover:text-[#4a5568]" : "text-white hover:text-white/90"}`}>
            Compass
          </button>
          <div className="flex items-center gap-4 sm:gap-8">
            <button onClick={() => scrollTo("hero")} className={`text-sm transition-colors ${scrolled ? "text-[#4a5568] hover:text-[#1a2332]" : "text-white/90 hover:text-white"}`}>
              Home
            </button>
            <button onClick={() => scrollTo("about")} className={`text-sm transition-colors ${scrolled ? "text-[#4a5568] hover:text-[#1a2332]" : "text-white/90 hover:text-white"}`}>
              About
            </button>
            <button onClick={() => scrollTo("features")} className={`text-sm transition-colors ${scrolled ? "text-[#4a5568] hover:text-[#1a2332]" : "text-white/90 hover:text-white"}`}>
              Mentors
            </button>
            <div className="flex items-center gap-3">
              <a href="https://x.com/Spark_Infinite1" target="_blank" rel="noopener noreferrer" className={`transition-colors text-sm ${scrolled ? "text-[#6b7280] hover:text-[#1a2332]" : "text-white/80 hover:text-white"}`} aria-label="X (Twitter)">
                X
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`transition-colors text-sm ${scrolled ? "text-[#6b7280] hover:text-[#1a2332]" : "text-white/80 hover:text-white"}`} aria-label="LinkedIn">
                in
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero - purple/pink gradient, split layout */}
        <section id="hero" className="relative bg-gradient-to-r from-[#5b4b8a] via-[#7c5c9e] to-[#c77d9a] min-h-[90vh] flex items-center pt-20">
          <div className="grain-overlay hero-grain" aria-hidden />
          <div className="max-w-6xl mx-auto px-6 py-16 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: headline, subhead, stats */}
              <div className="text-white text-center lg:text-left">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-normal leading-[1.1] mb-6">
                  Career clarity,{" "}
                  <span className="font-semibold">before you commit.</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/95 max-w-xl mb-10 leading-relaxed">
                  Explore careers, understand ROI, and connect with mentors who&apos;ve been there. Built for students deciding their path.
                </p>
                <div className="flex flex-wrap gap-8 sm:gap-12">
                  <div>
                    <div className="text-2xl sm:text-3xl font-semibold">500+</div>
                    <div className="text-sm text-white/90">Students Waiting</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-semibold">50+</div>
                    <div className="text-sm text-white/90">Career Paths</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-semibold">100+</div>
                    <div className="text-sm text-white/90">Mentors Ready</div>
                  </div>
                </div>
              </div>

              {/* Right: waitlist form card */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-[#1a2332] mb-1">Join the Waitlist.</h3>
                  <p className="text-sm text-[#6b7280] mb-6">Be among the first to access Compass when we launch.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "loading"}
                      className="w-full px-5 py-3.5 rounded-full border border-[#e2e8f0] bg-white text-[#1a2332] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#7c5c9e]/30 focus:border-[#7c5c9e] transition-all"
                      autoComplete="email"
                    />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as "Student" | "Professor" | "Mentor")}
                      className="w-full px-5 py-3.5 rounded-full border border-[#e2e8f0] bg-white text-[#1a2332] focus:outline-none focus:ring-2 focus:ring-[#7c5c9e]/30 focus:border-[#7c5c9e] text-sm"
                    >
                      <option value="Student">Student</option>
                      <option value="Professor">Professor</option>
                      <option value="Mentor">Mentor</option>
                    </select>
                    <input
                      type="text"
                      placeholder="School (optional)"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      disabled={status === "loading"}
                      className="w-full px-5 py-3 rounded-full border border-[#e2e8f0] bg-white text-[#1a2332] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#7c5c9e]/30 focus:border-[#7c5c9e] text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Referral: Twitter / professor / friend (optional)"
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                      disabled={status === "loading"}
                      className="w-full px-5 py-3 rounded-full border border-[#e2e8f0] bg-white text-[#1a2332] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#7c5c9e]/30 focus:border-[#7c5c9e] text-sm"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full px-8 py-3.5 rounded-full bg-gradient-to-r from-[#5b4b8a] to-[#c77d9a] text-white font-semibold hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 disabled:opacity-70 transition-all"
                    >
                      {status === "loading" ? "Joining…" : "Join Waitlist →"}
                    </button>
                  </form>
                  {status === "success" && (
                    <p className="mt-4 text-sm text-[#16a34a] font-medium">{message}</p>
                  )}
                  {status === "error" && message && (
                    <p className="mt-4 text-sm text-[#dc2626]">{message}</p>
                  )}
                  <p className="mt-4 text-xs text-[#94a3b8]">By signing up, you agree to receive updates about Compass.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Compass - white/light bg, 2x2 feature grid */}
        <section id="about" className="bg-[#f9f9f9] py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1a2332] text-center mb-6">
              What is Compass?
            </h2>
            <p className="text-[#4a5568] text-center max-w-2xl mx-auto mb-6 leading-relaxed">
              Compass is a comprehensive career development platform that connects high school students and early careerists with real working professionals. We help you discover opportunities in an ever-changing career ecosystem—opportunities you might never have known existed.
            </p>
            <p className="text-[#4a5568] text-center max-w-2xl mx-auto mb-16 leading-relaxed italic">
              Your Compass is your guidance and navigation partner for your future career—whether you&apos;re sparking a passion and discovering your purpose, or simply exploring the unknown.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#e8e8e8] p-6 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#d4e4f7] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#2d5a87]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a2332] mb-2">Explore Career Paths</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed">
                  Browse through dozens of career options with detailed information on majors, skills, and what the work actually looks like.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#e8e8e8] p-6 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#e8ddf0] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#5a4a6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a2332] mb-2">Connect with Mentors</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed">
                  Connect with verified professionals who share their journey and answer your questions—no gatekeeping.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#e8e8e8] p-6 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#f0e4e8] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#6b4a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a2332] mb-2">Understand the Journey</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed">
                  Get day-in-the-life insights and understand what it really takes to succeed in each path.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#e8e8e8] p-6 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#d4f0e4] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#2d6b5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a2332] mb-2">Track Your Progress</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed">
                  Save careers, set goals, and see your exploration grow as you discover what fits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Don't choose a path blind */}
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1a2332] mb-8 leading-tight">
              Don&apos;t choose a path blind.
            </h2>
            <p className="text-lg text-[#4a5568] max-w-2xl mx-auto leading-relaxed">
              Compass helps you explore careers with real data—ROI, day-in-the-life insights, and direct access to professionals who can answer your questions.
            </p>
          </div>
        </section>

        {/* Why Compass is Different - 3 solid colored circles */}
        <section id="features" className="bg-[#f9f9f9] py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1a2332] text-center mb-4">
              Why Compass is Different
            </h2>
            <p className="text-[#4a5568] text-center max-w-xl mx-auto mb-16">
              We&apos;re not just another career quiz or job board. Compass provides real insights from real people.
            </p>
            <div className="grid md:grid-cols-3 gap-10 md:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#3b82f6] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a2332] mb-2">Real Professionals</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed">
                  Connect with verified professionals who share their journey and answer your questions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#8b5cf6] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a2332] mb-2">Comprehensive Information</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed">
                  Salary data, job outlook, and education costs—everything you need to make informed decisions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#ec4899] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a2332] mb-2">Designed for Young Learners</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed">
                  Built for high school students and early careerists navigating an ever-changing ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* We've been there narrative */}
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1a2332] mb-8 leading-tight">
              We&apos;ve been there.
            </h2>
            <p className="text-lg text-[#4a5568] leading-relaxed italic">
              You&apos;re 17 and everyone asks what you want to do forever. You pick a major, sign the form, and hope it works out. Compass gives you something better: clarity before you commit, and real people to guide the way.
            </p>
          </div>
        </section>

        {/* Explore the Platform - secondary CTA */}
        <section className="bg-[#f9f9f9] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1a2332] mb-4">
              Explore the Platform
            </h2>
            <p className="text-[#4a5568] mb-8 max-w-xl mx-auto">
              While we&apos;re still in development, you can explore a preview of what Compass will offer.
            </p>
            <button
              onClick={() => scrollTo("hero")}
              className="px-8 py-3.5 rounded-xl border-2 border-[#1a2332] bg-white text-[#1a2332] font-semibold hover:bg-[#1a2332] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1a2332]/30 focus:ring-offset-2 transition-all"
            >
              View Demo Platform →
            </button>
          </div>
        </section>

        {/* Ready to Find Your Path - gradient CTA */}
        <section className="bg-gradient-to-r from-[#5b4b8a] via-[#7c5c9e] to-[#c77d9a] py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-4">
              Ready to Find Your Path?
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Join hundreds of students who are already on the waitlist. Be the first to know when we launch.
            </p>
            <button
              onClick={() => scrollTo("hero")}
              className="px-8 py-3.5 rounded-full bg-white text-[#5b4b8a] font-semibold hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent transition-all"
            >
              Join Waitlist Now →
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a2332] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/80">
          <span className="font-semibold text-white">Compass</span>
          <p>© {new Date().getFullYear()} Compass. Helping students navigate their future.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
