
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { PodCreate } from './podCreate';

export function registerRoutes(app: Koa) {

    const router = new KoaRouter();

    router.post("/pod", PodCreate)
//     router.get('/', async (ctx) => {
//         const welcomeText = 'Welcome to Koa!';
//         ctx.body = `<!DOCTYPE html>
// <html>
// <head>
//     <title>${welcomeText}</title>
// </head>
// <body>
//     <h1>${welcomeText}</h1>
// </body>
// </html>`;
//     });

    app.use(router.routes());
    app.use(router.allowedMethods());

}
