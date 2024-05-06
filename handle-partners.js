import fs from 'fs';

(async () => {
    const allFiles = await fs.promises.readdir(process.cwd() + '/img/partners');
    allFiles.forEach(async (file) => {
        const newName = file.replace(/[_\s]/g, '-').toLowerCase();
        await fs.promises.rename(`img/partners/${file}`, `img/partners/${newName}`);
    });
})();