window.addEventListener('load', function() {
        requestAnimationFrame(function() {
            const cards = document.querySelectorAll('.project-card-wrapper');

            const observer = new IntersectionObserver((entries) => {
                // Filter to only the newly intersecting cards in this batch
                const visibleEntries = entries.filter(entry => entry.isIntersecting);
                entries.forEach(entry => {
                    console.log("Chrome check:", entry.target, entry.isIntersecting, entry.intersectionRatio);
                });
                
                visibleEntries.forEach((entry, batchIndex) => {
                    const card = entry.target.querySelector('.project-card');
                    card.style.setProperty('--delay', `${batchIndex * 0.1}s`);
                    card.classList.add('visible');
                    observer.unobserve(card);
                });
            }, {
                root: null,
                threshold: 0.3
            });

            cards.forEach(card => observer.observe(card));
        });
});