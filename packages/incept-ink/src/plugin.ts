//modules
import path from 'node:path';
//stackpress
import type { CLIProps } from '@stackpress/idea-transformer/dist/types';
import type Transformer from '@stackpress/idea-transformer/dist/Transformer';
import type { IM, SR } from '@stackpress/ingest/dist/types';
import type Server from '@stackpress/ingest/dist/Server';
import RefreshServer from '@stackpress/ink-dev/dist/RefreshServer';
import ink, { cache } from '@stackpress/ink/compiler';
import { plugin as css } from '@stackpress/ink-css';
//local
import type {
  InkPlugin,
  TemplateDevConfig, 
  TemplateEngineConfig
} from './types';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(server: Server) {
  //on config, register template plugin
  server.on('config', req => {
    const server = req.context;
    const config = server.config.withPath;
    //get server environment
    const environment = config.get<string>('server.mode') || 'development';
    //get template engine config
    const { 
      cwd, 
      minify,
      brand = '', 
      clientPath, 
      serverPath,
      manifestPath
    } = config.get<TemplateEngineConfig>('template.config') || {};
    //get templates
    const templates = new Set(
      config.get<string[]>('template.templates') || []
    );
    //make a new refresh server
    const refresh = new RefreshServer({ cwd });
    //create ink compiler
    const compiler = ink({ brand, cwd, minify });
    //use ink css
    compiler.use(css());
    //use build cache
    if (environment !== 'development') {
      compiler.use(cache({ clientPath, serverPath, manifestPath }));
    }
    //common render function
    const render = function(
      filePath: string, 
      props: Record<string, unknown> = {}
    ) {
      if (!path.extname(filePath)) {
        filePath = `${filePath}.ink`;
      }
      if (environment === 'development') {
        refresh.sync(compiler.fromSource(filePath));
      }
      return compiler.render(filePath, props);
    };
    //add ink as a project plugin
    server.register('ink', { compiler, refresh, render, templates });
    //add renderer to the project
    server.register('template', { render, templates });
  });
  //on route, add dev routes
  server.on('route', req => {
    const server = req.context;
    const config = server.config.withPath;
    //get server environment
    const environment = config.get<string>('server.mode');
    //dont add dev routes if not in development mode
    if (environment !== 'development') return;
    const { compiler, refresh } = server.plugin<InkPlugin>('ink');
    const {
      buildRoute = '/build/client', 
      socketRoute = '/__ink_dev__'
    } = config.get<TemplateDevConfig>('template.config.dev') || {};
    server.all('/dev.js', function DevClient(req, res) {
      const script = compiler.fs.readFileSync(
        require.resolve('@stackpress/ink-dev/client.js'),
        'utf-8'
      );
      const id = 'InkAPI.BUILD_ID';
      const start = `;ink_dev.default(${id}, { path: '${socketRoute}' });`;
      res.setBody('text/javascript', script + start);
    });
    server.all(socketRoute, function SSE(req, res) {
      res.stop();
      res.setStatus(200);
      const response = res.resource as SR;
      response.statusCode = 200;
      response.statusMessage = 'OK';
      refresh.wait(req.resource as IM, response);
    });
    server.all(
      `${buildRoute}/:build`, 
      async function BuildAsset(req, res) {
        //get filename ie. abc123.js
        const filename = req.data<string>('build');
        //if no filename, let someone else handle it...
        if (!filename) return;
        //get asset
        const { type, content } = await compiler.asset(filename);
        //send response
        res.setBody(type, content);
      }
    );
    refresh.watch();
  });
  //on idea, generate components
  server.on('idea', req => {
    //get the transformer from the request
    const transformer = req.data<Transformer<CLIProps>>('transformer');
    //if no plugin object exists, create one
    if (!transformer.schema.plugin) {
      transformer.schema.plugin = {};
    }
    //add this plugin generator to the schema
    //so it can be part of the transformation
    transformer.schema.plugin['@stackpress/incept-ink/dist/transform'] = {};
  });
};