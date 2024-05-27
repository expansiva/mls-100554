const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'l2');
const destDir = path.join(__dirname, 'prel2');
const prefix = '_100554_';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

async function deleteAllFilesInDirectory(directoryPath) {
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
            }
        }

        console.log(`All files in directory ${directoryPath} have been deleted.`);
    } catch (err) {
        console.error(`Error deleting files in directory ${directoryPath}:`, err);
    }
}

fs.readdir(srcDir, async (err, files) => {
    if (err) throw err;

    await deleteAllFilesInDirectory(destDir)

    files.forEach(file => {
        if (file.endsWith('.ts')) {
            const oldPath = path.join(srcDir, file);
            const newPath = path.join(destDir, prefix + file);
            fs.copyFile(oldPath, newPath, (err) => {
                if (err) throw err;
                console.log(`Renamed: ${oldPath} -> ${newPath}`);
            });
        }
    });
});