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


    const checkingPaths = [
        path.join(__dirname, 'baseFolder'),
        path.join(__dirname, 'baseFolder', 'folder1', 'file1.txt'),
        path.join(__dirname, 'baseFolder', 'folder2', 'file2.txt'),
        path.join(__dirname, 'baseFolder', 'folder3'),
        path.join(__dirname, 'baseFolder', 'folder4', 'file4.txt'),
        path.join(__dirname, 'baseFolder', 'folder5'),
        path.join(__dirname, 'baseFolder', 'folder6','file6.txt'),
        ];


    for (const item of checkingPaths) {
        try {
            const stats = await fs.stat(item);
            const type = stats.isDirectory() ? 'Folder' : stats.isFile() ? 'File' : 'Other';
            console.log(`${item} → ${type}`);
        } catch (err) {
            console.log(`${item} → Not found`);
        }
    }

};

void createFoldersAndFiles();
