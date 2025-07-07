const path = require('path');
const fs = require('fs/promises');

const baseFolder = path.join(__dirname, 'baseFolder');

const createFoldersAndFiles = async () => {
    await fs.mkdir(baseFolder, { recursive: true });

    for (let i = 1; i <= 5; i++) {
        const folder = path.join(baseFolder, `folder${i}`);
        await fs.mkdir(folder, { recursive: true });

        for (let j = 1; j <= 5; j++) {
            const file = path.join(folder, `file${j}.txt`);
            await fs.writeFile(file, `Text 'Hello world' in file${j} of folder${i}`);
        }
    }
    await readRecursively(baseFolder);
};

const readRecursively = async (dirPath) => {
    try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);

            if (item.isDirectory()) {
                console.log(`${fullPath} → Folder`);
                await readRecursively(fullPath);
            } else if (item.isFile()) {
                console.log(`${fullPath} → File`);
            } else {
                console.log(`${fullPath} → Other`);
            }
        }
    } catch (err) {
        console.error(`${dirPath} → Error: ${err.message}`);
    }
};
void createFoldersAndFiles();