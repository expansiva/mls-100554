const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(projectRoot, 'preBuild');
const outputZip = path.join(projectRoot, 'dist.zip');

/*async function deleteAllFilesInDirectory(directoryPath) {
    try {
        const files = await fs.promises.readdir(directoryPath);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const stat = await fs.promises.stat(filePath);

            if (stat.isFile()) {
                await fs.promises.unlink(filePath);
                console.log(`Deleted file: ${filePath}`);
            } else if (stat.isDirectory()) {
                // Recursively delete files in subdirectories (optional)
                await deleteAllFilesInDirectory(filePath);
                await fs.rmdir(filePath, (err) => {
                    if (err) {
                        console.error(`Error removing directory: ${err}`);
                    } else {
                        console.log(`Directory removed: ${filePath}`);
                    }
                });
            }
        }

        console.log(`All files in directory ${directoryPath} have been deleted.`);
    } catch (err) {
        console.error(`Error deleting files in directory ${directoryPath}:`, err);
    }
}*/


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

zipDirectory(sourceDir, outputZip);