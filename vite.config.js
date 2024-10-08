import { defineConfig } from 'vite';
import path from 'path';
import { terser } from 'rollup-plugin-terser';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/css/main.css',
          dest: '../styles',
          rename: 'fg-grid.css'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/js/index.js'),
      output: [{
        format: 'cjs',
        name: 'Fancy',
        entryFileNames: 'fg-grid.cjs.js',
        dir: 'dist',
        strict: false,
        banner: ``,
        footer: `
require('../styles/fg-grid.css');
        
module.exports = {
  Fancy,
  Grid: Fancy.Grid
};`
      },{
        format: 'cjs',
        name: 'Fancy',
        entryFileNames: 'fg-grid.cjs.min.js',
        dir: 'dist',
        strict: false,
        banner: ``,
        footer: `
require('../styles/fg-grid.css');
        
module.exports = {
  Fancy,
  Grid: Fancy.Grid
};`,
        plugins: [terser()]
      }, {
        format: 'cjs',
        name: 'Fancy',
        entryFileNames: 'fg-grid.esm.js',
        dir: 'dist',
        strict: false,
        banner: ``,
        footer: `
import '../styles/fg-grid.css';
        
const Fancy$100 = window.Fancy;
const Grid$200 = window.Fancy.Grid;

export {
  Fancy$100 as Fancy,
  Grid$200 as Grid
}`,
      },{
        format: 'cjs',
        name: 'Fancy',
        entryFileNames: 'fg-grid.esm.min.js',
        dir: 'dist',
        strict: false,
        banner: ``,
        footer: `
import '../styles/fg-grid.css';
        
const Fancy$100 = window.Fancy;
const Grid$200 = window.Fancy.Grid;

export {
  Fancy$100 as Fancy,
  Grid$200 as Grid
}`,
        plugins: [terser()]
      }]
    }
  }
});

