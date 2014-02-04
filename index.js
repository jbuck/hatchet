var redis = require("redis");

var Hatchet = function(options) {
  options = options || {};
  options.host = options.host || "127.0.0.1";
  options.port = options.port || 6379;

  this.client = redis.createClient(options.port, options.host);
  this.client.on("error", function(err) {
    //TODO something more useful with this error
    console.log("Hatchet error: %s", err.toString());
  });
};

Hatchet.prototype.send = function send(data) {
  // Logstash required fields: https://logstash.jira.com/browse/LOGSTASH-675
  data["@timestamp"] = (new Date()).toISOString()
  data["@version"] = 1;

  var packet = JSON.stringify(data);

  this.client.publish("hatchet", packet);
}

var noop = function() {};
var NullHatchet = {};
Object.keys(Hatchet.prototype).forEach(function(fn) {
  NullHatchet[fn] = noop;
});

module.exports.createClient = function(type, options) {
  if (type === "redis") {
    return new Hatchet(options);
  } else {
    return NullHatchet;
  }
};
