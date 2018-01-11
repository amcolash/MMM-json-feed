# MMM-json-feed
A MagicMirror module that displays information from any json source

This code is partially copied from the very simple [stock ticker](https://github.com/alexyak/stocks) from _@alexyak_.


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
      url: 'http://your.server.json.here/abc.json'
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
| `url`                | The url of the json feed. <br><br> **Default value:** `REQUIRED`
| `updateInterval`     | The time between updates (In milliseconds). / <br><br> **Default value:** `300000 (5 minutes)`
| `values`             | Specify specific values from the json feed to only show what you need. <br><br>**Example:** `["key1", "key2", "keyA.keyB.keyC"]`<br> **Default value:** `[]` (Shows all keys in the object)
