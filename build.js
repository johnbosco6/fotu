const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectId = process.env.SANITY_PROJECT_ID || '1zncxuxn';
console.log('--- Sanity Build Process ---');
console.log('Project ID selected:', projectId);

// Files to update (folder is now studio-src)
const filesToUpdate = [
  path.join(__dirname, 'js', 'sanity.js'),
  path.join(__dirname, 'studio-src', 'sanity.config.js'),
  path.join(__dirname, 'studio-src', 'sanity.cli.js')
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

// Run NPM install and build for Sanity Studio
try {
  console.log('Installing studio dependencies...');
  execSync('npm install --legacy-peer-deps', { cwd: path.join(__dirname, 'studio-src'), stdio: 'inherit' });

  console.log('Building Sanity Studio...');
  execSync('npm run build', { cwd: path.join(__dirname, 'studio-src'), stdio: 'inherit' });

  const srcDist = path.join(__dirname, 'studio-src', 'dist');
  const destStudio = path.join(__dirname, 'studio');

  // Clean old destination if it exists
  if (fs.existsSync(destStudio)) {
    fs.rmSync(destStudio, { recursive: true, force: true });
  }

  // Recursive copy helper
  function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
      const fromPath = path.join(from, element);
      const toPath = path.join(to, element);
      if (fs.lstatSync(fromPath).isDirectory()) {
        copyFolderSync(fromPath, toPath);
      } else {
        fs.copyFileSync(fromPath, toPath);
      }
    });
  }

  console.log('Copying Studio build to deployment directory...');
  copyFolderSync(srcDist, destStudio);
  console.log('Studio successfully placed in deployment folder /studio');
} catch (error) {
  console.error('Error compiling Sanity Studio:', error);
  process.exit(1);
}

console.log('--- Build Process Completed ---');
