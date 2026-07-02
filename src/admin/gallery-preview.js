const observer = new MutationObserver(() => {
    const gallery = document.querySelector('div[id^="rows-field"]');

    if (!gallery) return;
    console.log(gallery);
    // const galleryLabel = document.querySelector('label[for^="rows-field"]');
    window.gallery = gallery;
    const rowsContainer = gallery.children[1];

    const rows = [...rowsContainer.children].filter(el =>
        el.className.includes("ListItem-listControlItem-SortableListItem")
    );

    console.log(`Found ${rows.length} rows`);

    for (const row of rows) {

        const images = row.querySelectorAll("img");
        console.log(images.length);
        // Prep the div for inserting thumbnails
        const row_header = row.querySelector(':scope > [class*="NestedObjectLabel"]');
        const preview = document.createElement("div");
        preview.className = "gallery-row-preview";

        row_header.appendChild(preview);
        
        if (images.length > 0) {
            images.forEach(img => {
                console.log(img.src);
                const thumb = img.cloneNode(); // clone only the <img>
                thumb.classList.add("gallery-row-thumb");
                preview.appendChild(thumb);
            });
        }


    }

    observer.disconnect();     // Stop watching

    // addGalleryPreviews(gallery);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
// const rowLabels = document.querySelectorAll("label");
    // .filter(label => label.textContent.trim() === "Rows");

// console.log(document.querySelectorAll("label"));