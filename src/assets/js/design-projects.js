window.addEventListener('load', function() {
    requestAnimationFrame(function() {
        const cards = document.querySelectorAll('.project-card');

        const observer = new IntersectionObserver((entries) => {
            // Filter to only the newly intersecting cards in this batch
            const visibleEntries = entries.filter(entry => entry.isIntersecting);
            
            visibleEntries.forEach((entry, batchIndex) => {
                entry.target.style.setProperty('--delay', `${batchIndex * 0.1}s`);
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.2
        });

        cards.forEach(card => observer.observe(card));
    });
});