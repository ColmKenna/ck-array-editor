import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/ck-array-editor/ck-array-editor.js',
      format: 'umd',
      name: 'WebComponentLibrary/ck-array-editor',
      sourcemap: true
    },
    {
      file: 'dist/ck-array-editor/ck-array-editor.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/ck-array-editor/ck-array-editor.min.js',
      format: 'umd',
      name: 'WebComponentLibrary/ck-array-editor',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    typescript({
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src'
    })
  ]
};

