const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create the zip file
const output = fs.createWriteStream(path.join(__dirname, 'backend.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(`✓ Backend zipped successfully! (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`✓ File saved as: backend.zip`);
});

// Good practice to catch warnings during archiving
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

// Catch error explicitly
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files to zip, excluding node_modules and .env
console.log('🔄 Creating zip file...');
archive.glob('**/*', {
  cwd: __dirname,
  ignore: ['node_modules/**', '.env', 'backend.zip', 'zip-backend.js']
});

archive.finalize();
