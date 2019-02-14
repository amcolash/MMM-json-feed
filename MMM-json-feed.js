"use strict";

Module.register("MMM-json-feed", {

  firstUpdate: true,
  result: {},
  defaults: {
    prettyName: true,
    stripName: true,
    title: "JSON Feed",
    url: "", // Deprecated
    urls: [], // Added as a new parameter to maintain backwards compatibility
    updateInterval: 600000,
    singleLine: false,
    values: [],
    replaceName: [],
    arrayName: "",
    arraySize: 999
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
      var values = this.config.values;

      if (this.config.arrayName.length > 0) {
        try {
          data = this.byString(data, this.config.arrayName);
          if (data && data.length) {
            for (var i = 0; i < data.length && i < this.config.arraySize; i++) {
              this.addValues(data[i], values, tableElement);
              if (i < data.length - 1) {
                var hr = document.createElement("hr");
                hr.style = "border-color: #444;"
                tableElement.appendChild(hr);
              }
            }
          } else {
            this.addValues(data, values, tableElement);
          }
        } catch (e) {
          console.error(e);
          this.addValues(data, values, tableElement);
        }
      } else {
        this.addValues(data, values, tableElement);
      }

      wrapper.appendChild(tableElement);
    } else {
      var error = document.createElement("span");
      error.innerHTML = this.firstUpdate ? "Fetching stats" : "Error fetching stats.";
      wrapper.appendChild(error);
    }

    return wrapper;
  },

  addValues: function(data, values, tableElement) {
    console.log(data);
    if (values.length > 0) {
      for (var i = 0; i < values.length; i++) {
        var val = this.getValue(data, values[i]);
        if (val) {
          tableElement.appendChild(this.addValue(values[i], val));
        }
      }
    } else {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          tableElement.appendChild(this.addValue(key, data[key]));
        }
      }
    }
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
    // This is a nasty hack, don't do this in prod kids
    var row = this.config.singleLine ? document.createElement("span") : document.createElement("tr");

    var split = name.split(".");
    var strippedName = split[split.length - 1];

    if (this.config.stripName) {
      name = strippedName;
    }

    // Replace overrides not stripping the name
    if (this.matchesReplace(strippedName)) {
      name = this.replaceName(strippedName);
    } else if (this.config.prettyName) {
      name = name.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
      name = name.split("_").join(" ");
      name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    row.innerHTML = "";

    if (name.length > 0) {
      name = name.replace(/['"]+/g, '');
      row.innerHTML = name + ": ";
    }

    row.innerHTML += JSON.stringify(value).replace(/['"]+/g, '');
    return row;
  },

  matchesReplace: function(name) {
    for (var i = 0; i < this.config.replaceName.length; i++) {
      var n = this.config.replaceName[i];
      if (n[0].toLowerCase() === name.toLowerCase()) {
        console.log("matched")
        return true;
      }
    }

    return false;
  },

  replaceName: function(name) {
    for (var i = 0; i < this.config.replaceName.length; i++) {
      var n = this.config.replaceName[i];
      if (n[0].toLowerCase() === name.toLowerCase()) {
        return n[1];
      }
    }

    return name;
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
    var url = (this.config.url.length > 0) ? [this.config.url] : [];
    var allUrls = this.config.urls.concat(url);
    this.sendSocketNotification("GET_STATS", allUrls);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "STATS_RESULT") {
      this.result = payload;
      this.firstUpdate = false;
      this.updateDom(500); // 500 is fade
    }
  },

  // function from https://stackoverflow.com/questions/6491463
  byString: function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
  }
});
