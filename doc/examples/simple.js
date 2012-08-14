/*

Create a Parameter Check
========================

Use parambulator to define a set of rules that input paramters must obey.

*/

// use require to load the parambulator module
// a single function, parambulator, is returned
var parambulator = require('parambulator')

// create a new instance, providing a "param spec" as the first argument
// the param spec defined the properties you expect to see, and the rules that should apply to them
// in this case, you want your input parameters to have a price property, the value of which is a number
var paramcheck = parambulator({ 
  price: {type$:'number'}
})


// print out any errors
function printresult(err,res) {
  if(err) console.log(err.message);
}



// this passes - price is a number
paramcheck.validate( { price: 10.99 }, printresult )


// this fails - price is a string
paramcheck.validate( { price: 'free!' }, printresult )
// output: The value 'free!' is not of type 'number' (parent: price). 


// this also fails - price is an object
paramcheck.validate( { price: {foo:'bar'} }, printresult )
// output: The value '{"foo":"bar"}' is not of type 'number' (parent: price).


