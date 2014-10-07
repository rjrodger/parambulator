/* Copyright (c) 2014 Richard Rodger, MIT License */
"use strict";


if( 'undefined' === typeof parambulator ) {
  var parambulator = require('..')
}


if( 'undefined' === typeof _ ) {
  var _ = require('underscore')
}


function s(obj){
  return JSON.stringify(obj)
}


var assert = {
  isNull: function(x){
    expect(x).toBe(null)
  },
  isNotNull: function(x){
    expect(x).toNotBe(null)
  },
  equal: function(x,y){
    expect(x).toBe(y)
  },
  isTrue: function(x){
    expect(!!x).toBe(true)
  },
  ok: function(x){
    expect(!!x).toBe(true)
  },
}


describe('parambulator', function() {

  var pb = parambulator({
    atmostone$: ['path','from'],

    search: {
      required$: ['find','replace']
    },
    
    exactlyone$: ['red','blue'],
    atleastone$: ['a','b'],
    
    sub: {
      dub: {
        exactlyone$: ['x','y','z'],
      }
    },

    required$: ['foo','bar'],
    notempty$: ['z'],
  })


  it('no_input', function() {
    pb.validate(void 0,function(err){
      assert.equal('no_input$',err.parambulator.code)
    })
  })


  it('required$', function() {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })
    
    pb.validate({a:1,z:1,red:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })
  })


  it('exactlyone$', function() {
    pb.validate({a:1,z:1,red:1, foo:1,bar:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,blue:1, foo:1,bar:1},function(err,res){
      assert.isNull(err)
    })
    
    pb.validate({a:1,z:1,foo:1,bar:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })
    
    pb.validate({a:1,z:1,red:1,blue:1, foo:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })
  })


  it('atmostone$', function() {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1, from:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, path:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, path:1,from:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('atmostone$',err.parambulator.code)
    })
  })


  it('atleastone$', function() {
    pb.validate({z:1, red:1,foo:1,bar:1,from:1, a:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({z:1, red:1,foo:1,bar:1,from:1, b:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({red:1,foo:1,bar:1,from:1, a:1,z:1,b:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({z:1, red:1,foo:1,bar:1,from:1 },function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('atleastone$',err.parambulator.code)
    })
  })


  it('search', function() {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1, search:{find:1,replace:1}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, search:{find:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, search:{replace:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })
  })



  it('sublevels', function() {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{x:1}}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{y:1}}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{z:1}}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{}}},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{x:1,y:1}}},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{x:1,y:1,z:1}}},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })
  })


  it('notempty$', function() {
    pb.validate({a:1,z:'',red:1,foo:1,bar:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('notempty$',err.parambulator.code)
    })

    pb.validate({a:1,z:null,red:1,foo:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('notempty$',err.parambulator.code)
    })

    pb.validate({a:1,z:undefined,red:1,foo:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('notempty$',err.parambulator.code)
    })
  })


  it('pbeasy', function() {
    var pbeasy_one = parambulator({one:{string$:true,required$:true}})

    pbeasy_one.validate({one:'a'},function(err,res){
      assert.isNull(err)
    })

    pbeasy_one.validate({},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })


    var pbeasy_deep = parambulator({one:{required$:true,two:{string$:true,required$:true}}})

    pbeasy_deep.validate({one:{two:'a'}},function(err,res){
      assert.isNull(err)
    })

    pbeasy_deep.validate({one:{}},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })


    var pbeasy_two = parambulator({a:1,b:'q',c:{required$:true}})

    pbeasy_two.validate({a:1,b:'q',c:'w'},function(err,res){
      assert.isNull(err)
    })

    pbeasy_two.validate({a:1,b:'q'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })
  })




  var pb_array = new parambulator({
    z: 'required$',
    foo: {
        
      '__1': {
        bar: 'required$'
      },
      
      '__0': 'required$',
    },
  })


  it('array-z', function() {
    pb_array.validate({z:1},function(err,res){
      assert.isNull(err)
    })

    pb_array.validate({},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })
  })


  it('array-index0', function() {
    pb_array.validate({z:1},function(err,res){
      assert.isNull(err)
    })
    
    pb_array.validate({z:1,foo:[10]},function(err,res){
      assert.isNull(err)
    })
    
    pb_array.validate({z:1,foo:[]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })
  })


  it('array-index1', function() {

    pb_array.validate({z:1,foo:[10]},function(err,res){
      assert.isNull(err)
    })

    pb_array.validate({z:1,foo:[{},{bar:1}]},function(err,res){
      assert.isNull(err)
    })

    pb_array.validate({z:1,foo:[{},{}]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })

    pb_array.validate({z:1,foo:[{},{barx:1}]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })
  })


  
  it('circle', function() {
    var pb = parambulator({
      string$: ['foo']
    },  {msgs: {
      'string$': 'circle: <%=json(point)%>'
    }})
                     

    var a = {}
    a.foo = a

    var res = pb.validate(a)
    assert.equal('circle: {"foo":"[CIRCULAR-REFERENCE]"}',res.message)
  }) 



  var pb_custom = parambulator({
    required$: 'req',
    equalsbar$: 'foo',
    exactlyone$: ['a','b']
  }, {
    rules: {
      equalsbar$: function(ctxt,cb) {
        var pn = ctxt.rule.spec
        var val = ctxt.point[pn]
        if( 'bar' == val ) {
          return cb(null)
        }
        else {
          return ctxt.util.fail(ctxt,cb)
        }
      }
    },
    msgs: {
      required$:'Property %s is required, yo! At %s.',
      equalsbar$:'Property %s is not equal to "bar", man... At %s.',
      exactlyone$: function(inserts) {
        return 'my custom error msg for '+inserts.rule.spec+' at location '+inserts.parentpath
      }
    }
  })

  it('custom-equalsbar', function() {
    pb_custom.validate({req:1,a:1,foo:'bar'},function(err,res){
      assert.isNull(err)
    })

    pb_custom.validate({req:1,a:1,foo:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'equalsbar$')
    })

    pb_custom.validate({req:1,a:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'equalsbar$')
    })

    pb_custom.validate({a:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })

    pb_custom.validate({req:1,foo:'bar', a:1,b:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'exactlyone$')
      assert.equal(err.message,'my custom error msg for a,b at location top level')
    })
  })



  var pb_default = parambulator({
    a: {default$:123, type$:'number'},
    b: {
      firstobj: {default$:23, type$:'number'}, 
      secondobj: {innerobj: {default$:'test'}},
      thirdobj: {type$:'array', __0: {default$:123}},  
    },
    c: {default$:555, type$:'number'},
    d: {type$: 'array', __0: {default$:'arraytest0'}, __1: {default$:'arraytest1'}},
    e: {type$: 'array', default$:[]},
    
    // TODO: handle this case
    //f: {default$:'aa', type$:'number'}
  })


  it('default-firsttest', function() {
    var obj = {c: 2222}
    pb_default.validate(obj)

    assert.isTrue(_.has(obj, 'a'))
    assert.equal(obj['a'], 123)

    assert.isTrue(_.has(obj, 'b'))
    assert.isTrue(_.has(obj['b'], 'firstobj'))
    assert.equal(obj['b']['firstobj'], 23)

    assert.isTrue(_.has(obj['b'], 'secondobj'))
    assert.isTrue(_.has(obj['b']['secondobj'], 'innerobj'))
    assert.equal(obj['b']['secondobj']['innerobj'], 'test')

    assert.isTrue(_.has(obj['b'], 'thirdobj'))
    assert.isTrue(_.isArray(obj['b']['thirdobj']))
    assert.equal(obj['b']['thirdobj'][0], 123)

    assert.isTrue(_.has(obj, 'c'))
    assert.equal(obj['c'], 2222)

    assert.isTrue(_.has(obj, 'd'))
    assert.isTrue(_.isArray(obj['d']))
    assert.equal('arraytest0', obj['d'][0])
    assert.equal('arraytest1', obj['d'][1])
    
    assert.isTrue(_.has(obj, 'e'))
    assert.isTrue(_.isArray(obj['e']))
    assert.equal(0, obj['e'].length)
  })


  it('default-nice', function() {
    parambulator({
      c: {default$:555, type$:'number'},
      d: {type$: 'number', __0: {default$:'arraytest0'}, __1: {default$:'arraytest1'}},
    })
  })



  var pb_format= parambulator({
    a: {format$:'datetime'},
    b: {format$:'date'},
    c: {format$:'time'},
    d: {format$:'utcmillisec'},
    e: {format$:'re'},
    f: {format$:['date', 'time']},
  })


  it('format-datetime', function() {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({a:'2012-02-02T11:12:13Z'},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({a:'2012-02-02'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
  })

  it('format-date', function() {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({b:'2012-02-02'},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({b:'2012-32-02'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
  })

  it('format-time', function() {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({c:'11:12:13Z'},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({c:'51:12:13Z'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
  })

  it('format-utcmillisec', function() {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({d:124578},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({d:'test'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
  })
  
  it('format-re', function() {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({e:/([0-1]\d|2[0-4]):[0-5]\d:[0-5]\dZ/},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({e:124578},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
  })
  

  it('format-date-time', function() {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({f:'2012-02-02'},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({f:'2012-32-02'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb_format.validate({f:'11:12:13Z'},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({f:'51:12:13Z'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb_format.validate({f:124578},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb_format.validate({f:/([0-1]\d|2[0-4]):[0-5]\d:[0-5]\dZ/},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb_format.validate({f:124578},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb_format.validate({f:'test'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
  })



  var pb_ownparams = parambulator.ownparams


  it('ownparams-strings$', function() {

    for( var r in {required$:1,notempty$:1,atmostone$:1,exactlyone$:1,atleastone$:1} ) {
      var args = {}

      args[r]='foo'
      pb_ownparams.validate(args,function(err,res){
        assert.isNull(err)
      })


      args[r]=['foo','bar']
      pb_ownparams.validate(args,function(err,res){
        assert.isNull(err)
      })

      args[r]=1
      pb_ownparams.validate(args,function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'strings$')
      })


      args = {}

      args['foo']={}
      args['foo'][r]='bar'
      pb_ownparams.validate(args,function(err,res){
        assert.isNull(err)
      })

      args['foo']={}
      args['foo'][r]=1
      pb_ownparams.validate(args,function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'strings$')
      })
    }

  })


  it('ownparams-wild$', function() {
    pb_ownparams.validate({a:{wild$:'b*'}},function(err,res){
      assert.isNull(err)
    })

    pb_ownparams.validate({a:{wild$:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })


  it('ownparams-type$', function() {
    pb_ownparams.validate({a:{type$:'string'}},function(err,res){
      assert.isNull(err)
    })

    pb_ownparams.validate({a:{type$:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })


  it('ownparams-re$', function() {
    pb_ownparams.validate({a:{re$:'/b/'}},function(err,res){
      assert.isNull(err)
    })

    pb_ownparams.validate({a:{re$:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })


  it('ownparams-enum$', function() {
    pb_ownparams.validate({a:{enum$:[11,22]}},function(err,res){
      assert.isNull(err)
    })

    pb_ownparams.validate({a:{enum$:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })



  it('single', function() {
    var pm, res

    pm = parambulator({foo:'required$'})
    res = pm.validate({foo:'1'})
    assert.ok( null == res )

    res = pm.validate({bar:'1'})
    assert.ok( null != res )
    assert.equal('required$',res.parambulator.code)
    assert.ok(res.parambulator.point.bar)
  })


  it('multiple', function() {
    var pm, res

    pm = parambulator({foo:'required$,integer$'})
    res = pm.validate({foo:1})
    assert.ok( null == res )

    res = pm.validate({bar:1})
    assert.ok( null != res )
    assert.equal('required$',res.parambulator.code)
    assert.ok(res.parambulator.point.bar)

    res = pm.validate({foo:'zoo'})
    assert.ok( null != res )
    //console.log(res)
    assert.equal('integer$',res.parambulator.code)
    assert.ok(res.parambulator.point.foo)
  })





  var pb_type = parambulator({
    a: {type$:'string'},
    b: {type$:'number'},
    c: {type$:'integer'},
    d: {type$:'boolean'},
    e: {type$:'date'},
    f: {type$:'array'},
    g: {type$:'object'},
    h: {type$:['date','string','array']},
    i: {type$:['object']},
  })


  it('type-multi-types-1', function() {
    pb_type.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({h:'foo'},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({h:new Date()},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({h:[1, 2, '3']},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({h:11.1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({h:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({h:true},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({h:{a:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })

  it('type-multi-types-2', function() {
    pb_type.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({i:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({i:new Date()},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({i:[1, 2, '3']},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({i:11.1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({i:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({i:true},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({i:{a:1}},function(err,res){
      assert.isNull(err)
    })
  })



  it('type-string', function() {
    pb_type.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({a:'foo'},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({a:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })



  it('type-number', function() {
    pb_type.validate({b:1.1},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({b:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })


  it('type-integer', function() {
    pb_type.validate({c:1},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({c:1.1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })


  it('type-boolean', function() {
    pb_type.validate({d:true},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({d:false},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({d:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })


  it('type-date', function() {
    pb_type.validate({e:new Date()},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({e:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
    
    pb_type.validate({e:{a:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })


  it('type-array', function() {
    pb_type.validate({f:[]},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({f:[11]},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({f:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({f:{a:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })


  it('type-object', function() {
    pb_type.validate({g:null},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({g:{}},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({g:{a:1}},function(err,res){
      assert.isNull(err)
    })

    pb_type.validate({g:new Date()},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_type.validate({g:[]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })




  var pb_value = parambulator({
    a: 'a',
    b: 'b*',
    c: {wild$:'*c'},
    d: {eq$:'d*'},
    e: {re$:'e[z]'},
    f: {re$:'/f[z]/i'},
    g: {enum$:['A','B','C']},
    h: {minlen$:2},
    i: {maxlen$:6},
    j: {lt$: 2},
    k: {lt$: new Date("2012-09-04")},
    l: {lte$: 2},
    m: {lte$: new Date("2012-09-04")},
    n: {gt$: 2},
    o: {gt$: new Date("2012-09-04")},
    p: {gte$: 2},
    q: {gte$: new Date("2012-09-04")},
    r: {min$: 2},
    s: {min$: new Date("2012-09-04")},
    t: {max$: 2},
    u: {max$: new Date("2012-09-04")},
    v: {uniq$: [true]},
    wild$:'top*', // does nothing
  })


  it('value-wild$', function() {

    pb_value.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({a:'a'},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({b:'bx'},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({c:'xc'},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({a:'b'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'wild$')
    })

  })


  it('value-eq$', function() {
    pb_value.validate({d:'d*'},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({d:'dx'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'eq$')
    })
  })


  it('value-minlen$', function() {
    // test for string values
    pb_value.validate({h:'abcde'},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({h:'a'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'minlen$')
    })

    // test arrays
    pb_value.validate({h:[1,2,3,4]},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({h:[1]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'minlen$')
    })


    // test objects
    pb_value.validate({h:{1:1, 2:2, 3:3, 4:4}},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({h:{1:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'minlen$')
    })
  })


  it('value-maxlen$', function() {
    // test string values
    pb_value.validate({i:'abcde'},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({i:'abcdefgh'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'maxlen$')
    })

    // test arrays
    pb_value.validate({i:[1,2,3,4,5]},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({i:[1,2,3,4,5,6,7]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'maxlen$')
    })

    // test objects
    pb_value.validate({i:{1:1, 2:2, 3:3, 4:4, 5:5}},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({i:{1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'maxlen$')
    })

  })


  it('value-lt$', function() {
    pb_value.validate({j: 1},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({j: 3}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'lt$')
    })
    
    pb_value.validate({k: new Date("2012-09-03")}, function(err,res) {
      assert.isNull(err)
    })
    
    pb_value.validate({k: new Date("2012-09-04")}, function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'lt$')
    })
  })


  it('value-lte$', function() {
    pb_value.validate({l: 1},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({l: 2},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({l: 3}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'lte$')
    })
    
    pb_value.validate({m: new Date("2012-09-04")}, function(err,res) {
      assert.isNull(err)
    })
    
    pb_value.validate({m: new Date("2012-09-05")}, function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'lte$')
    })
  })


  it('value-gt$', function() {
    pb_value.validate({n: 3},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({n: 2}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'gt$')
    })
    
    pb_value.validate({o: new Date("2012-09-05")}, function(err,res) {
      assert.isNull(err)
    })
    
    pb_value.validate({o: new Date("2012-09-04")}, function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'gt$')
    })
  })


  it('value-gte$', function() {
    pb_value.validate({p: 2},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({p: 3},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({p: 1}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'gte$')
    })
    
    pb_value.validate({q: new Date("2012-09-04")},function(err,res) {
      assert.isNull(err)
    })
    
    pb_value.validate({q: new Date("2012-09-03")},function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'gte$')
    })      
  })


  it('value-min$', function() {
    pb_value.validate({r: 2},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({r: 3},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({r: 1}, function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'min$')
    })
    
    pb_value.validate({s: new Date("2012-09-04")},function(err,res) {
      assert.isNull(err)
    })
    
    pb_value.validate({s: new Date("2012-09-03")},function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'min$')
    })      
  })


  it('value-max$', function() {
    pb_value.validate({t: 1},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({t: 2},function(err,lt){
      assert.isNull(err)
    })

    pb_value.validate({t: 3},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'max$')
    })
    
    pb_value.validate({u: new Date("2012-09-04")},function(err,res){
      assert.isNull(err)
    })
    
    pb_value.validate({u: new Date("2012-09-05")},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'max$')
    })
  })

  
  it('value-uniq$', function() {
    pb_value.validate({v: [1,2,3]},function(err,res){
      assert.isNull(err)
    })
    
    pb_value.validate({v: [1,2,3,1]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code, 'uniq$')
    })
  })
  
  
  it('value-re$', function() {
    pb_value.validate({e:'ez'},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({e:'ex'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'re$')
    })

    pb_value.validate({f:'FZ'},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({f:'fx'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'re$')
    })
  })


  it('value-enum$', function() {
    pb_value.validate({g:'A'},function(err,res){
      assert.isNull(err)
    })

    pb_value.validate({g:'X'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'enum$')
    })
  })


  it('value-toplevel', function() {

    var pb = parambulator({
      type$:'object'
    })

    pb_value.validate({},function(err){
      assert.isNull(err)
    })
    
    pb_value.validate("foo",function(err){
      assert.isNotNull(err)
    })
  })




  var pb_wild = parambulator({
    
    atmostone$: 'a*',

    '*': {
      a:{type$:'integer'}
    },

    y: {
      '*': {
        a:{type$:'integer'}
      },
    },

    '**': {
      b:{type$:'integer'}
    },

    'z*': 'required$'
  })


  //console.log(''+pb)


  it('wild-a*', function() {
    pb_wild.validate({z:1,},function(err,res){
      assert.isNull(err)
    })

    pb_wild.validate({z:1,c:1},function(err,res){
      assert.isNull(err)
    })


    pb_wild.validate({z:1,a:1},function(err,res){
      assert.isNull(err)
    })

    pb_wild.validate({z:1,a:1,ax:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'atmostone$')
    })
  })


  it('wild-star', function() {
    pb_wild.validate({z:1,x:{a:1},y:{a:2}},function(err,res){
      assert.isNull(err)
    })

    pb_wild.validate({z:1,x:{a:'b'}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_wild.validate({z:1,x:[{a:1},{a:2}]},function(err,res){
      assert.isNull(err)
    })

    pb_wild.validate({z:1,y:[{a:1},{a:2}]},function(err,res){
      assert.isNull(err)
    })


    pb_wild.validate({z:1,y:[{a:'b'}]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

  })



  it('wild-**', function() {

    pb_wild.validate({z:1,b:1,x:{a:1,b:1,y:{b:1}}},function(err,res){
      assert.isNull(err)
    })

    pb_wild.validate({z:1,b:'foo'},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })


    pb_wild.validate({z:1,x:{b:'foo'}},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb_wild.validate({z:1,x:{y:{b:'foo'}}},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
  })


  it('wild-z*', function() {
    pb_wild.validate({z:1},function(err,res){
      assert.isNull(err)
    })


    pb_wild.validate({za:1},function(err,res){
      assert.isNull(err)
    })

    pb_wild.validate({},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })
  })

})

