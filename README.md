# parambulator - Node.js module


A simple way to generate nice error messages for named parameters.

If you're using this module, feel free to contact me on twitter if you have any questions! :) [@rjrodger](http://twitter.com/rjrodger)

Current Version: 0.0.8

Tested on: node 0.6.15, 0.8.6, 0.9.0


Use this module to validate input or configuration parameters provided as JSON. You can ensure that the JSON structure and data types are what you need. You'll get friendly, useful error messages for your users, and that makes your API better!

```javascript
var parambulator = require('parambulator')

var paramcheck = parambulator({ 
  price: {type$:'number'}
})

// this passes
paramcheck.validate( { price: 10.99 }, function(err) { console.log(err) } )

// this fails - price should a number
paramcheck.validate( { price: 'free!' }, function(err) { console.log(err) } )
// output: The value 'free!' is not of type 'number' (parent: price). 
```

This module depends on the excellent [underscore](https://github.com/documentcloud/underscore) module.


_But What About JSONSchema!_

Yes, [JSONSchema](http://json-schema.org) would be the proper way to do this. But the syntax is too hard, and the error messages aren't friendly. This is a [Worse is Better!](http://www.jwz.org/doc/worse-is-better.html) approach.

There's also a philosophical difference. JSONSchema defines a formal structure, so you need to be fairly precise and complete. Parambulator defines a list of rules that are tested in the order you specify, and you can be vague and incomplete.


Key Features:

   * Easy syntax, rules are tested in order
   * Add your own rules
   * Customize the error messages
   
This is still an early version so there's probably some wierdness - let me know.


_Why?_


You're writing a module and you accept configuration as a structured JavaScript object. For example, opening a database connection: [MongoDB driver](http://mongodb.github.com/node-mongodb-native/api-generated/server.html). Or you want to have named parameters: [http.request](http://nodejs.org/api/http.html#http_http_request_options_callback).

It's nice to be able to validate the input and provide useful error messages, without hand-coding the validation.


## Installation

    npm install parambulator

And in your code:

    var parambulator = require('parambulator')


## Usage

TODO




