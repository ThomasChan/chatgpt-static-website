import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';
import mdHighlight from 'markdown-it-highlightjs';

export default function htmlString(message) {
  const md = MarkdownIt({
    linkify: true,
    breaks: true,
  }).use(mdKatex).use(mdHighlight);
  return md.render(message);
}
