const esbuild = require('esbuild');
//const path = require('path');
//const fs = require('fs').promises;
//const fs2 = require('fs');
//const ts = require('typescript');

// Função de configuração esbuild
async function build() {
  try {
    await esbuild.build({
      entryPoints: ['l2/**/*.ts'],
      outdir: 'preBuild/l2',
      platform: 'browser',
      target: 'es6',
      format: 'esm',
      sourcemap: false,
      bundle: false,
      //loader: { '.ts': 'ts' },
      logLevel: 'info',
      /*plugins: [
        {
          name: 'ts-decorators',
          setup(build) {
            build.onLoad({ filter: /\.ts$/ }, async (args) => {
              const source = await fs.readFile(args.path, 'utf8');
              const result = ts.transpileModule(source, {
                compilerOptions: {
                  target: ts.ScriptTarget.ES6,
                  module: ts.ModuleKind.ESNext,
                  experimentalDecorators: true,
                  emitDecoratorMetadata: true
                }
              });

              return {
                contents: result.outputText,
                loader: 'ts'
              };
            });
          }
        }
      ]*/
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

/*async function deleteZipFileSync(filePath) {

  fs2.access(filePath, fs2.constants.F_OK, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log(`File ${filePath} does not exist.`);
      } else {
        console.error(`Error checking file: ${err}`);
      }
      return;
    }

    fs2.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      } else {
        console.log(`File ${filePath} deleted successfully.`);
      }
    });
  });
}*/

async function exec() {
  //const projectRoot = path.resolve(__dirname, '..');
  //const sourceDir = path.join(projectRoot, 'dist/dist.zip');
  //await deleteZipFileSync(sourceDir);
  build();
}

exec();