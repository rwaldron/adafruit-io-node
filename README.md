# adafruit-io

A [node.js][1] client for use with [io.adafruit.com][2].

## Installation

You should have the latest stable version of node.js installed to use this module.

```
$ node -v
v0.10.35
```

After node.js is installed, you can install this package using [npm][5], which is bundled with node.js.

```
$ npm install adafruit-io
```

## Usage

To include this module in your project, you must pass your [AIO Key][4] to the `AIO` constructor.

```js

var AIO = require('adafruit-io');

// replace xxxxxxxxxxxx with your AIO Key
aio = AIO('xxxxxxxxxxxx');

```

## Table of Contents

* [Feeds](#feeds)
  * [Create](#feed-creation)
  * [Read](#feed-retrieval)
  * [Update](#feed-updating)
  * [Delete](#feed-deletion)


### Feeds

Feeds are the core of the Adafruit IO system. The feed holds metadata about data that gets pushed, and you will
have one feed for each type of data you send to the system. You can have separate feeds for each
sensor in a project, or you can use one feed to contain JSON encoded data for all of your sensors.

#### Feed Creation

You have two options here, you can create a feed by passing a feed name, or you can pass an object if you would
like to define more properties.  If you would like to find information about what properties are available, please
visit the [Adafruit IO feed API docs][3].

```js
// option 1

aio.create_feed('Test Feed', function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created!' : 'creation failed :(');

});


// option 2:
// defining additional options

var feed_options = {
  name: 'Test Feed Two',
  description: 'Testing adding a description'
};

aio.create_feed(feed_options, function(err, success) {

  if(err) {
    return console.error(err);
  }

  console.log(success ? 'created!' : 'creation failed :(');

});
```

#### Feed Retrieval

You can get a list of your feeds by using the `aio.feeds(cb)` method.

```js
// create an instance
aio = AIO(process.env.AIO_KEY || 'xxxxxxxxxxxx');

// get a list of all feeds
aio.feeds(function(err, feeds) {

  if(err) {
    return console.error(err);
  }

  // log feeds array
  console.log(feeds);

});
```

You can also get a specific feed by ID, key, or name by using the `aio.feeds(id, cb)` method.

```js
aio.feeds('Test Feed Two', function(err, feed) {

  if(err) {
    return console.error(err);
  }

  // log feed object
  console.log(feed);

});
```
#### Feed Updating

You can update [feed properties][3] using the `aio.feeds(id).update(data, cb)` method.

```js
// define the data to update
var update_data = {
  description: 'Testing updating a description'
};

// update the description of feed 'Test Feed Two'
aio.feeds('Test Feed Two').update(update_data, function(err, updated) {

  if(err) {
    return console.error(err);
  }

  // log updated feed
  console.log(updated);

});
```
#### Feed Deletion

You can delete a feed by ID, key, or name by using the `aio.feeds(id).delete(cb)` method.

```js
// delete 'Test Feed Two' by key
aio.feeds('test-feed-two').delete(function(err, deleted) {

  if(err) {
    return console.error(err);
  }

  console.log(deleted ? 'Test Feed Two deleted!' : 'deletion failed :(');

});
```

## License
Copyright (c) 2014 Adafruit Industries. Licensed under the MIT license.

[1]: http://nodejs.org
[2]: https://io.adafruit.com
[3]: https://learn.adafruit.com/adafruit-io/feeds
[4]: https://learn.adafruit.com/adafruit-io/api-key
[5]: https://npmjs.com
