import { getKubeEvent } from './kube';
import { getApiEvent } from './fetch';

export async function main(
    keptnApiUrl: string,
    keptnApiToken: string,
    keptnContext: string,
    keptnTypeEvent: string,
    getFromKube: boolean,
    kubeSettings: string,
    awaitTime: number,
    countEffort: number,
    delayTime: number
) {
    if (getFromKube) {
        console.log('Sending event with Kubernetes connection.');
        return getKubeEvent(
            kubeSettings,
            keptnContext,
            keptnTypeEvent,
            awaitTime,
            countEffort,
            delayTime
        );
    } else {
        console.log('Sending event with API URL and token.');
        const keptnUrl = new URL(keptnApiUrl);
        keptnUrl.pathname = 'api/mongodb-datastore/event';
        keptnUrl.searchParams.append('keptnContext', keptnContext);
        console.log(`Request URL: ${keptnUrl.href}`);
        return getApiEvent(
            keptnUrl.href,
            keptnApiToken,
            keptnTypeEvent,
            awaitTime,
            countEffort,
            delayTime
        );
    }
}
