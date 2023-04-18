# PatCustomAssetWorker

Welcome to my Adobe I/O Application!

## Setup

- Populate the `.env` file in the project root and fill it as shown [below](#env)

## Local Dev

- `aio app run` to start your local Dev server
- App will run on `localhost:9080` by default

By default the UI will be served locally but actions will be deployed and served from Adobe I/O Runtime. To start a
local serverless stack and also run your actions locally use the `aio app run --local` option.

## Test & Coverage

- Run `aio app test` to run unit tests for ui and actions
- Run `aio app test --e2e` to run e2e tests

## Deploy & Cleanup

- `aio app deploy` to build and deploy all actions on Runtime and static files to CDN
- `aio app undeploy` to undeploy the app

## Config

### `.env`

You can generate this file using the command `aio app use`. 

```bash
# This file must **not** be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=
```

### `app.config.yaml`

- Main configuration file that defines an application's implementation. 
- More information on this file, application configuration, and extension configuration 
  can be found [here](https://developer.adobe.com/app-builder/docs/guides/appbuilder-configuration/#appconfigyaml)

#### Action Dependencies

- You have two options to resolve your actions' dependencies:

  1. **Packaged action file**: Add your action's dependencies to the root
   `package.json` and install them using `npm install`. Then set the `function`
   field in `app.config.yaml` to point to the **entry file** of your action
   folder. We will use `webpack` to package your code and dependencies into a
   single minified js file. The action will then be deployed as a single file.
   Use this method if you want to reduce the size of your actions.

  2. **Zipped action folder**: In the folder containing the action code add a
     `package.json` with the action's dependencies. Then set the `function`
     field in `app.config.yaml` to point to the **folder** of that action. We will
     install the required dependencies within that directory and zip the folder
     before deploying it as a zipped action. Use this method if you want to keep
     your action's dependencies separated.

## Debugging in VS Code

While running your local server (`aio app run`), both UI and actions can be debugged, to do so open the vscode debugger
and select the debugging configuration called `WebAndActions`.
Alternatively, there are also debug configs for only UI and each separate action.

## Typescript support for UI

To use typescript use `.tsx` extension for react components and add a `tsconfig.json` 
and make sure you have the below config added
```
 {
  "compilerOptions": {
      "jsx": "react"
    }
  } 
```

# Asset Compute Worker Creation

- https://developer.adobe.com/app-builder/docs/resources/asset-compute-worker-ps-api/lesson1/
  - Note: Click "Create project from template" > App Builder > Give the function a name
  - Note: Make sure that you add the following API's
      -  I/O Management API
      -  I/O Events
      -  Asset Compute
  - On your filesystem run `aio app init <project-name>`
  - From the "What templates do you want to search for?" > "Only templates supported by my Org"
  - From the "Choose the template(s) to install" > "@adobe/generator-app-asset-compute *" (Hit the spacebar and click enter)  
- https://developer.adobe.com/app-builder/docs/resources/asset-compute-worker-ps-api/lesson2/
  - Note: This will configure the storage engine for the renditions
- https://developer.adobe.com/console/projects/35196/4566206088344951925/workspaces/4566206088344959091/details > "Download all" > Put the console.json in the root of the project
  - This is the configuration to the project 
- https://developer.adobe.com/app-builder/docs/resources/asset-compute-worker-ps-api/lesson3/
  - Note: This is creating a rendition from the source using a AIO function, make sure you deploy your app using `aio app deploy` and then use `aio app get-url` in order to get the URL
  - If you want to test an Asset Compute function you can use `aio app run` and this will allow you to test the function locally on your system
- https://developer.adobe.com/app-builder/docs/resources/asset-compute-worker-ps-api/lesson4/
  - Note: Create an AEMaaCS Custom Profile, copy the URL and paste it in the Endpoint (note that if you are in org AEM Support you need to make sure that the function is deployed in AEM Support in the Developer Console)
  - The rendition name and extension is the name of the rendition that gets put in the JCR under the renditions JSON

## Sample Project for Asset Compute

https://developer.adobe.com/console/projects/35196/4566206088344951925/overview

# Debugging

## Debugging URL 
Debugging asset compute extensibility: https://experienceleague.adobe.com/docs/experience-manager-learn/cloud-service/asset-compute/troubleshooting.html?lang=en

## Viewing Logs
You can view the logs for your function by executing `aio app logs`

## Known Issues

### FT_ASSETS-13723

If the asset rendition is not being created I would look for the following logs in the AEM server:

```
{ [-]
   aem_base_version: 6.5
   aem_envId: 959068
   aem_envType: dev
   aem_program_id: 12169
   aem_release_id: 11382
   aem_service: cm-p12169-e959068
   aem_tenant: ns-team-aem-cm-prd-n96404
   aem_tier: author
   cluster: ethos13-prod-nld2
   file_path: /var/log/aem/error.log
   level: INFO
   msg: [sling-threadpool-83ff6a8d-b9b0-461c-a315-a8bb9a5169e8-(com.adobe.cq.assetcompute.impl.assetcomputeserviceimpl)-13] com.adobe.cq.assetcompute.impl.assetprocessor.AssetProcessingRequest Profile json str for async process job: {"excludeMimeTypes":"","extension":"png","workerParameters":{"worker":"https://35196-patcustomassetworker-stage.adobeioruntime.net/api/v1/web/dx-asset-compute-worker-1/worker"},"name":"custompat.png","includeMimeTypes":"image/jpeg,image/png"}
   namespace: ns-team-aem-cm-prd-n96404
   orig_time: 18.04.2023 19:17:22.894
   pod_name: cm-p12169-e959068-aem-author-5599456ffb-9mdb7
   pod_uid: 66e6dcd6-6855-4293-81ca-d4d44dfb28fd
}
```

There you will see the Asset Compute worker invoking the endpoint to generate the rendition, if you see the following error later in the log

```
{ [-]
   aem_base_version: 6.5
   aem_envId: 959068
   aem_envType: dev
   aem_program_id: 12169
   aem_release_id: 11382
   aem_service: cm-p12169-e959068
   aem_tenant: ns-team-aem-cm-prd-n96404
   aem_tier: author
   cluster: ethos13-prod-nld2
   file_path: /var/log/aem/error.log
   level: WARN
   msg: [sling-cq-asset-processing-4-asset-compute-consuming-job] com.adobe.cq.assetcompute.impl.AssetComputeConsumingJob Failed to get execution result
java.util.concurrent.ExecutionException: java.lang.NullPointerException
	at java.base/java.util.concurrent.FutureTask.report(FutureTask.java:122)
	at java.base/java.util.concurrent.FutureTask.get(FutureTask.java:191)
	at com.adobe.cq.assetcompute.impl.AssetComputeConsumingJob.run(AssetComputeConsumingJob.java:151) [com.adobe.cq.dam.cq-dam-processor-nui:1.1.740]
	at org.apache.sling.commons.scheduler.impl.QuartzJobExecutor.execute(QuartzJobExecutor.java:349) [org.apache.sling.commons.scheduler:2.7.12]
	at org.quartz.core.JobRunShell.run(JobRunShell.java:202) [org.apache.sling.commons.scheduler:2.7.12]
	at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)
	at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)
	at java.base/java.lang.Thread.run(Thread.java:834)
Caused by: java.lang.NullPointerException: null
	at com.adobe.cq.assetcompute.impl.assetprocessor.AssetProcessingRequest.buildRenditionsJSONArray(AssetProcessingRequest.java:261) [com.adobe.cq.dam.cq-dam-processor-nui:1.1.740]
	at com.adobe.cq.assetcompute.impl.assetprocessor.AssetProcessingRequest.createRequestBody(AssetProcessingRequest.java:135) [com.adobe.cq.dam.cq-dam-processor-nui:1.1.740]
	at com.adobe.cq.assetcompute.impl.AssetComputeJob.call(AssetComputeJob.java:71) [com.adobe.cq.dam.cq-dam-processor-nui:1.1.740]
	at com.adobe.cq.assetcompute.impl.AssetComputeJob.call(AssetComputeJob.java:43) [com.adobe.cq.dam.cq-dam-processor-nui:1.1.740]
	at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
	... 3 common frames omitted
   namespace: ns-team-aem-cm-prd-n96404
   orig_time: 18.04.2023 19:17:22.896
   pod_name: cm-p12169-e959068-aem-author-5599456ffb-9mdb7
   pod_uid: 66e6dcd6-6855-4293-81ca-d4d44dfb28fd
}
```

There you will see that the process has failed in invoking the rendition, you need to log a support ticket and ask to disable `FT_ASSETS-13723` feature flag.