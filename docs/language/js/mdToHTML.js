"use strict";

import language from './hljs_robotscript.js'
hljs.registerLanguage('robotscript', language);

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    headerIds: true,
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