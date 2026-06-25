---
title: Wada Quilts
slug: wada-quilts
seoDescription: Project overview of a P5.js sketch to generate class quilt
  blocks using the colors of the Dictionary of Color
publish: true
roles_played: Concept & Design Direction
credits: []
project_description: >-
  Quilt block pattern generator that uses p5.js to sketch quilt block patterns. 


  ### Scope


  Trained and provided design direction to an LLM to create a single-point user input interaction using p5.js that generates and exports graphic elements. 


  ### Output

   In the quilt block generation embedded below, users can see randomized classic quilt blocks, either single blocks or a 4 by 4 grid. Users can also download images. Each quilt has three colors, based on the 3-color combination section of the Japanese *Dictionary of Color Combinations, Volume 2* by Sanzo Wada.
main_image:
  file: /assets/images/wada-quilt-grid-3-2.gif
  alt: Scrolling images of different quilt blocks, all in different colors and
    patterns
thumbnail_image:
  file: /assets/images/ohio-star-generated.png
  alt: Ohio quilt block, digitally rendered
gallery:
  lightbox: false
  type: grid
  rows:
    - layout: thirds
      elements:
        - type: image
          file: /assets/images/battleground-quilt-generated.png
          alt: battleground quilt block in many colors
        - type: image
          file: /assets/images/calico-puzzle-generated.png
          alt: calico puzzle quilt block
        - type: image
          file: /assets/images/ohio-star-generated.png
          alt: ohio star patch quilt block
      object_fit: cover
    - layout: right-wide
      elements:
        - type: text
          text: >-
            ### Background & Inspiration


            I’d been practicing color mixing, inspired by this cult favorite color dictionary. I wanted to use the outputs of this prompt to generate new patterns, inspired by classic quilt patterns. 


            My mother, grandmothers, and several of my friends are quilters. This project gave me a way to participate in creative quilting circles, just in another medium.
        - type: image
          file: /assets/images/inspiration.jpg
          alt: moodboard with barn quilt, sketchbook, and Sanzo Wada Dictionary of Colors
            Vol. 2
      object_fit: contain
    - layout: right-wide
      elements:
        - type: text
          text: >-
            ### Challenge: Pattern recognition 


            Anything that wasn’t a very simple geometric pattern was hard for both Gemini and ChatGPT to draw. This shows my attempts to prompt the LLMs, using both verbal prompts and image inputs.


            *Note: These outputs are from summer 2025.*
        - type: image
          file: /assets/images/challenges-web-block.jpg
          alt: grid of 3 rows and 5 columns showing the progression of block outputs
      object_fit: contain
    - object_fit: contain
      row_margin_bottom: large
      layout: full-width
      elements:
        - type: p5js
          sketch: wada-quilt-pattern.js
---
