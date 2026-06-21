const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/.htaccess");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("oauth");

    // Set global permalinks to resource.html style
    eleventyConfig.addGlobalData("permalink", () => {
        return (data) =>
            `${data.page.filePathStem}.${data.page.outputFileExtension}`;
    });

    // Remove .html from `page.url`
    eleventyConfig.addUrlTransform((page) => {
        if (page.url.endsWith(".html")) {
            return page.url.slice(0, -1 * ".html".length);
        }
    });

    eleventyConfig.addCollection("publishedDesign", function(collectionApi) {
        return collectionApi
            .getFilteredByGlob("src/content/design/*.md")
            .filter(item => item.data.publish !== false);
    });

    eleventyConfig.addCollection("publishedDesignMap", function(collectionApi) {

        const map = {};

        collectionApi
            .getFilteredByGlob("./src/content/design/*.md")
            .filter(item => item.data.publish !== false)
            .forEach(item => {
                map[item.fileSlug] = item;
            });

        return map;
    });

    eleventyConfig.addCollection("orderedPublishedDesign", function(collectionApi) {

        // Find the Design landing page
        const designPage = collectionApi
            .getFilteredByGlob("./src/content/design.md")[0];

        // Build a lookup table
        const projectMap = {};

        collectionApi
            .getFilteredByGlob("./src/content/design/*.md")
            .filter(item => item.data.publish !== false)
            .forEach(item => {
                projectMap[item.fileSlug] = item;
            });

        // Return the projects in the order specified by design.md
        return designPage.data.design_projects
            .map(slug => projectMap[slug])
            .filter(Boolean);

    });

    eleventyConfig.addCollection("pagesById", function(collectionApi) {
        const pages = {};

        collectionApi.getAll().forEach(item => {
            if (item.data.id) {
            pages[item.data.id] = item;
            }
        });

        return pages;
    });

    eleventyConfig.addFilter("findProjectIndex", function(projects, fileSlug) {
        return projects.findIndex(project => project.fileSlug === fileSlug);
    });

    const md = markdownIt({
        html: true,
        breaks: false,
        linkify: true
    });

    eleventyConfig.addFilter("markdown", content => {
        return md.render(content || "");
    });

    return {

    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    // Injects the Bluehost subfolder path prefix automatically
    // pathPrefix: "website_e1e2df13" 
  };
};