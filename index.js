var AWS = require("aws-sdk");
var sqs = new AWS.SQS({
  region: process.env.HATCHET_QUEUE_REGION
});

module.exports = {
  send: function(event_type, data) {
    if (typeof data !== "object") {
      return;
    }

    if (!process.env.HATCHET_QUEUE_URL) {
      return;
    }

    var wrapper = {
      app: process.env.HATCHET_APP_NAME,
      event_type: event_type,
      timestamp: (new Date()).toISOString(),
      data: data
    };

    var body = JSON.stringify(wrapper);

    sqs.sendMessage({
      MessageBody: body,
      QueueUrl: process.env.HATCHET_QUEUE_URL
    }, function(err, data) {

    });
  }
};
