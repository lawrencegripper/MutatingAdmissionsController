
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { PodCreate } from './podCreate';

export function registerRoutes(app: Koa) {

    const router = new KoaRouter();

    router.post("/pod", PodCreate)

    app.use(router.routes());
    app.use(router.allowedMethods());

}
