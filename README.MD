# Image Repository Mutating Admission Controller

## Status: WIP

This controller will rewrite pods run to Kuberentes with an image repository location of `localcluster/someimage` to a repository local to the cluster. 

The usecase is when deploying to multiple cloud providers you may want to use each providers local image repository but don't want to keep two definitions for your application each with a different repository name. Scale this problem up to 4 clusters, each with a local repository and this starts to feel useful. 

Todo:

- [ ] Docs
- [ ] Tests
- [ ] CI