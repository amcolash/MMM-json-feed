"use strict";

Module.register("MMM-json-feed", {

  result: {},
  defaults: {
    prettyName: true,
    stripName: true,
    title: "JSON Feed",
    url: "",
    updateInterval: 600000,
    values: [],
    arrayName: "",
  },

  start: function() {
    this.getStats();
    this.scheduleUpdate();
  },

  isEmpty: function(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        return false;
      }
    }

    return true;
  },

  getDom: function() {
    var wrapper = document.createElement("ticker");
    wrapper.className = "dimmed small";

    var data = this.result;
    var statElement =  document.createElement("header");
    var title = this.config.title;
    statElement.innerHTML = title;
    wrapper.appendChild(statElement);

    if (data && !this.isEmpty(data)) {
      var tableElement = document.createElement("table");

      console.log(data);

      var array = 1;
      if (this.config.arrayName.length > 0) {
        data = data[this.config.arrayName];
        array = data.length;
      }

      var values = this.config.values;
      if (values.length > 0) {
        for (var i = 0; i < array; i++) {
          var arrayRow = "";
          for (var j = 0; j < values.length; j++) {
            if (array == 1) {
              var val = this.getValue(data, values[j]);
            } else {
              var val = this.getValue(data[i], values[j]);
            }
            if (val) {
              if (array == 1) {
                tableElement.appendChild(this.addValue(values[j], val));
              } else {
                arrayRow += values[j] + ": " + val + ", ";
              }
            }
          }

          console.log(arrayRow);

          if (arrayRow.length > 0) {
            arrayRow = arrayRow.substr(0, arrayRow.length - 2);
            tableElement.appendChild(this.addValue(arrayRow));
          }
        }
      } else {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            tableElement.appendChild(this.addValue(key, data[key]));
          }
        }
      }

      wrapper.appendChild(tableElement);
    } else {
      var error = document.createElement("span");
      error.innerHTML = "Error fetching stats.";
      wrapper.appendChild(error);
    }

    return wrapper;
  },

  getValue: function(data, value) {
    if (data && value) {
      var split = value.split(".");
      var current = data;
      while (split.length > 0) {
        current = current[split.shift()];
      }

      return current;
    }

    return null;
  },

  addValue: function(name, value) {
    var row = document.createElement("tr");
    if (this.config.stripName && value !== undefined) {
      var split = name.split(".");
      name = split[split.length - 1];
    }

    if (this.config.prettyName) {
      name = name.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
      name = name.split("_").join(" ");
      name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    row.innerHTML = name + (value !== undefined ? ": " + JSON.stringify(value) : "");
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
  },

});
