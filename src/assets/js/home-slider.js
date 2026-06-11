const slider = document.getElementById('home-slider');
const slides = Array.from(slider.querySelectorAll('.slide'));
const customCursor = document.getElementById('slider-cursor');

let isAnimating = false

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
});