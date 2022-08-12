import * as core from '@actions/core';
import { main } from 'keptn-get-event';
import { writeFileSync } from 'fs';

const keptnApiUrl = core.getInput('keptn-api-url');
const keptnApiToken = core.getInput('keptn-api-token');
const keptnContext = core.getInput('keptn-context');
const keptnTypeEvent = core.getInput('keptn-type-event');
const getFromKube = core.getBooleanInput('get-from-kube');
const kubeSettings = core.getInput('kube-settings');
const awaitTime = Number.parseInt(core.getInput('await-time'));
const countEffort = Number.parseInt(core.getInput('count-effort'));
const delayTime = Number.parseInt(core.getInput('delay-time'));
const dumpJson = core.getBooleanInput('dump-json');
const pathDumpJson = core.getInput('path-dump-json');

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
)

response.then(json =>  {
  if ('type' in json) {
      const jsonString = JSON.stringify(json);
      if (dumpJson) {
        writeFileSync(pathDumpJson, jsonString);
      }
      core.setOutput('event', jsonString);
  } else {
      core.setFailed("ERROR: No event!");
  }
}).catch(err => core.setFailed(err));
