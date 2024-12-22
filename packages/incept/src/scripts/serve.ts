//stackpress
import type Server from '@stackpress/ingest/dist/Server';

export default function serve(server: Server<any, any, any>) {
  //start the server
  server.create().listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('------------------------------');
  });
};