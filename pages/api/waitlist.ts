import type { NextApiRequest, NextApiResponse } from "next";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "compass";

function isAuthorized(req: NextApiRequest): boolean {
  const key = req.headers["x-admin-key"] ?? req.headers.authorization?.replace("Bearer ", "");
  return !!key && key === ADMIN_PASSWORD;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.status(200).json({
        signups: [],
        message: "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and keys to .env.local",
      });
    }
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("waitlist")
        .select("id, email, role, school, referral, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("[waitlist] Fetch error:", error);
        return res.status(500).json({ error: error.message, signups: [] });
      }
      return res.status(200).json({ signups: data ?? [] });
    } catch (err) {
      console.error("[waitlist] GET error:", err);
      return res.status(500).json({ error: "Failed to fetch signups", signups: [] });
    }
  }

  if (req.method === "POST") {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ROLES = ["Student", "Professor", "Mentor"] as const;
    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const role =
      typeof body.role === "string" && ROLES.includes(body.role as (typeof ROLES)[number])
        ? body.role
        : "Student";
    const school = typeof body.school === "string" ? body.school.trim() : undefined;
    const referral = typeof body.referral === "string" ? body.referral.trim() : undefined;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: existing } = await supabase
          .from("waitlist")
          .select("id")
          .eq("email", email.toLowerCase())
          .maybeSingle();
        if (existing) {
          return res.status(200).json({
            ok: true,
            message: "You're already on the list. We'll notify you when we launch.",
          });
        }
        const { error } = await supabase.from("waitlist").insert({
          email: email.toLowerCase(),
          role,
          school: school || null,
          referral: referral || null,
          created_at: new Date().toISOString(),
        });
        if (error) {
          if (error.code === "23505") {
            return res.status(200).json({
              ok: true,
              message: "You're already on the list. We'll notify you when we launch.",
            });
          }
          console.error("[waitlist] Supabase error:", error);
          return res.status(500).json({ error: "Something went wrong. Please try again." });
        }
        return res.status(200).json({
          ok: true,
          message: "You're on the list! We'll notify you when we launch.",
        });
      } catch (err) {
        console.error("[waitlist] Error:", err);
        return res.status(500).json({ error: "Something went wrong. Please try again." });
      }
    }

    console.log("[waitlist] Signup (no Supabase):", {
      email: email.toLowerCase(),
      role,
      school: school || null,
      referral: referral || null,
      created_at: new Date().toISOString(),
    });
    return res.status(200).json({
      ok: true,
      message: "You're on the list! We'll notify you when we launch.",
    });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
