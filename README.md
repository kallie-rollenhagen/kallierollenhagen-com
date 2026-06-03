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


## To do

* [ ] Design project hover overlays
* [ ] Mobile responsiveness
    * [ ] Mobile/accessibility for hover behaviors
* [ ] Incorporate Decap CMS
* [ ] Google Analytics tracking
* [ ] Standardize image requirements (size, resolution)