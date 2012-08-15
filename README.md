# parambulator - Node.js module


A simple way to generate nice error messages for named parameters.

If you're using this module, feel free to contact me on twitter if you have any questions! :) [@rjrodger](http://twitter.com/rjrodger)

Current Version: 0.0.1

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


_Why?_

You're writing a module and you accept configuration as a structured JavaScript object. For example, opening a database connection: [MongoDB driver](http://mongodb.github.com/node-mongodb-native/api-generated/server.html). Or you want to have named parameters: [http.request](http://nodejs.org/api/http.html#http_http_request_options_callback).

It's nice to be able to validate the input and provide useful error messages, without hand-coding the validation.


_But What About JSONSchema!_

Yes, [JSONSchema](http://json-schema.org) would be the proper way to do this. But the syntax is too hard, and the error messages aren't friendly. This is a [Worse is Better!](http://www.jwz.org/doc/worse-is-better.html) approach.

There's also a philosophical difference. JSONSchema defines a formal structure, so you need to be fairly precise and complete. Parambulator defines a list of rules that are tested in the order you specify, and you can be vague and incomplete.


Key Features:

   * Easy syntax, rules are tested in order
   * Add your own rules
   * Customize the error messages
   
This is still an early version so there's probably some wierdness - let me know.




## Installation

    npm install parambulator

And in your code:

    var parambulator = require('parambulator')


## Usage

Import the module using the standard _require_ syntax:

```javascript
var parambulator = require('parambulator')
```

This is a function that creates _Parambulator_ object instances. This function accepts two arguments:

   * _spec_ - the rule specification to test against
   * _pref_ - your preferences, such as custom error messages and rules

Example:

```javascript
var paramcheck = parambulator({ price: {type$:'number'} })
```


The _paramcheck_ variable is an instance of _Parambulator_. This object only has one method: _validate_, which accepts two arguments:

   * _args_: the object to validate
   * _cb_: a callback function, following the standard Node.js error convention (first arg is an Error)

Example:

```javascript
paramcheck.validate( { price: 10.99 }, function(err) { console.log(err) } )
```


The callback function is called when the validation has completed. Processing of rules stops as soon as a rule fails. If validation fails, the first argument to the callback will be a standard JavaScript _Error_ object, with an error message in the _message_ property.




### Rules

The validation rules are defined in the _spec_ argument to _parambulator_. The rules are specified as an object, the properties of which are the rule names, and the values the rule options, like so: `{required$:['foo','bar']}`. The rules are executed in the order that they appear (JavaScript preserves the order of object properties).

Rule names always end with a `$` character. Properties that do not end with `$` are considered to be literal property names:

```javascript
{
  required$: ['foo','bar'],
  foo: {
    type$: 'string'
  }
}
```

This specification requires the input object to have two properties, _foo_ and _bar_, and for the _foo_ property to have a string value. For example, this is valid:

```javascript
{ foo:'hello', bar:1 }
```

But these are not:
```javascript
{ foo:1, bar:1 }  // foo is not a string
{ foo:'hello' }   // bar is missing
```

The rules are evaluated in the order they appear:

   1. at the current property (i.e. the top level), check for properties _foo_ and _bar_, as per `required$: ['foo','bar']`
   2. descend into the _foo_ property, and check that it's value is of `type$: 'string'` 

You can nest rules within other rules. They will be evaluated in the order they appear, depth first.

For each input property, the rules apply to the value or values within that property. This means that your rule specification mirrors the structure of the input object.

For example, the specification:

```javascript
{
  foo: {
    bar: { type$: 'integer' }
  }
}
```

matches

```javascript
{ foo: { bar: 1 } }
```

but does not match

```javascript
{ bar: { foo: 1 } }
```

In general, rules are permissive, in that they only apply if a given property is present. You need to use the _required$_ rule to require that a property is always present in the input.

Each rule has a specific set of options relevant to that rule. For example, the _required$_ rule takes an array of property names. The type$ rule takes a string indicating the expected type: _string_, _number_, _boolean_, etc. For full details, see the rule descriptions below.

Literal properties can also accept a wildcard string expression. For example:

```javascript
{ foo: "ba*" }
```

This matches:

```javascript
{ foo: "ba" }
{ foo: "bar" }
{ foo: "barx" }
```

but not

```javascript
{ foo: "b" }
```



### Wildcards

Sometimes you don't know the property names in advance. To handle this case, you can also use wildcard expressions in literal properties:

```javascript
{ 'a*': { type$: 'boolean' } }
```

This matches:

```javascript
{
  a: true,
  ax: false,
  ayz: true
}
```

In particular, `'*'` on its own will match any property (at the same level). Wildcard expressions have the usual syntax: `*` means match anything, and `?` means match a single character.


What about repeatedly nested rules? In this situation, you want to apply the same set of rules at any depth. You can use the special literal property `'**'` to achieve this:

```javascript
{ '**': { a: {type$: 'boolean' } } }
```

This matches:

```javascript
{ a:1, x:{a:2, y:{a:3}}}
```

ensuring that any properties called _a_ will be an integer. The recursive descent starts from the current level.


### Arrays


### Escaping



### Custom Errors

aaa



## Rules

aaa

### literal property

### required$

aaa


## Custom Rules

aaa

### Validation of Custom Rules

aaa


