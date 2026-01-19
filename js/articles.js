import { supabaseClient } from "./supabaseClient.js";

const topStoryEl = document.getElementById("top-story");
const latestListEl = document.getElementById("latest-list");
const breakingTextEl = document.getElementById("breaking-text");
const updatedAtEl = document.getElementById("updated-at");

const techGrid = document.getElementById("tech-grid");
const sportsGrid = document.getElementById("sports-grid");
const cultureGrid = document.getElementById("culture-grid");

const techCards = document.getElementById("tech-cards");
const sportsCards = document.getElementById("sports-cards");
const cultureCards = document.getElementById("culture-cards");

const frontGridEl = document.getElementById("front-grid");
const frontGridTitleEl = document.getElementById("front-grid-title");

if (
  !topStoryEl ||
  !latestListEl ||
  !breakingTextEl ||
  !updatedAtEl ||
  !frontGridEl ||
  !frontGridTitleEl
) {
  throw new Error("Index elements missing");
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return "";
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getLead(text, max = 160) {
  const t = String(text ?? "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max).trim() + "…" : t;
}

function getImageUrl(article) {
  const urls = Array.isArray(article.image_urls) ? article.image_urls : [];
  return urls.length ? urls[0] : "";
}

function topStoryTemplate(article) {
  const img = getImageUrl(article);
  const lead = getLead(article.body, 190);
  const cat = escapeHtml(article.category || "News");
  const title = escapeHtml(article.title || "Untitled");
  const date = formatDate(article.created_at);
  const href = `singlearticle.html?id=${encodeURIComponent(article.id)}`;

  return `
    <a href="${href}" class="group block">
      <div class="relative">
        ${
          img
            ? `<img src="${escapeHtml(
                img
              )}" alt="" class="w-full h-64 sm:h-72 object-cover" loading="lazy" />`
            : `<div class="w-full h-64 sm:h-72 bg-gradient-to-br from-zinc-900 via-red-700 to-zinc-200"></div>`
        }
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-flex items-center bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">${cat}</span>
            <span class="text-xs text-white/80">${date}</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight group-hover:underline underline-offset-4">
            ${title}
          </h3>
        </div>
      </div>
      <div class="p-5">
        <p class="text-zinc-700 leading-relaxed">${escapeHtml(lead)}</p>
      </div>
    </a>
  `;
}

function latestRowTemplate(article) {
  const href = `singlearticle.html?id=${encodeURIComponent(article.id)}`;
  const title = escapeHtml(article.title || "Untitled");
  const cat = escapeHtml(article.category || "News");
  const date = formatDate(article.created_at);
  const lead = getLead(article.body, 120);

  return `
    <a href="${href}" class="block px-5 py-4 hover:bg-zinc-50">
      <div class="flex items-center gap-2 text-xs mb-1">
        <span class="font-semibold text-red-700">${cat}</span>
        <span class="text-zinc-400">•</span>
        <span class="text-zinc-500">${date}</span>
      </div>
      <h4 class="font-bold leading-snug hover:underline underline-offset-4">${title}</h4>
      <p class="text-sm text-zinc-700 mt-1">${escapeHtml(lead)}</p>
    </a>
  `;
}

function frontCardTemplate(article) {
  const href = `singlearticle.html?id=${encodeURIComponent(article.id)}`;
  const title = escapeHtml(article.title || "Untitled");
  const date = formatDate(article.created_at);
  const lead = getLead(article.body, 80);
  const cat = escapeHtml(article.category || "News");

  return `
    <a href="${href}" class="group block rounded border border-zinc-200 p-3 hover:bg-zinc-50">
      <div class="flex items-center gap-2 text-[11px] mb-2">
        <span class="font-semibold text-red-700">${cat}</span>
        <span class="text-zinc-400">•</span>
        <span class="text-zinc-500">${date}</span>
      </div>
      <h4 class="font-extrabold leading-snug group-hover:underline underline-offset-4">${title}</h4>
      <p class="text-sm text-zinc-700 mt-2">${escapeHtml(lead)}</p>
    </a>
  `;
}

function miniCardTemplate(article) {
  const href = `singlearticle.html?id=${encodeURIComponent(article.id)}`;
  const title = escapeHtml(article.title || "Untitled");
  const date = formatDate(article.created_at);

  return `
    <a href="${href}" class="block rounded border border-zinc-200 p-3 hover:bg-zinc-50">
      <h4 class="font-bold leading-snug hover:underline underline-offset-4">${title}</h4>
      <div class="mt-2 text-xs text-zinc-500">${date}</div>
    </a>
  `;
}

function sectionCardTemplate(article) {
  const img = getImageUrl(article);
  const href = `singlearticle.html?id=${encodeURIComponent(article.id)}`;
  const title = escapeHtml(article.title || "Untitled");
  const date = formatDate(article.created_at);
  const lead = getLead(article.body, 90);

  return `
    <a href="${href}" class="group block rounded border border-zinc-200 overflow-hidden hover:bg-zinc-50">
      <div class="grid grid-cols-5">
        <div class="col-span-2">
          ${
            img
              ? `<img src="${escapeHtml(
                  img
                )}" alt="" class="w-full h-full object-cover min-h-[92px]" loading="lazy" />`
              : `<div class="w-full h-full min-h-[92px] bg-gradient-to-br from-zinc-900 via-red-700 to-zinc-200"></div>`
          }
        </div>
        <div class="col-span-3 p-3">
          <h4 class="font-extrabold leading-snug group-hover:underline underline-offset-4">${title}</h4>
          <p class="text-sm text-zinc-700 mt-1">${escapeHtml(lead)}</p>
          <div class="mt-2 text-xs text-zinc-500">${date}</div>
        </div>
      </div>
    </a>
  `;
}

function normalizeCategory(cat) {
  const c = String(cat || "")
    .trim()
    .toLowerCase();
  if (c === "tech") return "tech";
  if (c === "sports") return "sports";
  if (c === "culture") return "culture";
  return "other";
}

async function loadArticles() {
  const { data, error } = await supabaseClient
    .from("articles")
    .select("id, title, body, category, created_at, image_urls")
    .order("created_at", { ascending: false });

  if (error) {
    topStoryEl.innerHTML =
      "<div class='p-5'><p class='text-red-700 font-semibold'>Could not load articles.</p></div>";
    latestListEl.innerHTML =
      "<div class='p-5'><p class='text-red-700 font-semibold'>Could not load articles.</p></div>";
    frontGridEl.innerHTML =
      "<div class='p-5'><p class='text-red-700 font-semibold'>Could not load articles.</p></div>";
    return;
  }

  if (!data || data.length === 0) {
    topStoryEl.innerHTML =
      "<div class='p-6'><p class='text-zinc-700'>No articles yet. Create one to get started.</p></div>";
    latestListEl.innerHTML =
      "<div class='p-6'><p class='text-zinc-700'>Nothing to show yet.</p></div>";
    frontGridEl.innerHTML =
      "<div class='p-6'><p class='text-zinc-700'>Nothing to show yet.</p></div>";
    techGrid.innerHTML =
      "<p class='text-sm text-zinc-600'>No tech articles.</p>";
    sportsGrid.innerHTML =
      "<p class='text-sm text-zinc-600'>No sports articles.</p>";
    cultureGrid.innerHTML =
      "<p class='text-sm text-zinc-600'>No culture articles.</p>";
    techCards.innerHTML =
      "<p class='text-sm text-zinc-600'>No tech articles.</p>";
    sportsCards.innerHTML =
      "<p class='text-sm text-zinc-600'>No sports articles.</p>";
    cultureCards.innerHTML =
      "<p class='text-sm text-zinc-600'>No culture articles.</p>";
    return;
  }

  const top = data[0];
  topStoryEl.innerHTML = topStoryTemplate(top);

  breakingTextEl.textContent = top.title
    ? `Breaking: ${top.title}`
    : "Breaking updates from The Wire";

  updatedAtEl.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const front = data.slice(1, 4);
  frontGridTitleEl.textContent = "More top stories";
  frontGridEl.innerHTML = front.length
    ? front.map(frontCardTemplate).join("")
    : "<div class='text-sm text-zinc-600'>No more stories yet.</div>";

  latestListEl.innerHTML = data.slice(0, 8).map(latestRowTemplate).join("");

  const buckets = { tech: [], sports: [], culture: [] };
  for (const a of data) {
    const key = normalizeCategory(a.category);
    if (key in buckets) buckets[key].push(a);
  }

  const tech = buckets.tech.slice(0, 3);
  const sports = buckets.sports.slice(0, 3);
  const culture = buckets.culture.slice(0, 3);

  techGrid.innerHTML = tech.length
    ? tech.map(miniCardTemplate).join("")
    : "<p class='text-sm text-zinc-600'>No tech articles.</p>";
  sportsGrid.innerHTML = sports.length
    ? sports.map(miniCardTemplate).join("")
    : "<p class='text-sm text-zinc-600'>No sports articles.</p>";
  cultureGrid.innerHTML = culture.length
    ? culture.map(miniCardTemplate).join("")
    : "<p class='text-sm text-zinc-600'>No culture articles.</p>";

  techCards.innerHTML = tech.length
    ? tech.map(sectionCardTemplate).join("")
    : "<p class='text-sm text-zinc-600'>No tech articles.</p>";
  sportsCards.innerHTML = sports.length
    ? sports.map(sectionCardTemplate).join("")
    : "<p class='text-sm text-zinc-600'>No sports articles.</p>";
  cultureCards.innerHTML = culture.length
    ? culture.map(sectionCardTemplate).join("")
    : "<p class='text-sm text-zinc-600'>No culture articles.</p>";
}

loadArticles();
