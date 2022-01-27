import { join } from 'path';
import { build, BuildOptions, BuildResult } from 'esbuild';
import { globby } from 'globby';
import yargs from 'yargs/yargs';
import chokidar, { FSWatcher } from 'chokidar';

interface Watchers {
    src: FSWatcher;
}

const srcPath = join(process.cwd(), '/src');
const srcGlob = `${srcPath}/**/*.{ts,tsx,css}`;
const ignoreGlobs = [`!${srcPath}/build.ts`, `!${srcPath}/**/*test.ts`];

const sharedConfig: BuildOptions = {
    sourcemap: true,
    target: 'es6',
    tsconfig: 'tsconfig-build.json',
};

async function buildAll(watchers?: Watchers) {
    console.time('Built in');
    const files = await globby([srcGlob, ...ignoreGlobs]);
    let buildResult: BuildResult | undefined;

    async function doBuild() {
        if (buildResult) {
            buildResult = await buildResult.rebuild?.();
        } else {
            buildResult = await build({
                ...sharedConfig,
                entryPoints: files,
                outdir: 'dist',
                format: 'cjs',
                incremental: !!watchers,
            });
        }
    }

    try {
        await doBuild();
    } catch (error) {
        if (!watchers) throw error;
    }

    if (watchers) {
        watchers.src.on('all', () => {
            void (async () => {
                console.time('Rebuilt in');
                try {
                    await doBuild();
                } catch (_) {} // eslint-disable-line no-empty
                console.timeEnd('Rebuilt in');
            })();
        });
    }

    console.timeEnd('Built in');
}

interface Arguments {
    watch: boolean;
}

async function cli() {
    const args: Arguments = await yargs(process.argv.slice(2)).options({
        watch: { type: 'boolean', default: false },
    }).argv;

    if (args.watch) {
        const watchers: Watchers = {
            src: chokidar.watch([srcGlob], { ignoreInitial: true }),
        };
        await buildAll(watchers);
    } else {
        await buildAll();
    }
}

void cli();
