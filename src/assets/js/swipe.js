function addSwipeNavigation(element, {
    onPrev,
    onNext,
    threshold = 50
}) {

    let startX = 0;
    let startY = 0;

    element.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    element.addEventListener("touchend", (e) => {

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // Ignore mostly vertical motions
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;

        if (Math.abs(deltaX) < threshold) return;

        if (deltaX > 0) {
            onPrev();
        } else {
            onNext();
        }

    }, { passive: true });
}