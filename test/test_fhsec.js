var util = require('util');
var fhs = require("../lib/apis.js");
var fhserver = new fhs.FHServer(null, null);
var text = 'This is test text';

module.exports = {
  'test keygen with no keysize': function(test, assert){
    fhserver.sec({act:'keygen', params: {algorithm:'AES'}}, function(err, result){
      assert.ok(err);
      test.finish();
    });
  },
  'test keygen AES': function(test, assert){
    fhserver.sec({act:'keygen', params:{algorithm: 'AES', keysize: 128}}, function(err, result){
      assert.ok(!err);
      assert.ok(result.secretkey);
      assert.ok(result.iv);
      test.finish();
    });
  },
  'test keygen RSA': function(test, assert){
    fhserver.sec({act:'keygen', params:{algorithm:'RSA', keysize: 1024}}, function(err, result){
      assert.ok(!err);
      assert.ok(result.public);
      assert.ok(result.private);
      assert.ok(result.modulu);
      test.finish();
    });
  },
  'test keygen with no params' : function(test, assert){
    fhserver.sec({act:'keygen'}, function(err, result){
      assert.ok(err);
      test.finish();
    });
  },
  'test aes encrypt/decrypt': function(test, assert){
    var plaintext = 'This is test text';
    fhserver.sec({act:'keygen', params:{algorithm: 'AES', keysize: 128}}, function(err, result){
      fhserver.sec({act:'encrypt', params:{algorithm:'AES', key: result.secretkey, iv: result.iv, plaintext:plaintext}}, function(e, r){
        assert.ok(!e);
        var ciphertext = r.ciphertext;
        fhserver.sec({act:'decrypt', params:{algorithm:'AES', key: result.secretkey, iv: result.iv, ciphertext:ciphertext}}, function(de, dr){
          assert.equal(dr.plaintext, plaintext);
          test.finish();
        });
      });
    });
  },
  'test aes encrypt with missing params' : function(test, assert){
    fhserver.sec({act:'encrypt', params:{algorithm:'AES'}}, function(err, result){
      assert.ok(err);
      test.finish();
    });
  },
  'test rsa encrypt/decrypt': function(test, assert){
    var plaintext = 'This is test text';
    fhserver.sec({act:'keygen', params:{algorithm:'RSA', keysize: 1024}}, function(err, result){
      assert.ok(!err);
      fhserver.sec({act:'encrypt', params:{algorithm:'RSA', plaintext:plaintext, public: result.public}}, function(e, r){
        assert.ok(!e);
        fhserver.sec({act:'decrypt', params:{algorithm:'RSA', ciphertext:r.ciphertext, private: result.private}}, function(de, dr){
          assert.ok(!de);
          assert.equal(plaintext, dr.plaintext);
          test.finish();
        });
      });
    });
  },
  'test hashing md5': function(test, assert){
    fhserver.hash({algorithm:'md5', text: text}, function(err, result){
      assert.ok(!err);
      assert.ok(result.hashvalue);
      test.finish();
    });
  },
  'test hashing sha1': function(test, assert){
    fhserver.hash({algorithm:'sha1', text: text}, function(err, result){
      assert.ok(!err);
      assert.ok(result.hashvalue);
      test.finish();
    });
  },
  'test hashing sha256': function(test, assert){
    fhserver.hash({algorithm:'sha256', text: text}, function(err, result){
      assert.ok(!err);
      assert.ok(result.hashvalue);
      test.finish();
    });
  },
  'test hashing sha512': function(test, assert){
    fhserver.hash({algorithm:'sha512', text: text}, function(err, result){
      assert.ok(!err);
      assert.ok(result.hashvalue);
      test.finish();
    });

  }
}