/* Copyright (c) 2010-2013 Richard Rodger */

"use strict";


var assert = require('chai').assert
var gex    = require('gex')

var parambulator = require('..')


describe('circle', function() {

  var pb

  it('circle', function() {
    pb = parambulator({
      string$: ['foo']
    },  {msgs: {
      'string$': 'circle: <%=json(point)%>'
    }})
                     

    var a = {}
    a.foo = a

    var res = pb.validate(a)
    assert.equal('circle: {"foo":"[CIRCULAR-REFERENCE]"}',res.message)
  }) 

})


