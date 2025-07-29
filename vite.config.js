import { defineConfig } from 'vite';
import path from 'path';
import { terser } from 'rollup-plugin-terser';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import CleanCSS from 'clean-css';

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
    }),
    {
      name: 'minify-css',
      closeBundle() {
        const cssPath = 'src/css/main.css';
        const distDir = 'styles';
        const outputPath = path.join(distDir, 'fg-grid.min.css');

        const css = fs.readFileSync(cssPath, 'utf-8');
        const minified = new CleanCSS().minify(css).styles;
        fs.writeFileSync(outputPath, minified);

        console.log('✅ CSS minified to ' + outputPath);
      }
    }
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
      },{
        format: 'cjs',
        name: 'Fancy',
        entryFileNames: 'fg-grid.js',
        dir: 'dist',
        strict: false,
        banner: `(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS-like environments
    exports["Fancy"] = factory();
  } else {
    // Browser globals (root is window)
    root["Fancy"] = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
`,
        footer: `
  return Fancy;
});`,
        globals: {
          window: 'self'
        }
      },{
        format: 'cjs',
        name: 'Fancy',
        entryFileNames: 'fg-grid.min.js',
        dir: 'dist',
        strict: false,
        banner: `(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS-like environments
    exports["Fancy"] = factory();
  } else {
    // Browser globals (root is window)
    root["Fancy"] = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
`,
        footer: `
  return Fancy;
});`,
        globals: {
          window: 'self'
        },
        plugins: [terser()]
      }]
    }
  }
});

