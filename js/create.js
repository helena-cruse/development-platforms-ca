import { supabaseClient } from "./supabaseClient.js";

const form = document.getElementById("create-form");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const bodyInput = document.getElementById("body");
const imagesInput = document.getElementById("images");
const previewEl = document.getElementById("preview");
const submitBtn = document.getElementById("submit-btn");
const messageEl = document.getElementById("message");

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

function clearPreview() {
  previewEl.innerHTML = "";
  previewEl.classList.add("hidden");
}

function renderPreview(files) {
  clearPreview();
  if (!files.length) return;

  previewEl.classList.remove("hidden");

  files.forEach((file) => {
    const url = URL.createObjectURL(file);

    const card = document.createElement("div");
    card.className =
      "relative rounded overflow-hidden border border-zinc-200 bg-white aspect-video";

    const img = document.createElement("img");
    img.src = url;
    img.alt = "Selected image";
    img.className = "w-full h-full object-cover";

    const badge = document.createElement("div");
    badge.className =
      "absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate";
    badge.textContent = file.name;

    card.appendChild(img);
    card.appendChild(badge);
    previewEl.appendChild(card);
  });
}

const {
  data: { session },
} = await supabaseClient.auth.getSession();

if (!session) {
  window.location.href = "login.html";
}

imagesInput.addEventListener("change", () => {
  const files = Array.from(imagesInput.files || []);
  if (files.length > 10) {
    setMessage("Max 10 images allowed.", "error");
    imagesInput.value = "";
    clearPreview();
    return;
  }
  renderPreview(files);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = "Publishing...";

  const title = titleInput.value.trim();
  const category = categoryInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title || !category || !body) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Publish article";
    setMessage("Please fill in title, category, and story.", "error");
    return;
  }

  const files = Array.from(imagesInput.files || []);
  if (files.length > 10) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Publish article";
    setMessage("Max 10 images allowed.", "error");
    return;
  }

  const imageUrls = [];

  if (files.length) {
    setMessage("Uploading images...", "info");

    for (const file of files) {
      const fileExt = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("article-images")
        .upload(fileName, file, { upsert: false });

      if (uploadError) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Publish article";
        setMessage(uploadError.message, "error");
        return;
      }

      const { data } = supabaseClient.storage
        .from("article-images")
        .getPublicUrl(fileName);

      if (data?.publicUrl) imageUrls.push(data.publicUrl);
    }
  }

  const { error } = await supabaseClient.from("articles").insert({
    title,
    body,
    category,
    submitted_by: session.user.id,
    image_urls: imageUrls,
  });

  submitBtn.disabled = false;
  submitBtn.textContent = "Publish article";

  if (error) {
    setMessage(error.message, "error");
    return;
  }

  setMessage("Article published successfully!", "success");
  form.reset();
  clearPreview();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 700);
});
