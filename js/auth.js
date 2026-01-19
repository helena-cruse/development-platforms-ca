import { supabaseClient } from "./supabaseClient.js";

const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const createLink = document.getElementById("create-link");
const logoutBtn = document.getElementById("logout-btn");

function updateNavbar(session) {
  if (!loginLink || !registerLink || !createLink || !logoutBtn) return;

  if (session) {
    loginLink.classList.add("hidden");
    registerLink.classList.add("hidden");
    createLink.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    loginLink.classList.remove("hidden");
    registerLink.classList.remove("hidden");
    createLink.classList.add("hidden");
    logoutBtn.classList.add("hidden");
  }
}

const {
  data: { session },
} = await supabaseClient.auth.getSession();

updateNavbar(session);

supabaseClient.auth.onAuthStateChange((_event, newSession) => {
  updateNavbar(newSession);
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });
}
