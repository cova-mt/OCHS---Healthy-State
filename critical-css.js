import { generate } from 'critical';
import { mkdir, readdir, writeFile } from 'fs/promises';
const BASE = 'dist';
const OP = 'optimized';
const OUT = `${BASE}/${OP}`;
const generateCriticalCss = async file => {
    console.log('Generating critical css for', file);
    const { css, html, uncritical } = await generate({
        src: `${BASE}/${file}`,
        width: 1300,
        height: 900,
    });
    const replaceCSS = `
        <link rel="preload" href="/${OP}/css/${file.replace('.html', '')}-uncritical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <noscript><link rel="stylesheet" href="/${OP}/css/${file.replace('.html', '')}-uncritical.css"></noscript>
        <link rel="stylesheet" href="/${OP}/css/${file.replace('.html', '')}.css">
    
    `
    const removed = html.replace(/<link rel="stylesheet" href=".*">/g, '');
    const newHTML = removed.replace('</head>', `${replaceCSS}</head>`);
    await writeFile(`${OUT}/${file}`, newHTML)
    await writeFile(`${OUT}/css/${file.replace('.html', '.css')}`, css)
    await writeFile(`${OUT}/css/${file.replace('.html', '-uncritical.css')}`, uncritical)

}
const criticalCssSetup = async () => {
    await mkdir(OUT, { recursive: true })
    await mkdir(`${OUT}/css`, { recursive: true })
    const allFiles = await readdir(`./${BASE}`);
    const htmlFiles = allFiles.filter(file => file.endsWith('.html'))
    htmlFiles.forEach(generateCriticalCss);
}

criticalCssSetup()