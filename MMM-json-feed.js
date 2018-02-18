"use strict";

Module.register("MMM-json-feed", {

  result: {},
  defaults: {
    title: "Bus Routes",
    url: "",
    updateInterval: 600000,
  },

  start: function() {
    this.getStats();
    this.scheduleUpdate();
  },

  getDom: function() {
    var wrapper = document.createElement("ticker");
    wrapper.className = "dimmed small";

    var data = this.result;
    var statElement =  document.createElement("header");
    var title = this.config.title;
    statElement.innerHTML = title;
    wrapper.appendChild(statElement);

    if (data) {
      // Make a table element to inject our data into
      var tableElement = document.createElement("table");
      wrapper.appendChild(tableElement);

      // No busses today
      if (data.services === undefined || data.services.length === 0) {
        tableElement.appendChild(this.addRow("No bus service today"));
        return wrapper;
      }

      // We care about the services array portion of the json
      data = data.services;

      // Make some variables to keep track of multiple rows
      var counter = 0;
      var row = "";

      // Loop through the route data we got
      for (var i = 0; i < data.length; i++) {
        // Parse the times from the data
        var time1 = new Date(data[i].next.time);
        var time2 = new Date(data[i].subsequent.time);

        // Append the route number and times to the current row
        row += "#" + data[i].no + ": " + this.getTime(time1) + ", " + this.getTime(time2);

        // Increment our counter keeping track of how many routes in the current row
        counter++;

        // Some special logic to keep track of our separator character "|", but could be whatever you want
        if (counter <= 2 && i < data.length - 1) {
          row += " | ";
        }

        // After 3 routes, make the row and start again
        if (counter == 3) {
          console.log(row)

          // Append a row to the html table
          tableElement.appendChild(this.addRow(row));

          // Reset counter and string
          row = "";
          counter = 0;
        }
      }

      // If we have less than 3 items in the last row
      if (row.length > 0) {
        tableElement.appendChild(this.addRow(row));
      }

      wrapper.appendChild(tableElement);
    } else {
      console.error(result);
      var error = document.createElement("span");
      error.innerHTML = "Error fetching stats.";
      wrapper.appendChild(error);
    }

    return wrapper;
  },

  // Custom format for time
  getTime: function(date) {
    // More ways to deal with Date here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    return date.getHours() + ":" + date.getMinutes();
  },

  addRow: function(value) {
    var row = document.createElement("tr");
    row.innerHTML = value;
    return row;
  },

  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setInterval(function() {
      self.getStats();
    }, nextLoad);
  },

  getStats: function () {
    this.sendSocketNotification("GET_STATS", this.config.url);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "STATS_RESULT") {
      this.result = payload;
      var fade = 500;
      console.log("fade: " + fade);
      this.updateDom(fade);
    }
  }

});
