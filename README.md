# keptn-get-event

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

[![NPM](https://nodei.co/npm/keptn-get-event.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/keptn-get-event/)

Get event from Keptn in Kubernetes cluster.

**NOTE!** This module uses the push model of getting an event.
It means that you can DoS your system a huge count of requests.
So, please, be careful.

#### Example

```js
import { main } from "keptn-get-event";

// Get event with the Kube connection
const getFromKube = true;
const kubeSettings = `
namespace: keptn
secret: keptn-api-token
service: api-gateway-nginx`;
const keptnApiUrl = "";
const keptnApiToken = "";
const keptnContext = "f8fde836-1759-4846-9401-20c3031f3ff9";
const keptnTypeEvent = "sh.keptn.event.evaluation.finished";
const awaitTime = 0;
const countEffort = 6;
const delayTime = 10;

// Get event with Keptn API URL and token
const getFromKube = false;
const kubeSettings = "";
const keptnApiUrl = "https://example.com/";
const keptnApiToken = "XXXXXXXXXXXXXXXXXXXXXXX";
const keptnContext = "f8fde836-1759-4846-9401-20c3031f3ff9";
const keptnTypeEvent = "sh.keptn.event.evaluation.finished";
const awaitTime = 0;
const countEffort = 6;
const delayTime = 10;

const response = main(
  keptnApiUrl,
  keptnApiToken,
  keptnContext,
  keptnTypeEvent,
  getFromKube,
  kubeSettings,
  awaitTime,
  countEffort,
  delayTime
);
response.then((resp) => console.log(JSON.stringify(resp)));
```
