import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';
import navStructure from './nav-structure.json';
import csso from 'postcss-csso';
import fs from 'fs';

const generateInputs = async () => {
    const allFliles = await fs.promises.readdir(process.cwd());
    const htmlFiles = allFliles.filter(file => file.endsWith('.html'))
    const inputs = {};
    htmlFiles.forEach(file => {
        inputs[file.replace('.html', '').replaceAll('-', '_')] = resolve(__dirname, file);
    });
    return inputs;
}
const getPartnerLogos = async () => {
    const allFiles = await fs.promises.readdir(process.cwd() + '/img/partners');
    const filenames = [];
    allFiles.forEach((file) => filenames.push(file));
    return filenames;

}
const getAssetOutputPath = ((assetInfo) => {
    const ext = assetInfo.name.split('.').pop();
    switch (ext) {
        case 'css':
            return `css/${assetInfo.name}`;
        case 'svg':
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'webp':
        case 'ico':
            return `img/${assetInfo.name}`;
        case 'ttf':
        case 'woff':
        case 'woff2':
            return `webfonts/${assetInfo.name}`;
        default:
            return `${ext}/${assetInfo.name}`;
    }
})

export default defineConfig(async ({ command, mode }) => {
    return {
        optimizeDeps: { exclude: ["fsevents"] },
        css: {
            devSourcemap: true,
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "sass:map";
                        @use "sass:math";
                        @use "sass:list";
                        @import "./sass/global/_abstracts.scss";
                    `
                }
            },
            postcss: {
                plugins: [csso]
            }
        },
        plugins: [
            handlebars({
                partialDirectory: [resolve(__dirname, 'partials'), resolve(__dirname, 'wysiwyg/snippets')],
                context: {
                    siteTitle: 'Healthy State',
                    navItems: navStructure,
                    partnerLogos: await getPartnerLogos()
                },
                helpers: {
                    isString: (value) => (typeof value === 'string' || value instanceof String),
                    isThis: (value, test) => (value === test),
                    isNotThis: (value, test) => (value !== test),
                    hasProp: (obj, prop) => (obj.hasOwnProperty(prop)),
                    makeArr: (str) => str.split(', '),
                    getFirst: (str) => str.split(', ')[0],
                    getLast: (str) => str.split(', ').pop(),
                    getNavContext: (str) => {
                        const arr = str.split(', ')
                        return arr.reduce((acc, item) => acc[item].children, navStructure);
                    }
                }
            })
        ],
        build: {
            rollupOptions: {
                input: await generateInputs(),
                output: {
                    entryFileNames: `js/[name].js`,
                    chunkFileNames: `js/chunks/[name].js`,
                    assetFileNames: getAssetOutputPath,
                },
            },
        },
    }
}); 
