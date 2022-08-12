"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const keptn_get_event_1 = require("keptn-get-event");
const keptnApiUrl = core.getInput('keptn-api-url');
const keptnApiToken = core.getInput('keptn-api-token');
const keptnContext = core.getInput('keptn-context');
const keptnTypeEvent = core.getInput('keptn-type-event');
const getFromKube = core.getBooleanInput('get-from-kube');
const kubeSettings = core.getInput('kube-settings');
const awaitTime = Number.parseInt(core.getInput('await-time'));
const countEffort = Number.parseInt(core.getInput('count-effort'));
const delayTime = Number.parseInt(core.getInput('delay-time'));
const response = (0, keptn_get_event_1.main)(keptnApiUrl, keptnApiToken, keptnContext, keptnTypeEvent, getFromKube, kubeSettings, awaitTime, countEffort, delayTime);
response.then(json => {
    if ('type' in json) {
        core.setOutput('event', json);
    }
    else {
        core.setFailed("ERROR: No event!");
    }
}).catch(err => core.setFailed(err));
