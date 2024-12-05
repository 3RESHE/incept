//common
import make from '../server';

async function serve() {
  const server = await make();
  //start the server
  server.create().listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('------------------------------');
  });
};

serve().catch(console.error);