var AWS = require("aws-sdk");
var sqs = new AWS.SQS({
  region: process.env.HATCHET_QUEUE_REGION
});

var should = require('chai').should();

describe("hatchet", function() {
  beforeEach(clearSQS);
  afterEach(clearSQS);

  it("should send a message into a queue", function(done) {
    var hatchet = require("../index");
    var data = {
      "hello": "world"
    };

    hatchet.send("test", data);
    sqs.receiveMessage({
      MaxNumberOfMessages: 10,
      QueueUrl: process.env.HATCHET_QUEUE_URL,
      WaitTimeSeconds: 5
    }, function(err, recv_response) {
      should.not.exist(err);
      should.exist(recv_response);

      recv_response.Messages.should.have.length(1);

      sqs.deleteMessage({
        QueueUrl: process.env.HATCHET_QUEUE_URL,
        ReceiptHandle: recv_response.Messages[0].ReceiptHandle
      }, function(err, del_response) {
        should.not.exist(err);
        should.exist(del_response);

        done();
      });
    });
  });
});

// Utility function
var clearSQS = function(done) {
  sqs.receiveMessage({
    MaxNumberOfMessages: 10,
    QueueUrl: process.env.HATCHET_QUEUE_URL
  }, function(err, response) {
    if (!response.Messages) {
      return done();
    }

    var toDelete = response.Messages.map(function(message) {
      return {
        Id: message.MessageId,
        ReceiptHandle: message.ReceiptHandle
      };
    });

    sqs.deleteMessageBatch({
      Entries: toDelete,
      QueueUrl: process.env.HATCHET_QUEUE_URL
    }, function(err, response) {
      done();
    });
  });
};
