import { KubeConnect } from './types';
import { load } from 'js-yaml';
import { decode } from 'js-base64';
import * as k8s from '@kubernetes/client-node';
import * as net from 'net';
import { getApiEvent } from './fetch';

export async function getKubeEvent(
    kubeSettings: string,
    keptnContext: string,
    keptnTypeEvent: string,
    awaitTime: number,
    countEffort: number,
    delayTime: number
) {
    const kubeConnect = load(kubeSettings) as KubeConnect;
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const forward = new k8s.PortForward(kc);

    // Get Keptn Api token
    const token = await k8sApi
        .readNamespacedSecret(kubeConnect.secret, kubeConnect.namespace)
        .then((res) => {
            const data = res.body.data as any;
            return decode(data[kubeConnect.secret]);
        });
    console.log(
        `Got token from secret '${kubeConnect.secret}' in namespace '${kubeConnect.namespace}'.`
    );

    // Get Pod name from service
    const podName = await k8sApi
        .listNamespacedPod(kubeConnect.namespace)
        .then((pods) => {
            return pods.body.items
                .map((pod) => pod.metadata?.name)
                .filter((name) =>
                    new RegExp(kubeConnect.service, 'i').test(name as string)
                )[0];
        });
    console.log(`Pod name for port-forwarding '${podName}'.`);

    // Start port forwarding
    const hostname = 'localhost';
    const port = 8080;
    const server = net.createServer((socket) => {
        forward.portForward(
            kubeConnect.namespace,
            podName as string,
            [port],
            socket,
            null,
            socket
        );
    });
    try {
        await server.listen(port, hostname);
        console.log('Up server with port-forwarding.');
    } catch (error) {
        throw new Error(`Error with starting net server! ${error}`);
    }

    // Send request
    const keptnUrl = new URL(`http://${hostname}:${port}`);
    keptnUrl.pathname = 'api/mongodb-datastore/event';
    keptnUrl.searchParams.append('keptnContext', keptnContext);
    console.log(`Sending request with URL '${keptnUrl.href}'.`);
    const response = await getApiEvent(
        keptnUrl.href,
        token,
        keptnTypeEvent,
        awaitTime,
        countEffort,
        delayTime
    );

    // Stop port forwarding
    try {
        await server.close(function () {
            server.unref();
        });
        console.log('Stop server with port-forwarding.');
    } catch (error) {
        throw new Error(`Error with stop net server! ${error}`);
    }

    return response;
}
