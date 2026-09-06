const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('frontend/src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // match 'http://127.0.0.1:8000...' or "http://..." or `http://...`
  // and replace with `${import.meta.env.VITE_API_BASE_URL}...`
  content = content.replace(/['"`]http:\/\/127\.0\.0\.1:8000([^'"`]+)['"`]/g, '`${import.meta.env.VITE_API_BASE_URL}$1`');
  
  fs.writeFileSync(f, content, 'utf8');
});
console.log("Done");
