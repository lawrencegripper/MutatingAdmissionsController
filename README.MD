# Image Repository Mutating Admission Controller

## Status: WIP

This controller will rewrite pods run to Kuberentes with an image repository location of `cluster.local/someimage` to a repository local to the cluster (in the sample it's `rewritten.local/someimage`). 

This is a task better suited to some form of pre-processing in the CD pipeline as I beleive using an Admissions controller for this is overly complex and adds a single point of failure for all pod create opterations in your clusters. However, I think the sample is likely of use to others with different scenarios. 

## Running

Lets start our webhook receiver locally.

1. `ngrok http 3000`
2. `​git clone https://github.com/lawrencegripper/ClusterLocalAdmissionsController` and CD into the dir
3. `npm install && npm watch-server`
4. Update the `k8s-ngrok.yaml` file's `url` property with your ngrok endpoint 
5. `k apply -f k8s-ngrok.yaml` then run `k apply -f testpod.yaml` and see the webhook hit your service and patch the image location

## What happens in the receiver?

It receives the request it does the following:

1.  Clone the incoming pod spec into a new object
2.  Make changes to the clone, updating the image location
3.  Creates a JSONPatch by comparing the original and the clone
4.  Base64 Encodes the JSONPatch data
5.  Returns the patch as part of an `admissionResponse` object

Todo:

- [ ] Docs
- [ ] Tests
- [ ] CI