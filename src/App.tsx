import { useState } from "react";
import "./App.css";

// Point to your main CareerCompass app when deployed
const PLATFORM_URL = import.meta.env.VITE_PLATFORM_URL || "/";

export default function App() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // TODO: Replace with your waitlist API endpoint
      // Example: await fetch("https://your-api.com/waitlist", { method: "POST", body: JSON.stringify({ email, name }) });
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setEmail("");
      setName("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-logo">
          <span className="landing-logo-icon">◆</span>
          <span>CareerCompass</span>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-hero">
          <h1>Find Your Path. Connect with Mentors.</h1>
          <p className="landing-subtitle">
            CareerCompass helps you explore careers, discover what fits, and connect with
            professionals who&apos;ve been there. Join the waitlist for early access.
          </p>
        </div>

        <div className="landing-form-card">
          {status === "success" ? (
            <div className="landing-success">
              <div className="landing-success-icon">✓</div>
              <h2>You&apos;re on the list!</h2>
              <p>We&apos;ll notify you when CareerCompass launches. In the meantime, explore careers and start your journey.</p>
              <a href={PLATFORM_URL} className="landing-cta-link" target={PLATFORM_URL.startsWith("http") ? "_blank" : undefined} rel={PLATFORM_URL.startsWith("http") ? "noopener noreferrer" : undefined}>
                Explore the Platform →
              </a>
            </div>
          ) : (
            <>
              <h2>Join the Waitlist</h2>
              <p className="landing-form-desc">Be the first to know when we launch.</p>
              <form onSubmit={handleSubmit} className="landing-form">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="landing-input"
                  autoComplete="email"
                />
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "loading"}
                  className="landing-input"
                  autoComplete="name"
                />
                {status === "error" && errorMessage && (
                  <p className="landing-error">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="landing-submit"
                >
                  {status === "loading" ? "Joining..." : "Join Waitlist"}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="landing-features">
          <div className="landing-feature">
            <span className="landing-feature-icon">🎯</span>
            <h3>Explore Careers</h3>
            <p>Discover paths that match your interests and goals.</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon">🤝</span>
            <h3>Find Mentors</h3>
            <p>Connect with professionals who can guide your journey.</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon">📊</span>
            <h3>Track Progress</h3>
            <p>Save careers, set goals, and see your exploration grow.</p>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} CareerCompass. All rights reserved.</p>
      </footer>
    </div>
  );
}
