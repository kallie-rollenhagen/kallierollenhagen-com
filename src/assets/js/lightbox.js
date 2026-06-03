document.addEventListener("DOMContentLoaded", () => {
  // 1. Create the template structure programmatically
  const lightbox = document.createElement("div");
  lightbox.classList.add("lightbox-overlay");
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
      <svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 60 60'>
        <path d='M60 20 h-60 L30 55 v-11 L16 27 H100z' fill='#FAFAFA'>
      </svg>
    </button>
    <div class="lightbox-img-wrapper">
      <img src="" alt="">
      <div class="lightbox-caption"></div>
    </div>
    <button class="lightbox-nav lightbox-next" aria-label="Next image">
      <svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 60 60'>
        <path d='M0 20 h60 L30 55 v-11 L44 27 H0z' fill='#FAFAFA'>
      </svg>
    </button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  // Gather arrays of all available group images on the project page
  const triggers = Array.from(document.querySelectorAll(".lightbox-trigger"));
  
  // NOTE: Speaking of Closures! This index variable lives out here 
  // in the outer block so all the inner functions can change and track it!
  let currentIndex = 0; 

  // 2. Open function setup
  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden"; // Freeze background layout viewport scroll
  }

  // 3. Update Image Frame View Content State
  function updateLightboxContent() {
    const activeTarget = triggers[currentIndex];
    lightboxImg.src = activeTarget.src;
    lightboxImg.alt = activeTarget.alt;
    lightboxCaption.textContent = activeTarget.getAttribute("data-caption") || "";
  }

  // Navigation Logic Routines
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = ""; // Re-enable background page scroll
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % triggers.length; // Loop back to start if at end
    updateLightboxContent();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + triggers.length) % triggers.length; // Loop back to end if at start
    updateLightboxContent();
  }

  // 4. Event Listener Wire-up Bindings
  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => openLightbox(index));
  });

  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  // Close when clicking empty dark backdrop space safely
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector(".lightbox-img-wrapper")) {
      closeLightbox();
    }
  });

  // 5. Add Keyboard Accessibility Bindings
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});