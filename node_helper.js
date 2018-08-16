const NodeHelper = require("node_helper");
const request = require("request");

module.exports = NodeHelper.create({
  start: function () {
    console.log("mmm-json-feed helper started...");
  },

  getStats: function (urls) {
    var self = this;

    // Wait for all promises, then merge data together. Duplicate keys WILL be clobbered.
    Promise.all(urls.map(self.requestAsync))
      .then(function (allData) {
        var finalData = {};

        // Merge date
        for (var i = 0; i < allData.length; i++) {
          Object.assign(finalData, allData[i]);
        }

        // Return final data
        self.sendSocketNotification("STATS_RESULT", finalData);
      });
  },

  // Nice little request wrapper from: https://stackoverflow.com/questions/32828415/how-to-run-multiple-async-functions-then-execute-callback
  requestAsync: function(url) {
    return new Promise(function (resolve, reject) {
      request(url, function (err, res, body) {
        if (err) { return reject(err); }
        return resolve(JSON.parse(body));
      });
    });
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_STATS") {
      this.getStats(payload);
    }
  }

});
