import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

export default [
  {
    input: 'src/docu.js',
    output: {
      file: 'dist/docu.js',
      format: 'iife', // IIFE format for browser compatibility
      name: 'docu'
    },
    plugins: [
      resolve(), // Resolves node_modules
      commonjs(), // Converts CommonJS modules to ES6
      // browser compatibility stuff
      // babel({
      // 	babelHelpers: 'bundled',
      // 	presets: [
      //     ['@babel/preset-env', {
      //       targets: { ie: '11' }, // Target IE 11 specifically
      //       useBuiltIns: 'entry',
      //       corejs: 3
      //     }]
      // 	]
      // }),
    ],
    onwarn: (warning, warn) => {
      // Suppress circular dependency warnings
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
	return;
      }
      warn(warning);
    }
  },
  {
    input: 'src/docu.js',
    output: {
      file: 'dist/docu.min.js', // Minified output file
      format: 'iife', // IIFE format for browser compatibility
      name: 'docu'
    },
    plugins: [
      resolve(), // Resolves node_modules
      commonjs(), // Converts CommonJS modules to ES6
      // browser compatibility stuff
      // babel({
      // 	babelHelpers: 'bundled',
      // 	presets: [
      //     ['@babel/preset-env', {
      //       targets: { ie: '11' }, // Target IE 11 specifically
      //       useBuiltIns: 'entry',
      //       corejs: 3
      //     }]
      // 	]
      // }),
      terser(), // Minify the output
    ],
    onwarn: (warning, warn) => {
      // Suppress circular dependency warnings
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
	return;
      }
      warn(warning);
    }
  }
];

