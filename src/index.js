const first = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>crxview &vert; view-source alternative for mobile devices.</title>
</head>
<style>
  body {
    margin: 0;
  }
  #editor {
    width: 100%;
    height: 100%;
  }
  .ace_mobile-menu { display: none !important }
</style>
<body>
  <div id="editor"></div>
</body>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.37.2/src-min/ace.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.37.2/src-min/mode-html.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.37.2/src-min/theme-tomorrow_night_eighties.js"></script>
<script type="text/plain" id="editor-value">`;
const last = `&lt;/script&gt;
&lt;script defer&gt;
  const value = document.getElementById("editor-value").textContent.trim();
  const editor = ace.edit("editor");
  editor.session.setMode("ace/mode/html");
  editor.setTheme("ace/theme/tomorrow_night_eighties");
  editor.session.setUseWorker(false);
  editor.setShowPrintMargin(false);
  editor.setReadOnly(true);
  editor.setValue(value);
&lt;/script&gt;
&lt;/html&gt;`;

function sanitize(input) {
  return input.replaceAll("&", "&amp;").replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji}/gu, (x) => `&#${x.codePointAt(0)};`).replace(/[^\x00-\x7F]/g, (x) => `&#${x.charCodeAt(0)};`).replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  if(req.url.length < 2) {
    res.statusCode = 400;
    res.end(`<p>400 Bad Request: No provided URL</p>`);
    return;
  }
  try {
    const f = await fetch(`https://creprox.vercel.app${req.url}`);
    const val = await f.text();
    res.statusCode = 200;
    res.end(first + sanitize(val) + last);
  } catch(e) {
    res.statusCode = 500;
    res.end(`<p>500 Internal Error: ${sanitize(e.stack)}</p>`);
  }
}