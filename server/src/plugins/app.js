import { setupLibs } from './lib';
import { setupSocket, setupSocketV2 } from './socket';
import router from '@/routes';

export const setupApp = (app, server) => {
  // setup libs
  setupLibs(app);

  // setup socket
  setupSocket(server);
  setupSocketV2(server);

  // register routes
  router(app);
};
