// 1. Identify your passive scrolling events
const scrollEvents = ['wheel', 'touchmove', 'pointermove'];

// 2. The function that cancels the scroll action
function preventDefaultScroll(e) {
  e.preventDefault();
}

// 3. Functions to turn the lock on and off
function lockBackgroundScroll() {
  scrollEvents.forEach(eventType => {
    // { passive: false } is CRITICAL. It tells the browser that 
    // preventDefault() will be called, allowing us to stop the scroll.
    window.addEventListener(eventType, preventDefaultScroll, { passive: false });
  });
}

function unlockBackgroundScroll() {
  scrollEvents.forEach(eventType => {
    window.removeEventListener(eventType, preventDefaultScroll);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector('body');
  const navContainer = document.querySelector('header nav');
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navContainer) return;

  toggleBtn.addEventListener('click', () => {
    navContainer.classList.add('animate');
    navLinks.style.setProperty('right', '0');
    navContainer.classList.toggle('menu-open');
    body.classList.add('body-menu-open')
  });

  navContainer.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'transform') {
      navContainer.classList.remove('animate');
      if (!navContainer.classList.contains('menu-open')) {
        navLinks.style.setProperty('right', '100vw');
        body.classList.remove('body-menu-open')
      }
      console.log('transition done!');
    }
  });

  // Optional: Auto-close the menu drawer if a user clicks an internal link choice
  //   const navLinks = navContainer.querySelectorAll('.nav-links a');
  //   navLinks.forEach(link => {
  //     link.addEventListener('click', () => {
  //       navContainer.classList.remove('menu-open');
  //     });
  //   });
});

const backToTop = document.getElementById("backToTop");
const header = document.querySelector("header");
const threshold = 60;
let lastScrollY = window.scrollY;

function handleScroll() {
  updateHeader();
  updateBackToTop();
}

function updateHeader() {
  const currentScrollY = window.scrollY;
  const diff = currentScrollY - lastScrollY;

  if (Math.abs(diff) < threshold)
    return;

  // Always show the header near the top
  if (currentScrollY < 20) {
    header.classList.remove("hidden");
  }

  // User is scrolling down
  else if (currentScrollY > lastScrollY) {
    header.classList.add("hidden");
  }

  // User is scrolling up
  else {
    header.classList.remove("hidden");
  }

  lastScrollY = currentScrollY;
}

function updateBackToTop() {
  const scrollTop = window.scrollY;

  const scrollHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  // Don't show on short pages
  if (scrollHeight < 1000) {
    backToTop.classList.remove("visible");
    return;
  }

  const percent = scrollTop / scrollHeight;

  if (percent > 0.30) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

window.addEventListener("scroll", () => {
  handleScroll();
});

backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});