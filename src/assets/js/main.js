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

    console.log("TESTING");
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