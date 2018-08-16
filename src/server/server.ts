
import * as path from 'path';

import * as Koa from 'koa';
import * as KoaBody from 'koa-bodyparser';
import * as https from 'https';

import { jsonLog } from 'koa-json-log';
import { config } from './config';
import { registerRoutes } from './routes';

const app = new Koa();

app.use(jsonLog());
app.use(KoaBody());

registerRoutes(app);
app.listen(config.port);
// const options = {
//     key: config.key,
//     cert: config.cert,
//     port: config.port,
// };

// try {
//     var httpsServer = https.createServer(options, app.callback());
//     httpsServer
//         .listen(config.port, function (err:any) {
//             if (!!err) {
//                 console.error('HTTPS server FAIL: ', err, (err && err.stack));
//             }
//             else {
//                 console.log(`HTTPS server running`);
//             }
//         });
// }
// catch (ex) {
//     console.error('Failed to start HTTPS server\n', ex, (ex && ex.stack));
// }
// https.createServer(options, app.callback()).listen(443);

console.log(`Server is running at http://localhost:${config.port}/`);
