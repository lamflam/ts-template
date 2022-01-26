import { build, BuildOptions, OnLoadResult, Plugin, serve } from 'esbuild';
import { globby } from 'globby';

const sharedConfig: BuildOptions = {
    sourcemap: 'external',
    target: 'es6',
    tsconfig: 'tsconfig-build.json',
};

async function buildAll() {
    console.time('Built in');
    const files = await globby(['src/**/*.{ts,tsx,css}', '!src/build.ts', '!src/**/*test.ts']);
    const buildResult = await build({
        ...sharedConfig,
        entryPoints: files,
        outdir: 'dist',
        format: 'cjs',
    });

    console.timeEnd('Built in');
    return buildResult;
}

async function cli() {
    await buildAll();
}

void cli();
