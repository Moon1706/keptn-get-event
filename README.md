# Get event from Kepnt in Kubernetes cluster

This repository contains an action for use with GitHub Actions, which get `keptn` event to Kubernetes cluster.

**Main code** of this tool storage in `develop` branch.

**NOTE!** This module uses the push model of getting an event.
It means that you can DoS your system a huge count of requests.
So, please, be careful.

## Inputs

| Name | Mandatory | Format | Default | Description |
|--|--|--|--|--|
| keptn-api-url | yes | url | `""` | URL pointing to the Keptn server (Example: http://example.nip.io/ ). | 
| keptn-api-token | yes | string | `""` | API Token to be used for getting the event. |
| keptn-context | yes | string | | Keptn context of MongoDB event (Example: f8fde836-1759-4846-9401-20c3031f3ff9). |
| keptn-type-event | yes | string | | Type event which is searching in MongoDB (Example: sh.keptn.event.evaluation.finished). |
| get-from-kube | yes | bool | `false` | Get URL and token from Kubernetes with port forwarding. |
| kube-settings | no | JSON | `{'namespace': 'keptn', 'secret': 'keptn-api-token', 'service': 'api-gateway-nginx'}` | Basic Kubernetes connection settings. |
| await-time | yes | number | `0` | Time delay (seconds) before start main script. |
| count-effort | yes | number | `5` | Count of effort to get event. |
| delay-time | yes | number | `5` | Delay between efforts (seconds). |
| dump-json | no | bool | `false` | Dump JSON response to the file or not. |
| path-dump-json | no | path | `response.json` | Path where store dump file. |

## Outputs

| Name | Format | Description |
|--|--|--|
| event | JSON | The first event which matched with query. | 

## Usage

Basic action with API URL and token:

```yaml
- name: "Get event"
  uses: Moon1706/keptn-get-event@v1
  with:
    keptn-api-url: http://example.nip.io/api/v1/event
    keptn-api-token: XXXXXXXXXXXXXXXXXXX
    keptn-context: f8fde836-1759-4846-9401-20c3031f3ff9
    keptn-type-event: sh.keptn.event.evaluation.finished
    await-time: 10
    count-effort: 3
    delay-time: 60
```


Basic action with Kubernetes connection:

```yaml
- name: "Get event"
  uses: Moon1706/keptn-get-event@v1
  with:
    get-from-kube: true
    keptn-context: f8fde836-1759-4846-9401-20c3031f3ff9
    keptn-type-event: sh.keptn.event.evaluation.finished
    await-time: 10
    count-effort: 3
    delay-time: 60
    dump-json: true
    path-dump-json: resp.json
```

Basic flow with Kubernetes connection:

```yaml
jobs:
  send-event:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      # Connection to GCP.
      # You can use your cloud or infra.
      # Main requirement, kubectl must connect to your cluster.
      - name: "Auth to GCP exist env"
        uses: google-github-actions/auth@v0
        with:
          credentials_json: ${{ secrets.GOOGLE_SERVICE_ACCOUNT }}
      - name: "Set up Cloud SDK"
        uses: google-github-actions/setup-gcloud@v0
      - name: "Connect to cluster"
        uses: google-github-actions/get-gke-credentials@v0
        with:
          cluster_name: keptn-test
          location: europe-west3-c
          project_id: keptn-test
      
      # Get event from defalut Kubernetes cluster
      - name: "Get event"
        id: get-keptn-event
        uses: Moon1706/keptn-get-event@v1
        with:
          get-from-kube: true
          # Default settings
          kube-settings: |
            "namespace": "keptn"
            "secret": "keptn-api-token"
            "sevice": "api-gateway-nginx"
          keptn-context: f8fde836-1759-4846-9401-20c3031f3ff9
          keptn-type-event: sh.keptn.event.evaluation.finished
          await-time: 10
          count-effort: 3
          delay-time: 60
          dump-json: true
      - name: Print the JSON event from GHA output and file
        run: |
          printf ${{ steps.get-keptn-event.outputs.event }}
          sudo apt-get install jq -y
          jq '.type' response.json
```
