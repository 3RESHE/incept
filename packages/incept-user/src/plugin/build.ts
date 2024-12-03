//types
import type Builder from '@stackpress/ingest/dist/buildtime/Builder';
import path from 'path';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(builder: Builder) {
  //generate some code in the client folder
  builder.on('route', req => {
    builder.all('/auth/signin', path.join(__dirname, 'pages/signin'));
    builder.all('/auth/signin/email', path.join(__dirname, 'pages/signin'));
    builder.all('/auth/signin/phone', path.join(__dirname, 'pages/signin'));
    builder.all('/auth/signin/username', path.join(__dirname, 'pages/signin'));
    builder.all('/auth/signup', path.join(__dirname, 'pages/signup'));
    builder.all('/auth/signout', path.join(__dirname, 'pages/signout'));
  });
};