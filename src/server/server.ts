
import * as path from 'path';

import * as Koa from 'koa';
import * as KoaBody from 'koa-bodyparser';

import { jsonLog } from 'koa-json-log';
import { config } from './config';
import { registerRoutes } from './routes';

const app = new Koa();

app.use(jsonLog());
app.use(KoaBody());

registerRoutes(app);

app.listen(config.port);

console.log(`Server is running at http://localhost:${config.port}/`);
