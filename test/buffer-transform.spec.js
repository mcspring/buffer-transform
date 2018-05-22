'use strict';

var expect = require('chai').expect,
    stream = require('stream'),
    BufferTransform = require('../lib/buffer-transform');

describe('Buffer Transform', function () {
    beforeEach(function () {
        this.bs = new BufferTransform({
            size: 1
        });
    });

    it('should be a transform stream', function () {
        expect(this.bs).to.be.an.instanceof(stream.Transform);
    });

    it('should work with buffer size', function () {
        var s = 'Hello,world!',
            i = 0;

        var reader = new stream.Readable();
        reader._read = function noop() {
            // ignore
        };
        reader.on('end', function () {
            expect(i).to.equal(s.length);
        });
        reader.push(s);
        reader.push(null);

        var writer = new stream.Writable();
        writer._write = function expectation(chunk, encoding, callback) {
            expect(chunk.toString()).to.equal(s[i++]);

            callback();
        };

        reader.pipe(this.bs).pipe(writer);
    });

    it('should work with buffer size of tail', function () {
        var s = 'Hello,world!',
            i = 0;

        this.bs = new BufferTransform({
            size: 5
        })

        var reader = new stream.Readable();
        reader._read = function noop() {
            // ignore
        };
        reader.on('end', function () {
            expect(i).to.equal(10);
        });
        reader.push(s);
        reader.push(null);

        var writer = new stream.Writable();
        writer._write = function expectation(chunk, encoding, callback) {
            var n = i + 5;
            if (n > s.length) {
                n = s.length;
            }

            expect(chunk.toString()).to.equal(s.slice(i, n));

            i = n;

            callback();
        };

        reader.pipe(this.bs).pipe(writer);
    })
});