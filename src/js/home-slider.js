const slider = document.getElementById('home-slider');
const slides = Array.from(slider.querySelectorAll('.slide'));
let isAnimating = false
slider.addEventListener('mousemove', (e) => {
    const viewWidth = window.innerWidth;
    const mouseX = e.clientX;
    if (mouseX < viewWidth / 2) {
        // Cursor is on the left half: add left-arrow, clear right-arrow
        slider.classList.add('cursor-left');
        slider.classList.remove('cursor-right');
    } else {
        // Cursor is on the right half: add right-arrow, clear left-arrow
        slider.classList.add('cursor-right');
        slider.classList.remove('cursor-left');
    }
});
// Clean up: Reset to default cursor if the mouse leaves the slider viewport frame entirely
slider.addEventListener('mouseleave', () => {
    slider.classList.remove('cursor-left', 'cursor-right');
});
slider.addEventListener('click', (e) => {
    // 1. Calculate the indices
    var direction
    var nextIndex
    if (isAnimating) return;
    isAnimating = true;
    var currentSlide = slider.querySelector('.slide[data-active]');
    var currentIndex = slides.indexOf(currentSlide);
    var viewWidth = window.innerWidth;
    var clickX = e.clientX;
    if (clickX < viewWidth / 2) {
        direction = "prev"
        nextIndex = (currentIndex - 1 + slides.length) % slides.length
        console.log(`Clicked left: ${currentSlide}, ${currentIndex}, ${nextIndex}.`);
        slider.classList.add('cursor-left');
        slider.classList.remove('cursor-right');
        // navigatePrev()
    } else {
        direction = "next"
        nextIndex = (currentIndex + 1) % slides.length;
        console.log(`Clicked right: ${currentSlide.getAttribute('data-active')}, ${currentIndex}, ${direction   }, ${nextIndex}.`);
        slider.classList.add('cursor-right');
        slider.classList.remove('cursor-left');
        // navigateNext()
    }
    var targetSlide = slides[nextIndex]
    if (direction === "next") {
        targetSlide.classList.add("next-stage");
        console.log(`targetSlide to next-stage, ${targetSlide.getBoundingClientRect().left}, ${targetSlide.getBoundingClientRect().right}`)
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
    console.log(`currentSlide classes = ${currentSlide.classList}`)
    setTimeout(() => {
        currentSlide.classList.remove("exit-left", "exit-right");
        isAnimating = false;
        console.log(`timeout done: currentSlide position = ${targetSlide.getBoundingClientRect().left}, ${targetSlide.getBoundingClientRect().right}, classes = ${currentSlide.classList}`)
    }, 300);
    // currentIndex = nextIndex;
    // currentSlide = slider.querySelector('.slide[data-active]');
    // currentIndex = slides.indexOf(currentSlide);
    // console.log(`currentIndex = ${currentIndex}`)
});