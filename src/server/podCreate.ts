
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Kubernetes } from '../types/kubernetes';
import { config } from './config';
import * as jsonPatch from 'fast-json-patch'

const localRepoPrefix = "cluster.local"

// Impliment a mutating webhook https://github.com/istio/istio/blob/master/pilot/pkg/kube/inject/webhook.go

export function PodCreate(ctx: KoaRouter.IRouterContext) {
    var admissionRequest: Kubernetes.AdmissionReview<Kubernetes.Pod> = ctx.request.body;

    var podOriginal: Kubernetes.Pod = admissionRequest.request.object

    var podClone: Kubernetes.Pod = JSON.parse(JSON.stringify(podOriginal))

    podClone.spec.containers.forEach(container => {
        updateImageNameForContainer(container);
    });

    var admissionResponse: Kubernetes.AdmissionResponse = {
        uid: admissionRequest.request.uid,
        allowed: true
    };

    var patch = jsonPatch.compare(podOriginal, podClone)
    var patchString = JSON.stringify(patch)
    var patchBase64 = Buffer.from(patchString).toString('base64')

    if (patch.length > 0) {
        admissionResponse.patchType = "JSONPatch";
        admissionResponse.patch = patchBase64;
    }

    var admissionReview = {
        response: admissionResponse
    };

    ctx.body = admissionReview
}

function updateImageNameForContainer(container: Kubernetes.Container) {
    if (container.image.startsWith(localRepoPrefix)) {
        container.image = container.image.replace(localRepoPrefix, config.rewriteContainerRepository);
    }
}