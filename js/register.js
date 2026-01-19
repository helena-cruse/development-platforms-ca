import { supabaseClient } from "./supabaseClient.js";

const form = document.getElementById("register-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageEl = document.getElementById("message");
const submitBtn = document.getElementById("submit-btn");

function setMessage(text, type = "info") {
  messageEl.textContent = text;
  messageEl.classList.remove("hidden");

  if (type === "error") {
    messageEl.className =
      "mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-900";
    return;
  }

  if (type === "success") {
    messageEl.className =
      "mb-4 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900";
    return;
  }

  messageEl.className =
    "mb-4 rounded border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800";
}

const {
  data: { session },
} = await supabaseClient.auth.getSession();

if (session) {
  window.location.href = "index.html";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMessage("", "info");

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating account...";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login.html`,
    },
  });

  submitBtn.disabled = false;
  submitBtn.textContent = "Create account";

  if (error) {
    const msg = String(error.message || "").toLowerCase();

    if (msg.includes("password")) {
      setMessage("Password must be at least 6 characters.", "error");
      return;
    }

    if (msg.includes("already registered") || msg.includes("already")) {
      setMessage(
        "That email is already registered. Try logging in instead.",
        "error"
      );
      return;
    }

    setMessage(
      error.message || "Could not create account. Please try again.",
      "error"
    );
    return;
  }

  setMessage(
    "Account created! Check your email (and spam) to confirm your account before logging in.",
    "success"
  );

  form.reset();
});
