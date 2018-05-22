# buffer-transform

Buffered transform stream for nodejs.

## Usage

```javascript
const stream = require('stream'),
    BufferTransform = require('buffer-transform');

var s = 'Hello,world!',
    i = 0;

var reader = new stream.Readable();
reader._read = function noop() {
    // ignore
};
reader.push(s);
reader.push(null);

var writer = new stream.Writable();
writer._write = function expectation(chunk, encoding, callback) {
    console.log(`chunk #${i++}: ${chunk.toString()}`);

    callback();
};

reader.pipe(new BufferTransform({
    size: 5
})).pipe(writer);
```