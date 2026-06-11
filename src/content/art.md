---
layout: layouts/art.njk
title: Art
permalink: /art.html
scripts:
  - "assets/js/swipe.js"
  - "assets/js/lightbox.js"
gallery:
    type: grid
    lightbox: true
    rows:
        - layout: "halves"
          elements:
            - type: image
              file: /assets/images/watercolor.jpg
              alt:
            - type: image
              file: /assets/images/0A9A5587.jpg
              alt:
        - layout: "thirds"
          elements:
            - type: image
              file: /assets/images/0A9A5628.jpg
              alt:
            - type: image
              file: /assets/images/0A9A5593.jpg
              alt:
            - type: image
              file: /assets/images/0A9A5595.jpg
              alt:
        - layout: "full-width"
          elements:
            - type: image
              file: /assets/images/0A9A5598.jpg
              alt:
---