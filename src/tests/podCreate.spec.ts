
import { PodCreate } from '../server/podCreate';
import * as KoaRouter from 'koa-router';
import { expect } from 'chai';
import 'mocha';
import * as fs from 'fs';
// import { request } from "https";

function newMockContext() : KoaRouter.IRouterContext {
    return <KoaRouter.IRouterContext>{
        request: {
            body: {},
        },
        response: {
            body: {},
        }
    };
}

describe('PodCreate', () => {
    it('shouldMutatePodImage', async () => {
        var context = newMockContext()
        context.request.body = JSON.parse(fs.readFileSync('./src/tests/data/podCreateMutate.json', 'utf8'));
        console.log(context.body);
        const response = await PodCreate(context)

        const expectedResponse = JSON.parse(fs.readFileSync('./src/tests/data/podCreateMutate_response.json', 'utf8'));
        expect(context.body).to.deep.equal(expectedResponse);
    });

    it('shouldNOTMutatePodImage', async () => {
        var context = newMockContext()
        context.request.body = JSON.parse(fs.readFileSync('./src/tests/data/podCreateIgnore.json', 'utf8'));
        console.log(context.body);
        const response = await PodCreate(context)

        const expectedResponse = JSON.parse(fs.readFileSync('./src/tests/data/podCreateIgnore_response.json', 'utf8'));
        expect(context.body).to.deep.equal(expectedResponse);
    });

});