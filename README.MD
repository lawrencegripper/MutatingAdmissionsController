# Image Repository Mutating Admission Controller

## Warning: No longer maintained. Use as a sample with caution. 

[![Build Status](https://travis-ci.com/lawrencegripper/MutatingAdmissionsController.svg?branch=master)](https://travis-ci.com/lawrencegripper/MutatingAdmissionsController)

## Status: Alpha

This controller will rewrite deployments in Kuberentes with an image repository location of `cluster.local/someimage` to a repository local to the cluster (in the sample it's `rewritten.local/someimage`) and inject the correct image pull secret. The aim is to simplify deployment in a HA environment with multiple k8s clusters in multiple providers, each with seperate image repositories. 

This is a task that could be performed by a CD pipeline and careful thought should be used around how this affects clusters if the webhook service isn't available. Currently the solution mutates deployments meaning that pods can be created successfully when the serivce is down allowing the cluster to recover from node failure - however no deployments could be created or updated during this time. 

## Running

Lets start our webhook receiver locally.

1. `ngrok http 3000`
2. `​git clone https://github.com/lawrencegripper/ClusterLocalAdmissionsController` and CD into the dir
3. `npm install && npm run watch-server`
4. Update the `./kubernetes/k8s-ngrok.yaml` file's `url` property with your ngrok https endpoint 
5. `k apply -f ./kubernetes/k8s-ngrok.yaml` then run `k apply -f ./kubernetes/testdep.yaml` and see the webhook hit your service and patch the image location

## Testing

Run `npm test`

## What happens in the receiver?

It receives the request it does the following:

1. Clone the incoming pod spec into a new object
2. Make changes to the clone, updating the image location
3. Creates a JSONPatch by comparing the original and the clone
4. Base64 Encodes the JSONPatch data
5. Returns the patch as part of an `admissionResponse` object

## Helm Chart

To deploy the registry rewriter into your cluster you can use the helm chart contained here. You will need the following properties

* CA Root certificate of the cluster this is being deployed into
* URL of registry that should be used for cluster.local images

> To get the root bundle you will need to run the following  
> `kubectl get configmap -n kube-system extension-apiserver-authentication -o=jsonpath='{.data.client-ca-file}' | base64 | tr -d '\n'`

When installing this chart it will include a number of things

* A kubernetes job to create a CSR for the deployment and approve the CSR
* A deployment and service for the webhook itself
* A webhook configuration to tell kubernetes where the webhook is in you cluster

The chart can be found in this repo and can also be consumed from the resources page using

```bash
helm install <url of release> --name registry-rewiter --set containerRegistryUrl=someurl.com,caBundle=<rootbundleasbase64>
```

Once installed you run `k apply -f ./kubernetes/testdep.yaml` to test it has worked. If all is working you should receive

```bash
deployment.apps/example-deployment configured
```

You can also choose to deploy your own custom container image for the webhook by supplying the `webhookImage` value in the values.yaml.
