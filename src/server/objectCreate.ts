
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Kubernetes } from '../types/kubernetes';
import { config } from './config';
import * as jsonPatch from 'fast-json-patch'

const localRepoPrefix = "cluster.local"

// Impliment a mutating webhook https://github.com/istio/istio/blob/master/pilot/pkg/kube/inject/webhook.go

export function objectCreate(ctx: KoaRouter.IRouterContext) {
    var admissionRequest: Kubernetes.AdmissionReview<any> = ctx.request.body;

    var objectOriginal = admissionRequest.request.object
    var objectClone = JSON.parse(JSON.stringify(objectOriginal))

    var admissionReviewResponse: Kubernetes.AdmissionResponse = {
        uid: admissionRequest.request.uid,
        allowed: true
    };
    var admissionReview = {
        response: admissionReviewResponse
    };

    switch (admissionRequest.request.kind.kind) {
        case "Deployment": {     
            var imageRewritten = false;

            (objectClone as Kubernetes.Deployment).spec.template.spec.containers.forEach(container => {
                imageRewritten = imageRewritten || updateImageNameForContainer(container);
            });

            if (config.imagePullSecretName && imageRewritten) {
              objectClone.spec.template.spec.imagePullSecrets = [{name: config.imagePullSecretName}];
            }

            break;
        }
        default: {
            console.log(`Unsupported object Kind: ${admissionRequest.request.kind.kind}. Defaulting to approve without mutation`)
            ctx.body = admissionReviewResponse;
            return;
        }
    }

    var patch = jsonPatch.compare(objectOriginal, objectClone)
    var patchString = JSON.stringify(patch)
    var patchBase64 = Buffer.from(patchString).toString('base64')

    if (patch.length > 0) {
        admissionReviewResponse.patchType = "JSONPatch";
        admissionReviewResponse.patch = patchBase64;
    }

    ctx.body = admissionReview
}

function updateImageNameForContainer(container: Kubernetes.Container) {
  var rewriteImage = container.image.startsWith(localRepoPrefix);

    if (rewriteImage) {
        container.image = container.image.replace(localRepoPrefix, config.rewriteContainerRepository);
    }
    return rewriteImage;
}