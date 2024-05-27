const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(projectRoot, 'preBuild');
const outputZip = path.join(projectRoot, 'dist.zip');

async function zipDirectory(source, out) {
    const zip = new AdmZip();

    const addDirectory = (dir, basePath) => {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                addDirectory(fullPath, path.join(basePath, item));
            } else {
                zip.addLocalFile(fullPath, basePath);
            }
        });
    };

    addDirectory(source, '');
    zip.writeZip(out);
    console.log(`Zipping completed successfully: ${out}`);
    //await deleteAllFilesInDirectory(source);
    const destinationFilePath = path.join(projectRoot, 'dist/dist.zip');
    fs.rename(out, destinationFilePath, (err) => {
        if (err) {
            console.error(`Error moving file: ${err}`);
        } else {
            console.log(`File moved from ${out} to ${destinationFilePath}`);
        }
    });
    
}

// Função para garantir que o diretório de destino existe
function ensureDirectoryExists(dir) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

async function exec(sourceDir, outputZip){

    const destinationFilePath = path.join(projectRoot, 'dist');
    await ensureDirectoryExists(destinationFilePath);
    await zipDirectory(sourceDir, outputZip);
}

exec(sourceDir, outputZip);
