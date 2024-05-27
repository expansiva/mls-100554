const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'l5/compilezip');
const prefix = '_100554_';

fs.readdir(srcDir, async (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    if (file.startsWith(prefix)) {
      const oldPath = path.join(srcDir, file);
      const newPath = path.join(srcDir, file.replace(prefix, ''));
      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        console.log(`Renamed: ${oldPath} -> ${newPath}`);
      });
    }
  });
});