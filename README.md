# MMM-json-feed
A MagicMirror module that displays information from any json source

This code is partially copied from the very simple [stock ticker](https://github.com/alexyak/stocks) from _@alexyak_.

__Notice__: I have no intention of adding new features to the code here. Multiple people have asked for more customized features/modules. If you are really adament about getting something cool and awesome, let me know and if I do get time I may be able to help. This project was never meant to be anything big or useful, so show your appreciation if you are asking for a new feature on a dead project. A small donation to the beer fund never hurts (paypal: amcolash@gmail.com). I love open source software and love providing time to my projects, but honestly I don't even use this module so it is not high on my list of things to do. As always, if you make modifications and a PR and we can merge it into the master branch.

## What it Looks Like!
Nothing too pretty, just the data you want to see :)

There are some config options to make the json keys a bit prettier though, mentioned below in the config.

![Screenshot](https://raw.githubusercontent.com/amcolash/MMM-json-feed/master/Screenshot.png)

Here is the above json example data:
```
{
  "andrewMcolash":true,
  "AndrewMc":"123",
  "test_this":["a","b","c"],
  "Test_This":{"e":true,"f":"abc"}
}
```

## Configuration
It is very simple to set up this module, a sample configuration looks like this:

```
modules: [
  {
    module: 'MMM-json-feed',
    position: 'bottom_bar',
    config: {
      urls: [
        'http://your.server.json.here/abc1.json',
        'http://your.server.json.here/abc2.json',
      ]
    }
  }
]
```

## Configuration Options

| Option               | Description
| -------------------- | -----------
| `prettyName`         | Pretty print the name of each JSON key (remove camelCase and underscores). <br><br> **Default value:** `true`
| `stripName`          | Removes all keys before the printed key. <br><br>**Example:** `a.b.c` will print `c`.<br> **Default value:** `true`
| `title`              | Title to display at the top of the module. <br><br> **Default value:** `JSON Feed`
| `urls`               | An array of urls for your json feeds. Note that duplicate keys *WILL* be clobbered.<br><br> **Default value:** `REQUIRED`
| `url`                | **DEPRECATED, Please use `urls` instead.**<br>~~The url of the json feed. <br> **Default value:** `REQUIRED`~~
| `updateInterval`     | The time between updates (In milliseconds). <br><br> **Default value:** `300000 (5 minutes)`
| `values`             | Specify specific values from the json feed to only show what you need. <br><br>**Example:** `["key1", "key2", "keyA.keyB.keyC"]`<br> **Default value:** `[]` (Shows all keys in the object)
| `replaceName`        | Specify key names to replace in the json. This is an array of arrays [find, replace]<br><br>**Example:** `[ ["body", "replaced body"], ["id", "replacedID"] ]`<br>

## Using an Array of Data and Custom Parsing
There is an experiemental [branch](https://github.com/amcolash/MMM-json-feed/tree/arrays) that allows you to use a single array of data instead of the default behavior. Currently there is no documentation, but you can check out [issue #3](https://github.com/amcolash/MMM-json-feed/issues/3#issuecomment-366481399) for some information about this custom branch. Like mentioned in the issue, this module is meant for _simple_ use cases and custom use cases probably require their own parsing.
