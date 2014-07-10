var AWS = require("aws-sdk");
var sqs = new AWS.SQS({
  maxRetries: 15,
  region: process.env.HATCHET_QUEUE_REGION
});

module.exports = {
  send: function(event_type, data, callback) {
    if (typeof data !== "object") {
      return;
    }

    var wrapper = {
      app: process.env.HATCHET_APP_NAME,
      event_type: event_type,
      timestamp: (new Date()).toISOString(),
      data: data
    };

    if (!process.env.HATCHET_QUEUE_URL) {
      console.log("--- Hatchet message ---");
      console.log(wrapper);
      console.log("-----------------------");

      if (callback) {
        callback();
      }
      return;
    }

    var body = JSON.stringify(wrapper);

    sqs.sendMessage({
      MessageBody: body,
      QueueUrl: process.env.HATCHET_QUEUE_URL
    }, function(err, data) {
      if (callback) {
        callback(err, data);
      }
    });
  }
};
