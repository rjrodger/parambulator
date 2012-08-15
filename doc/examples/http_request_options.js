/*

Validate HTTP request options
=============================

Validate the options accepted by http.request.
See http://nodejs.org/api/http.html#http_http_request_options_callback


*/


var parambulator = require('parambulator')

var paramcheck = parambulator({ 
  host:         {type$:'string'},
  hostname:     {type$:'string'},
  port:         {type$:'integer'},
  localAddress: {type$:'string'},
  socketPath:   {type$:'string'},
  method:       {enum$:['DELETE','GET','HEAD','POST','PUT','CONNECT','OPTIONS','TRACE','COPY','LOCK','MKCOL','MOVE','PROPFIND','PROPPATCH','SEARCH','UNLOCK','REPORT','MKACTIVITY','CHECKOUT','MERGE','MSEARCH','M-SEARCH','NOTIFY','SUBSCRIBE','UNSUBSCRIBE','PATCH','PURGE']},
  path:         {type$:'string'},
  headers:      {type$:'object'},
  auth:         {wild$:'*:*'},
})


// print out any errors
function printresult(err,res) {
  if(err) console.log(err.message);
}



// these pass
paramcheck.validate( { 
  host: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST'
}, printresult )

paramcheck.validate( { 
  auth: 'user1:pass1'
}, printresult )



// these fail

paramcheck.validate( {
  port: '80',
}, printresult )

paramcheck.validate( {
  method: 'FOO'
}, printresult )

paramcheck.validate( {
  headers: true
}, printresult )





