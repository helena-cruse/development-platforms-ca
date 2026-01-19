import { supabaseClient } from "./supabaseClient.js";

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorBox = document.getElementById("error");
const infoBox = document.getElementById("info");
const submitBtn = document.getElementById("submit-btn");

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function showInfo(message) {
  infoBox.textContent = message;
  infoBox.classList.remove("hidden");
}

function hideInfo() {
  infoBox.textContent = "";
  infoBox.classList.add("hidden");
}

const {
  data: { session },
} = await supabaseClient.auth.getSession();

if (session) {
  window.location.href = "index.html";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();
  hideInfo();

  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  submitBtn.disabled = false;
  submitBtn.textContent = "Log in";

  if (error) {
    const msg = String(error.message || "").toLowerCase();

    if (msg.includes("email not confirmed")) {
      showError(
        "Please confirm your email first. Check your inbox (and spam) and try again."
      );
      return;
    }

    if (msg.includes("invalid login credentials")) {
      showError("Wrong email or password. Please try again.");
      return;
    }

    showError(error.message || "Login failed. Please try again.");
    return;
  }

  showInfo("Logged in! Redirecting...");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 600);
});
