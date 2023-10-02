import { HelloWorld } from '@/controllers';

import { errorHandle } from '@/middlewares';

const router = (app) => {
  // say hello world
  app.get('/', HelloWorld);

  // handle errors
  app.use(errorHandle);
};

export default router;
