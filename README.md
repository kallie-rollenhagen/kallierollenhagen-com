# kallierollenhagen.com

This is the static site generator (SSG) that builds www.kallierollenhagen.com.

## Core tools

* **Eleventy**: The open source SSG that handles the templating and building of the site.
* **GitHub**: The online repository of the SSG codebase that builds the site.
* **Frontmatter**: The data defined at the top of the templates and pages.
* **Nunjucks**: The templating language that inserts the data into the pages.
* **Decap CMS**: The CMS layer that lets you edit the site within the browser.

## Organization of codebase

* **src**: All of the data and templates used to build the site.
    * **_data**: JSON files of data used by templates.
    * **_includes**: Reusable templates used to build pages.
        * **components**: Template blocks.
        * **layouts**: Templates that define overall layout of pages or sections of pages.
        * **partials**: Reusable blocks that appear the same way across the site.
    * **admin**: Manages the Decap CMS functionality.
    * **assets**: CSS, JavaScript, images, and fonts.
    * **content**: All page templates for the site.
    * **.htaccess**: File that tells server to leave the ".html" extensions out of the URL.
* Configuration
    * **eleventy.config.js**: Configurations for how Eleventy builds site.
    * **.eleventyignore**: List of files and directories that Eleventy ignores when building site.
    * **.gitignore**: List of files and directories that git ignores when creating snapshots of site.

## Publishing workflow

1. Edit any of the files in this codebase.
2. Run Eleventy to build the static site files in the "_site" directory.
3. Move the contents of the "_site" directory into the server.

## Decap CMS Authentication
* GitHub OAuth App
* Netlify project that imports the website repository
* Netlify Identity activated with GitHub OAuth client ID and secret
* Additional collaborators added to GitHub repo and invited via Netlify identity

## Editing with Decap CMS
## Editing with Code Editor

Testing GitHub Action

## Media Sizing
* Grid images
    * Aspect ration: 3w:2h
    * Format: AVIF
    * File size: 500-800KB maximum
    * Dimension: 2100x1400

ffmpeg -i input.tif \
-c:v libaom-av1 \
-vf "scale=2100:1400:flags=lanczos" \
-pix_fmt yuv444p \
-crf 15 \
-still-picture 1 \
output_1602.avif

## To do

* [ ] Design project hover overlays
* [ ] Mobile responsiveness
    * [ ] Mobile/accessibility for hover behaviors
* [ ] Incorporate Decap CMS
* [ ] Google Analytics tracking
* [ ] Standardize image requirements (size, resolution)