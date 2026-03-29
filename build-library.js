const fs = require('fs');
const path = require('path');

const libraryDir = path.join(__dirname, 'library');
const templateFile = path.join(__dirname, 'index-template.html');
const outputFile = path.join(__dirname, 'index.html');

// 1. Read all HTML files from library
const files = fs.readdirSync(libraryDir).filter(f => f.endsWith('.html'));
const htmlMap = {};
files.forEach(f => {
  htmlMap[f] = fs.readFileSync(path.join(libraryDir, f), 'utf8');
});
console.log(`Read ${files.length} HTML files from library/`);

// 2. Build JSON, escape </ to prevent breaking <script> tags
const jsonData = JSON.stringify(htmlMap).replace(/<\//g, '<\\/');

// 3. Build the data script tag
const dataTag = '<script id="libraryData" type="application/json">' + jsonData + '<\/script>';

// 4. Read template and inject data tag at the slot
let html = fs.readFileSync(templateFile, 'utf8');
html = html.replace('<!--LIBRARY_DATA_SLOT-->', dataTag);

// 5. Write output
fs.writeFileSync(outputFile, html, 'utf8');
console.log(`Output: ${outputFile}`);
console.log(`Total size: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);

// 6. Verify
try {
  const block = html.match(/<script id="libraryData" type="application\/json">([\s\S]*?)<\/script>/);
  const parsed = JSON.parse(block[1].replace(/<\\\//g, '</'));
  console.log(`Verified: ${Object.keys(parsed).length} files embedded`);
  // Verify app script is clean
  const appStart = html.lastIndexOf('<script>');
  const appEnd = html.lastIndexOf('</script>');
  const appJS = html.substring(appStart + 8, appEnd);
  new Function(appJS);
  console.log(`App JS: VALID (${(appJS.length/1024).toFixed(1)} KB)`);
} catch(e) {
  console.error('Verification issue:', e.message);
}
