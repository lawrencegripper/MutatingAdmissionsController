
import { objectCreate } from '../server/objectCreate';
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

describe('DeploymentCreate', () => {
    it('shouldMutatePodImage', async () => {
        var context = newMockContext()
        context.request.body = JSON.parse(fs.readFileSync('./src/tests/data/deploymentCreateMutate.json', 'utf8'));
        const response = await objectCreate(context)

        const expectedResponse = JSON.parse(fs.readFileSync('./src/tests/data/deploymentCreateMutate_response.json', 'utf8'));
        expect(context.body).to.deep.equal(expectedResponse);
    });

    it('shouldNotMutatePodImage', async () => {
      var context = newMockContext()
      context.request.body = JSON.parse(fs.readFileSync('./src/tests/data/deploymentCreateDontMutate.json', 'utf8'));
      const response = await objectCreate(context)

      const expectedResponse = JSON.parse(fs.readFileSync('./src/tests/data/deploymentCreateDontMutate_response.json', 'utf8'));
      expect(context.body).to.deep.equal(expectedResponse);
  });

    it('shouldIgnoreUnsupportedObjectType', async () => {
      var context = newMockContext()
      context.request.body = JSON.parse(fs.readFileSync('./src/tests/data/podCreateMutate.json', 'utf8'));
      
      await objectCreate(context)

      expect(context.body.allowed).to.equal(true);
  });
});