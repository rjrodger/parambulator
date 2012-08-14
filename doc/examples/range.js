

var _             = require('underscore')
var parambulator  = require('parambulator')


var customrules = {
  rules: {
    range$: function(ctxt,cb) {
      var min = ctxt.rule.spec[0]
      var max = ctxt.rule.spec[1]
      
      val = Number(ctxt.point)

      if( _.isNumber(val) && !_.isNaN(val) ) {
        if( val < min || max < val ) {
          return ctxt.util.fail(ctxt,cb)
        }
      }

      return cb()
    }
  },
  msgs: {
    range$: 'The value <%=point%> is not within the range <%=rule.spec%> (property <%=parentpath%>).'
  },
  valid: {
    prop$:{name:'range$',rules:{type$:'array','*':{type$:'number'}}}//,required$:['0','1'],}}
  }
}


var rangeparams = parambulator({
  volume: {range$:[0,11]}
},customrules)


function printresult(err,res) {
  if(err) console.log(err.message);
}

rangeparams.validate({volume:-1},printresult)
rangeparams.validate({volume:0},printresult)
rangeparams.validate({volume:5},printresult)
rangeparams.validate({volume:11},printresult)
rangeparams.validate({volume:12},printresult)


try {
  parambulator({
    volume: {range$:1}
  },customrules)
}
catch(e) {
  console.log(e.message)
}

try {
  parambulator({
    volume: {range$:['a','b']}
  },customrules)
}
catch(e) {
  NOT WORKING - SHOULD FAIL
  console.log(e.message)
}
