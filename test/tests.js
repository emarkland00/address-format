const assert = require('assert');
const shoudl = require('should');
const addressParser = require("../lib/address");

describe('AddressParser', function() {
    describe('format', function() {
        it('should load valid address format valid ISO code', function(done) {
            var parser = new addressParser.AddressParser();
            var result = parser.getFormat('US');
            result.should.be.instanceof(Object);
            result.should.not.be.empty();
            done();
        })
        it('should load empty address format for invalid or unsupported ISO code', function(done) {
            var parser = new addressParser.AddressParser();
            var result = parser.getFormat(null);
            result.should.be.instanceof(Object);
            result.should.be.empty();
            done();
        });
    });

    describe('parse', function() {
        it('should parse US-based raw address', function(done) {
            var parser = new addressParser.AddressParser();
            var result = parser.parseRawAddress('123 Main Street, New York, NY 10001', 'US');
            result.should.be.instanceof(Object).and.should.not.be.empty();
            done();
        });

        it('should parse US-based raw address with target country to convert to', function(done) {
            var parser = new addressParser.AddressParser();
            var result = parser.parseRawAddress('123 Main Street, New York, NY 10001', 'RU');
            result.should.be.instanceof(Object).and.should.not.be.empty();

            var defaultParsed = parser.parseRawAddress('123 Main Street, New York, NY 10001');
            result.should.not.deepEqual(defaultParsed);
            done();
        });

        it('should handle invalid input raw address', function(done) {
            var parser = new addressParser.AddressParser();
            var result = parser.parseRawAddress(null);
            (result === null).should.be.true;
            done();
        });

        it('should handle valid address with invalid country code', function(done) {
            var parser = new addressParser.AddressParser();
            var result = parser.parseRawAddress('123 Main Street, New York, NY 10001', null);
            (result === null).should.be.true;
            done();
        })
    });
});
