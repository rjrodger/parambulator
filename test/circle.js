/* Copyright (c) 2010-2013 Richard Rodger */

'use strict';

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var assert = require('chai').assert
var gex    = require('gex')

var parambulator = require('..')


describe('circle', function() {

  var pb

  it('circle', function(done) {
    pb = parambulator({
      string$: ['foo']
    },  {msgs: {
      'string$': 'circle: <%=json(point)%>'
    }})
                     

    var a = {}
    a.foo = a

    var res = pb.validate(a)
    assert.equal('circle: {"foo":"[CIRCULAR-REFERENCE]"}',res.message)
    done()
  }) 

})


