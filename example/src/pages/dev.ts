import { entry } from '@stackpress/incept-ingest/dist/inkdev';
import { compiler, refresh, config } from '../boot';

export default entry({
  buildRoute: config.dev.buildRoute,
  socketRoute: config.dev.socketRoute,
  compiler, 
  refresh
});