import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient("https://YOUR_PROJECT_ID.supabase.co", "YOUR_SUPABASE_PUBLIC_ANON_KEY");

// Optional: verify Turnstile (you can later move this to a Supabase Edge Function or backend route)
async function verifyTurnstile(token) {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: "YOUR_TURNSTILE_SECRET_KEY",
      response: token,
    }),
  });
  const data = await response.json();
  return data.success;
}

async function handleAuth(action) {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const token = document.querySelector('[name="cf-turnstile-response"]').value;

  if (!(await verifyTurnstile(token))) {
    alert("Captcha failed, please try again.");
    return;
  }

  let result;
  if (action === "login") {
    result = await supabase.auth.signInWithPassword({ email, password });
  } else {
    result = await supabase.auth.signUp({ email, password });
  }

  if (result.error) {
    alert(result.error.message);
  } else {
    localStorage.setItem("titherUser", JSON.stringify(result.data.user));
    window.location.href = "/app/index.html";
  }
}

document.getElementById("loginBtn").addEventListener("click", () => handleAuth("login"));
document.getElementById("signupBtn").addEventListener("click", () => handleAuth("signup"));
