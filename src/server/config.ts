import * as fs from "fs";

export const config = {
    port: process.env.NODE_PORT || 3000,
    rewriteContainerRepository: process.env.REWRITE_CONTAINER_REPOSITORY || "rewritten.local",
    key: () =>fs.readFileSync('./out/local-repository-controller-service.key', 'utf8'),
    cert: () => fs.readFileSync('./out/local-repository-controller-service.crt', 'utf8'),
    imagePullSecretName:  process.env.IMAGE_PULL_SECRET_NAME || ""
};