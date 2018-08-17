// This modules provides TS interfaces for the Kubernetes objects
// sent/received by the webhooks
export module Kubernetes {

    export interface OwnerReference {
        apiVersion: string;
        blockOwnerDeletion: boolean;
        controller: boolean;
        kind: string;
        name: string;
        uid: string;
    }

    export interface Metadata {
        creationTimestamp: Date;
        generateName: string;
        labels: any;
        name: string;
        namespace: string;
        ownerReferences: OwnerReference[];
        resourceVersion: string;
        selfLink: string;
        uid: string;
    }

    export interface Env {
        name: string;
        value: string;
    }

    export interface Port {
        containerPort: number;
        protocol: string;
    }

    export interface Resources {
    }

    export interface VolumeMount {
        mountPath: string;
        name: string;
        readOnly: boolean;
    }

    export interface Container {
        env: Env[];
        image: string;
        imagePullPolicy: string;
        name: string;
        ports: Port[];
        resources: Resources;
        terminationMessagePath: string;
        terminationMessagePolicy: string;
        volumeMounts: VolumeMount[];
    }

    export interface SecurityContext {
    }

    export interface Toleration {
        effect: string;
        key: string;
        operator: string;
        tolerationSeconds: number;
    }

    export interface Secret {
        defaultMode: number;
        secretName: string;
    }

    export interface Volume {
        name: string;
        secret: Secret;
    }

    export interface Spec {
        automountServiceAccountToken: boolean;
        containers: Container[];
        dnsPolicy: string;
        restartPolicy: string;
        schedulerName: string;
        securityContext: SecurityContext;
        serviceAccount: string;
        serviceAccountName: string;
        terminationGracePeriodSeconds: number;
        tolerations: Toleration[];
        volumes: Volume[];
    }

    export interface Condition {
        lastProbeTime?: any;
        lastTransitionTime: Date;
        message: string;
        reason: string;
        status: string;
        type: string;
    }

    export interface Status {
        conditions: Condition[];
        phase: string;
        qosClass: string;
    }

    export interface Pod {
        apiVersion: string;
        kind: string;
        metadata: Metadata;
        spec: Spec;
        status: Status;
    }


    export interface Kind {
        group: string;
        version: string;
        kind: string;
    }

    export interface Resource {
        group: string;
        version: string;
        resource: string;
    }

    export interface UserInfo {
        username: string;
        groups: string[];
    }

    export interface AdmissionReviewRequest<T> {
        uid: string;
        kind: Kind;
        resource: Resource;
        namespace: string;
        operation: string;
        userInfo: UserInfo;
        object: T;
        oldObject?: any;
    }



    export interface AdmissionReview<T> {
        kind: string;
        apiVersion: string;
        request: AdmissionReviewRequest<T>;
    }

    export interface AdmissionResponse {
        uid: string;
        allowed: boolean;
        patchType?: string;
        patch?: string;
    }

    export interface Template {
        metadata: Metadata;
        spec: Spec;
    }

    export interface Selector {
        matchLabels: any;
    }

    export interface Strategy {
        type: string;
    }

    export interface DeploymentSpec {
        progressDeadlineSeconds: number;
        replicas: number;
        revisionHistoryLimit: number;
        selector: Selector;
        strategy: Strategy;
        template: Template;
    }

    export interface Condition {
        lastTransitionTime: Date;
        lastUpdateTime: Date;
        message: string;
        reason: string;
        status: string;
        type: string;
    }

    export interface Status {
        availableReplicas: number;
        conditions: Condition[];
        observedGeneration: number;
        readyReplicas: number;
        replicas: number;
        updatedReplicas: number;
    }

    export interface Deployment {
        apiVersion: string;
        kind: string;
        metadata: Metadata;
        spec: DeploymentSpec;
        status: Status;
    }

}

