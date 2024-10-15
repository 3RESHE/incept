import path from 'path';
import http from '@stackpress/ingest/http';

const server = http({ minify: false });

const resolve = (model: string, page: string) => {
  return path.resolve(__dirname, `pages/${model}/${page}`);
}

const routes = (root: string, model: string) => {
  if (process.env.SERVER_ENV === 'development') {
    server.all('/dev.js', path.resolve(__dirname, 'pages/dev'));
    server.all('/__ink_dev__', path.resolve(__dirname, 'pages/dev'));
    server.all('/build/client/:build', path.resolve(__dirname, 'pages/build'));
  }
  server.all(`/${root}/${model}/search`, resolve(model, 'search'));
  server.all(`/${root}/${model}/create`, resolve(model, 'create'));
  server.all(`/${root}/${model}/detail/:id`, resolve(model, 'detail'));
  server.all(`/${root}/${model}/update/:id`, resolve(model, 'update'));
  server.all(`/${root}/${model}/remove/:id`, resolve(model, 'remove'));
  server.all(`/${root}/${model}/restore/:id`, resolve(model, 'restore'));
};

routes('admin', 'profile');

export default server;