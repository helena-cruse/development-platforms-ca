import { supabaseClient } from "./supabaseClient.js";

const breakingTextEl = document.getElementById("breaking-text");
const stateEl = document.getElementById("state");
const articleEl = document.getElementById("article");

const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");
const categoryEl = document.getElementById("category");
const dateEl = document.getElementById("date");
const heroEl = document.getElementById("hero");
const imagesEl = document.getElementById("images");

const latestMiniEl = document.getElementById("latest-mini");

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTime(dateStr) {
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return "";
  }
}

function getLead(text, max = 90) {
  const t = String(text ?? "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max).trim() + "…" : t;
}

function miniRowTemplate(article) {
  const href = `singlearticle.html?id=${encodeURIComponent(article.id)}`;
  const title = escapeHtml(article.title || "Untitled");
  const date = formatDateTime(article.created_at);

  return `
    <a href="${href}" class="block px-5 py-4 hover:bg-zinc-50">
      <h3 class="font-bold leading-snug hover:underline underline-offset-4">${title}</h3>
      <div class="mt-1 text-xs text-zinc-500">${date}</div>
    </a>
  `;
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  stateEl.innerHTML =
    "<p class='text-red-700 font-semibold'>Missing article id.</p><p class='text-sm text-zinc-600 mt-2'>Go back to the front page and select an article.</p>";
} else {
  const { data, error } = await supabaseClient
    .from("articles")
    .select("id, title, body, category, created_at, image_urls")
    .eq("id", id)
    .single();

  if (error || !data) {
    stateEl.innerHTML =
      "<p class='text-red-700 font-semibold'>Could not load the article.</p><p class='text-sm text-zinc-600 mt-2'>It may have been removed or the link is incorrect.</p>";
  } else {
    document.title = `${data.title || "Article"} | The Wire`;

    const cat = data.category || "News";
    const title = data.title || "Untitled";
    const body = data.body || "";

    categoryEl.textContent = cat;
    dateEl.textContent = formatDateTime(data.created_at);
    titleEl.textContent = title;
    bodyEl.textContent = body || "No story text provided.";

    breakingTextEl.textContent = title
      ? `Breaking: ${title}`
      : "Reading on The Wire";

    const urls = Array.isArray(data.image_urls) ? data.image_urls : [];

    if (urls.length) {
      heroEl.innerHTML = `<img src="${escapeHtml(
        urls[0]
      )}" alt="" class="w-full h-full object-cover" loading="lazy" />`;

      if (urls.length > 1) {
        imagesEl.classList.remove("hidden");
        imagesEl.innerHTML = urls
          .slice(1, 10)
          .map(
            (url) => `
              <div class="bg-zinc-100 rounded overflow-hidden border border-zinc-200">
                <img src="${escapeHtml(
                  url
                )}" alt="" class="w-full h-56 object-cover" loading="lazy" />
              </div>
            `
          )
          .join("");
      }
    }

    stateEl.classList.add("hidden");
    articleEl.classList.remove("hidden");
  }
}

async function loadLatestMini() {
  const { data, error } = await supabaseClient
    .from("articles")
    .select("id, title, created_at, body")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error || !data) {
    latestMiniEl.innerHTML =
      "<div class='p-4 text-sm text-red-700 font-semibold'>Could not load latest articles.</div>";
    return;
  }

  const filtered = id ? data.filter((a) => a.id !== id) : data;

  latestMiniEl.innerHTML = filtered.length
    ? filtered.slice(0, 5).map(miniRowTemplate).join("")
    : "<div class='p-4 text-sm text-zinc-600'>No articles yet.</div>";
}

loadLatestMini();
