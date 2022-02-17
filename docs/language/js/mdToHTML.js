"use strict";

marked.setOptions({
    renderer: new marked.Renderer(),
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });

function mdToHTML(mdString) {
    const htmlOutput = marked.parse(mdString);
    return htmlOutput;
}

export default mdToHTML;