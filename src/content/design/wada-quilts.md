---
title: Wada Quilts
slug: wada-quilts
seoDescription: Project overview of a p5.js sketch to generate class quilt
  blocks using the colors of Sanzo Wada's Dictionary of Color Combinations
publish: true
roles_played: User Interface Design | Creative Coding
credits: []
project_description: >-
  Quilt block pattern generator that uses p5.js to sketch quilt block patterns
  in a variety of colors. 


  ## Scope


  Create a user input interaction using p5.js that generates and exports graphic elements. Train and provide design direction to an LLM to help achieve desired outputs.


  ## Output


  In the quilt block generator embedded below, users can create randomized classic quilt blocks, either single blocks or a 4x4 grid. Users can also download images. Each quilt has three colors, based on the 3-color combinations in Sanzo Wada's Japanese *A Dictionary of Color Combinations, Volume 2.*
main_image:
  file: /assets/images/wada-quilts-new.gif
  alt: Scrolling images of different quilt blocks, all in different colors and
    patterns
thumbnail_image:
  file: /assets/images/thumbnail-3x2.jpg
  alt: grid of quilt blocks
gallery:
  lightbox: false
  type: grid
  rows:
    - layout: right-wide
      elements:
        - type: text
          text: >-
            ## Background & Inspiration


            I’d been [practicing color mixing,](https://kallierollenhagen.com/sketchbook) inspired by this cult favorite color dictionary. I wanted to use the outputs of this prompt to generate new patterns, inspired by classic quilt patterns. 


            My mother, grandmothers, and several of my friends are quilters. This project gave me a way to participate in creative quilting circles, just in another medium.
        - type: image
          file: /assets/images/inspiration.jpg
          alt: moodboard with barn quilt, sketchbook, and Sanzo Wada Dictionary of Colors
            Vol. 2
      object_fit: contain
    - object_fit: contain
      row_margin_bottom: large
      layout: full-width
      elements:
        - type: p5js
          sketch: wada-quilt-pattern.js
    - layout: right-wide
      elements:
        - type: text
          text: >-
            ## Challenge: Pattern Recognition 


            Anything that wasn’t a very simple geometric pattern was hard for both Gemini and ChatGPT to draw. Prompts were both verbal and image inputs. Ultimately, several blocks had to be manually coded.


            *Note: These outputs are from summer 2025.*
        - type: image
          file: /assets/images/challenges-web-block.jpg
          alt: grid of 3 rows and 5 columns showing the progression of block outputs
      object_fit: contain
    - object_fit: contain
      row_margin_bottom: null
      layout: halves
      elements:
        - type: image
          focal_x: 50
          focal_y: 50
          file: /assets/images/wada_quilt_combo_191_54-40-or-fight.png
          alt: 54-40 or fight quilt block, digitally rendered
        - type: image
          focal_x: 50
          focal_y: 50
          file: /assets/images/kallie-sketchbook-wada.jpg
          alt: 54-40 or fight quilt block, painted
---
