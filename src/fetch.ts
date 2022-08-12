import fetch from 'node-fetch';

function getEvent(url: string, token: string, keptnTypeEvent: string): any {
    return fetch(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            'x-token': token,
        },
    })
        .then((response) => response.json())
        .then((json) => {
            return json['events'].filter(
                (event) => event['type'] === keptnTypeEvent
            );
        })
        .catch((error) => {
            throw error;
        });
}

export async function getApiEvent(
    url: string,
    token: string,
    keptnTypeEvent: string,
    awaitTime: number,
    countEffort: number,
    delayTime: number
) {
    let counterEffort = 0;
    let response: any;
    let events: Array<any>;
    console.log(`Awaiting before start main function: ${awaitTime} sec`);
    await delay(awaitTime);
    while (counterEffort < countEffort) {
        console.log(`Iteration: ${counterEffort}`);
        events = await getEvent(url, token, keptnTypeEvent);
        if (events.length !== 0) {
            response = events[0];
            console.log('Event found.');
            console.log(response);
            break;
        } else {
            console.log(`Event isn't found.`);
            console.log(`Delay to send new request: ${delayTime} sec`);
            await delay(delayTime);
        }
        counterEffort++;
    }
    return await response;
}

function delay(delayTime: number): Promise<any> {
    return new Promise((f) => setTimeout(f, delayTime * 1000));
}
