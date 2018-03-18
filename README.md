# storytracker-api
Service API for the StoryTracker application

## Prerequisites
In order to run the StoryTracker API locally, you must:
1. Have node.js 7.x or later installed.
2. Have a working installation of MongoDB.
## Installation
```
npm install
```

## Running the service
1. Create the files `/<path>/config/prod.json` and `/<path>/config/qa.json`.
2. In each config file, create a JSON object with the following format:

```
{
	"mongodb": "mongodb://path-to-mongo-server/storytracker",
	"secret": "[random string]"
}
```

3. Run the service: `NODE_ENV=qa node app.js`. (If no environment is specified, it defaults to using the qa.json file.)
