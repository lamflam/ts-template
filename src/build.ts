import { join } from 'path';
import { createServer, ServerResponse } from 'http';
import { build, BuildOptions, BuildResult, Plugin, serve } from 'esbuild';
import { globby } from 'globby';
import yargs from 'yargs/yargs';
import chokidar, { FSWatcher } from 'chokidar';

interface Watchers {
    src: FSWatcher;
}

const srcPath = join(process.cwd(), '/src');
const srcGlob = `${srcPath}/**/*.{ts,tsx,css}`;

const sharedConfig: BuildOptions = {
    sourcemap: true,
    target: 'es6',
    tsconfig: 'tsconfig-build.json',
    entryPoints: [`src/index.tsx`],
    bundle: true,
    loader: {
        '.svg': 'file',
    },
};

async function buildAll(plugins: Plugin[], watchers?: Watchers) {
    console.time('Built in');
    let buildResult: BuildResult | undefined;

    async function doBuild() {
        if (buildResult) {
            buildResult = await buildResult.rebuild?.();
        } else {
            buildResult = await build({
                ...sharedConfig,
                outdir: 'dist',
                format: 'cjs',
                plugins,
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

async function serveAll(port: number, watchers: Watchers, plugins: Plugin[]) {
    const serveResult = await serve(
        {
            port,
            servedir: 'src',
            onRequest: ({ method, path, timeInMS }) => {
                console.log(`${method} ${path} ${timeInMS}ms`);
            },
        },
        {
            ...sharedConfig,
            banner: {
                js: ` (() => new EventSource("http://localhost:${port + 1}").onmessage = () => location.reload())();`,
            },
            outfile: 'src/index.js',
            plugins,
            incremental: true,
            write: false,
        }
    );

    const clients: ServerResponse[] = [];
    watchers.src.on('all', () => {
        clients.forEach((res) => res.write('data: update\n\n'));
        clients.length = 0;
    });

    createServer((req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            Connection: 'keep-alive',
        });
        return clients.push(res);
    }).listen(port + 1);

    console.log(`Listening on ${serveResult.host}:${port}`);
    return serveResult;
}

interface Arguments {
    port: number;
    watch: boolean;
}

async function cli() {
    const args: Arguments = await yargs(process.argv.slice(2)).options({
        port: { type: 'number', default: 9999 },
        watch: { type: 'boolean', default: false },
    }).argv;

    if (args.watch) {
        const watchers: Watchers = {
            src: chokidar.watch([srcGlob], { ignoreInitial: true }),
        };
        await serveAll(args.port, watchers, []);
        await buildAll([], watchers);
    } else {
        await buildAll([]);
    }
}

void cli();
