"use strict";

import language from './hljs_robotscript.js';

hljs.registerLanguage('robotscript', language);

marked.setOptions({
    baseUrl: null, // A prefix url for any relative link.
    breaks: false, // If true, add <br> on a single line break (copies GitHub behavior on comments, but not on rendered markdown files). Requires gfm be true.
    gfm: true, // default true
    headerIds: true, // If true, include an id attribute when emitting headings (h1, h2, h3, etc).
    headerPrefix: '', // A string to prefix the id attribute when emitting headings (h1, h2, h3, etc).
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }, // A function to highlight code blocks
    langPrefix: 'hljs language-', // 	A string to prefix the className in a <code> block, highlight.js css expects a top-level 'hljs' class.
    mangle: true, // If true, autolinked email address is escaped with HTML character references.
    pedantic: false, // If true, conform to the original markdown.pl as much as possible. Don't fix original markdown bugs or behavior. Turns off and overrides gfm.
    sanitize: false,
    sanitizer: null,
    smartLists: true,
    smartypants: false,
    xhtml: false
});

function mdToHTML(mdString) {
    const htmlOutput = marked.parse(mdString);
    return htmlOutput;
}

export default mdToHTML;