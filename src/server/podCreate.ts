
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Kubernetes } from '../types/kubernetes';
import { config } from './config';
import * as jsonPatch from 'fast-json-patch'

const localRepoPrefix = "cluster.local"

// Impliment a mutating webhook https://github.com/istio/istio/blob/master/pilot/pkg/kube/inject/webhook.go

export function PodCreate(ctx: KoaRouter.IRouterContext) {
    var admissionRequest = ctx.request.body;

    console.log(JSON.stringify(ctx.request.body))

    var podOriginal: Kubernetes.Pod = admissionRequest.request.object

    console.log(`validating the ${podOriginal.metadata.name} pod`);

    var podClone: Kubernetes.Pod = JSON.parse(JSON.stringify(podOriginal))
    podClone.spec.containers.forEach(container => {
        if (container.image.startsWith(localRepoPrefix)) {
            container.image = container.image.replace(localRepoPrefix, config.rewriteContainerRepository)
        }
    });

    // Generate a patch for the items
    var patch = jsonPatch.compare(podOriginal, podClone)
    var patchString = JSON.stringify(patch)
    var patchBase64 = Buffer.from(patchString).toString('base64')

    console.log(patch)

    var admissionResponse = {
        uid: admissionRequest.uid,
        allowed: true,
        patchType: "JSONPatch",
        patch: patchBase64
    };

    var admissionReview = {
        response: admissionResponse
    };

    ctx.body = admissionReview
}