const weddingDate = new Date("2027-07-17T18:00:00-05:00");
const galleryImages = Array.from({ length: 20 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    src: `assets/gallery/gallery-${number}.jpg`,
    alt: `Jenna and Benjamin photo ${index + 1}`,
  };
});

const countdownRoot = document.querySelector("[data-countdown]");
const galleryGrid = document.querySelector("[data-gallery-grid]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const closeLightboxButton = document.querySelector("[data-lightbox-close]");
const prevButton = document.querySelector("[data-lightbox-prev]");
const nextButton = document.querySelector("[data-lightbox-next]");

let activeImageIndex = 0;

function updateCountdown() {
  if (!countdownRoot) return;

  const now = new Date();
  const distance = Math.max(0, weddingDate.getTime() - now.getTime());
  const seconds = Math.floor(distance / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  countdownRoot.querySelector("[data-days]").textContent = days;
  countdownRoot.querySelector("[data-hours]").textContent = hours;
  countdownRoot.querySelector("[data-minutes]").textContent = minutes;
  countdownRoot.querySelector("[data-seconds]").textContent = remainingSeconds;
}

function renderGallery() {
  if (!galleryGrid) return;

  const fragment = document.createDocumentFragment();
  galleryImages.forEach((image, index) => {
    const button = document.createElement("button");
    button.className = "gallery-item";
    button.type = "button";
    button.setAttribute("aria-label", `Open photo ${index + 1}`);
    button.addEventListener("click", () => openLightbox(index));

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = index < 8 ? "eager" : "lazy";

    button.appendChild(img);
    fragment.appendChild(button);
  });

  galleryGrid.appendChild(fragment);
}

function openLightbox(index) {
  activeImageIndex = index;
  updateLightboxImage();
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");
}

function updateLightboxImage() {
  const image = galleryImages[activeImageIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
}

function showPreviousImage() {
  activeImageIndex = (activeImageIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightboxImage();
}

function showNextImage() {
  activeImageIndex = (activeImageIndex + 1) % galleryImages.length;
  updateLightboxImage();
}

function closeMobileNav() {
  if (!mobileNav || !menuToggle) return;
  mobileNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}

closeLightboxButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", showPreviousImage);
nextButton.addEventListener("click", showNextImage);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPreviousImage();
  if (event.key === "ArrowRight") showNextImage();
});

renderGallery();
updateCountdown();
setInterval(updateCountdown, 1000);
