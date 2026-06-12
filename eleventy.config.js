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