const first = `&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-&#56;"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=&#49;.&#48;"&gt;
  &lt;meta http-equiv="X-UA-Compatible" content="ie=edge"&gt;
  &lt;title&gt;crxview &amp;vert; view-source alternative for mobile devices.&lt;/title&gt;
&lt;/head&gt;
&lt;style&gt;
  body {
    margin: &#48;;
  }
  &#35;editor {
    width: &#49;&#48;&#48;%;
    height: &#49;&#48;&#48;%;
  }
  .ace_mobile-menu { display: none !important }
&lt;/style&gt;
&lt;body&gt;
  &lt;div id="editor"&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/ace-builds@&#49;.&#51;&#55;.&#50;/src-min/ace.js"&gt;&lt;/script&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/ace-builds@&#49;.&#51;&#55;.&#50;/src-min/mode-html.js"&gt;&lt;/script&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/ace-builds@&#49;.&#51;&#55;.&#50;/src-min/theme-tomorrow_night_eighties.js"&gt;&lt;/script&gt;
&lt;script type="text/plain" id="editor-value"&gt;`;
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