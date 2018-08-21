# Image Repository Mutating Admission Controller

[![Build Status](https://travis-ci.com/lawrencegripper/MutatingAdmissionsController.svg?branch=master)](https://travis-ci.com/lawrencegripper/MutatingAdmissionsController)

## Status: WIP

This controller will rewrite pods run to Kuberentes with an image repository location of `cluster.local/someimage` to a repository local to the cluster (in the sample it's `rewritten.local/someimage`).

This is a task better suited to some form of pre-processing in the CD pipeline as I beleive using an Admissions controller for this is overly complex and adds a single point of failure for all pod create opterations in your clusters. However, I think the sample is likely of use to others with different scenarios. 

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

## Deploying into a cluster

To deploy into a cluster we have to do the following steps

1. Create a new deployment of the service that is available on https (This will need to include a secret and configmap)
2. Create a new service to expose the deployment to the cluster
3. Configure the webhook to point to the new service

An example of this can be found in `./kubernetes/k8s.yaml`

Webhooks only work over HTTPs. To allow this the webhook deployment uses an init controller to create a CSR against the k8s API that is then issued to the service

Once the deployment has started you will need to approve the CSR from the command line use kubectl

To view the list of CSRs run the follwing
```
kubectl get csr -n kube-system
```

This will produce a list as below
```
NAME                                                       AGE       REQUESTOR                                   CONDITION
imagenamemutatingcontroller-6654d46b67-7dplz-kube-system   57m       system:serviceaccount:kube-system:default   Approved,Issued
imagenamemutatingcontroller-6654d46b67-8rk59-kube-system   55m       system:serviceaccount:kube-system:default   Approved,Issued
imagenamemutatingcontroller-8597f5b994-8z2m9-kube-system   32m       system:serviceaccount:kube-system:default   Approved,Issued
imagenamemutatingcontroller-8597f5b994-jxnl8-kube-system   11m       system:serviceaccount:kube-system:default   Pending
imagenamemutatingcontroller-8597f5b994-rflqz-kube-system   53m       system:serviceaccount:kube-system:default   Approved,Issued
```

Approve the pending certificate with the command line below

```
kubectl certificate approve <csr-name>
```

You will need to get the root client ca file for your cluster using the command below and put this in to csBundle in `kuebrnetes/k8s.yaml`

```
kubectl get configmap -n kube-system extension-apiserver-authentication -o=jsonpath='{.data.client-ca-file}' | base64 | tr -d '\n'
```
