import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

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
			commonjs() // Converts CommonJS modules to ES6
		]
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
      terser() // Minify the output
    ]
  }
];

