const stream = require('stream'),
    util = require('util');

var BufferTransform = module.exports = function (options) {
    if (!options) {
        options = {};
    }

    this.size = options.size || 16 << 10; // default to 16k
    this.offset = 0;
    this.buf = Buffer.alloc(this.size);

    stream.Transform.call(this, {
        objectMode: true,
        highWaterMark: this.size
    });
}

util.inherits(BufferTransform, stream.Transform);

BufferTransform.prototype._transform = function _transform(chunk, encoding, callback) {
    var emptySize = this.size - this.offset;

    while (chunk.length >= emptySize) {
        // fill buffer with expected data
        chunk.copy(this.buf, this.offset, 0, emptySize)

        // write data out
        this.push(this.buf);

        // reset buffer state
        this.offset = 0;

        // sync chunk state
        chunk = chunk.slice(emptySize);
        emptySize = this.size - this.offset;
    }

    // fix remain data if exist
    if (chunk.length > 0) {
        chunk.copy(this.buf, this.offset);
        this.offset += chunk.length;
    }

    callback();
};

BufferTransform.prototype._flush = function _flush(callback) {
    if (this.offset > 0) {
        this.push(this.buf.slice(0, this.offset));
        this.offset = 0;
    }

    callback();
};