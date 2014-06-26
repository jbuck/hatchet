# hatchet

Send data into an SQS queue

## Usage

```javascript
var hatchet = require("hatchet");
hatchet.send("create_event", {
  dimensions: {
    user_id: 1234
  }
}, function(err, data) {
  console.log("we sent a message!");
});
```

## Configuration

hatchet is configured only using environment variables. If any of these are not present, then hatchet will not do anything

* `AWS_ACCESS_KEY_ID` - Used by aws-sdk
* `AWS_SECRET_ACCESS_KEY` - Used by aws-sdk
* `HATCHET_APP_NAME` - The name of the app
* `HATCHET_QUEUE_REGION` - The AWS region that the Hatchet SQS lives in. Probably `us-east-1`
* `HATCHET_QUEUE_URL` - The SQS URL used by Hatchet
