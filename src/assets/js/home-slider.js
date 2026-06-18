const slider = document.getElementById('home-slider');
const slides = Array.from(slider.querySelectorAll('.slide'));
const customCursor = document.getElementById('slider-cursor');

let isAnimating = false

function navigateNext() {
    if (isAnimating) return;

    const currentSlide = slider.querySelector('.slide[data-active]');
    const currentIndex = slides.indexOf(currentSlide);
    const nextIndex = (currentIndex + 1) % slides.length;

    transitionToSlide(currentSlide, slides[nextIndex], "next");
}

function navigatePrev() {
    if (isAnimating) return;

    const currentSlide = slider.querySelector('.slide[data-active]');
    const currentIndex = slides.indexOf(currentSlide);
    const nextIndex = (currentIndex - 1 + slides.length) % slides.length;

    transitionToSlide(currentSlide, slides[nextIndex], "prev");
}

function transitionToSlide(currentSlide, targetSlide, direction) {

    isAnimating = true;

    if (direction === "next") {
        targetSlide.classList.add("next-stage");
    } else {
        targetSlide.classList.add("prev-stage");
    }

    targetSlide.offsetWidth;

    targetSlide.classList.remove("next-stage", "prev-stage");
    targetSlide.setAttribute("data-active", "true");
    currentSlide.removeAttribute("data-active");

    if (direction === "next") {
        currentSlide.classList.add("exit-left");
    } else {
        currentSlide.classList.add("exit-right");
    }

    setTimeout(() => {
        currentSlide.classList.remove("exit-left", "exit-right");
        isAnimating = false;
    }, 300);
}

slider.addEventListener('mouseenter', (e) => {
    // customCursor.style.left = `${e.clientX}px`;
    // customCursor.style.top = `${e.clientY}px`;
    console.log("MOUSE ENTER")
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
    setDirection(e);
    customCursor.classList.add('visible');
});

slider.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;

    setDirection(e);
});

slider.addEventListener('mouseleave', () => {
    customCursor.classList.remove('visible');
    slider.classList.remove('cursor-left', 'cursor-right');
});
function setDirection(e) {
    const viewWidth = window.innerWidth;
    const mouseX = e.clientX;

    if (mouseX < viewWidth / 2) {

        customCursor.classList.add('left');
        customCursor.classList.remove('right');

        slider.classList.add('cursor-left');
        slider.classList.remove('cursor-right');
    } else {
        
        customCursor.classList.add('right');
        customCursor.classList.remove('left');

        slider.classList.add('cursor-right');
        slider.classList.remove('cursor-left');
    }
}

slider.addEventListener('click', (e) => {

    const viewWidth = window.innerWidth;

    if (e.clientX < viewWidth / 2) {
        navigatePrev();
    } else {
        navigateNext();
    }

});

// addSwipeNavigation(slider, {
//     onPrev: navigatePrev,
//     onNext: navigateNext
// });