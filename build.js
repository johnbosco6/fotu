const fs = require('fs');
const path = require('path');

const projectId = process.env.SANITY_PROJECT_ID || '1zncxuxn';
console.log('--- Sanity Build Process ---');
console.log('Project ID selected:', projectId);

const filesToUpdate = [
  path.join(__dirname, 'js', 'sanity.js'),
  path.join(__dirname, 'studio', 'sanity.config.js'),
  path.join(__dirname, 'studio', 'sanity.cli.js')
];

filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('BUILD_PLACEHOLDER_PROJECT_ID')) {
      content = content.replace(/BUILD_PLACEHOLDER_PROJECT_ID/g, projectId);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Successfully injected Project ID into: ${filePath}`);
    } else {
      console.log(`Placeholder not found or already replaced in: ${filePath}`);
    }
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('--- Build Process Completed ---');
