/*
This file is part of the Nervatura Framework
http://www.nervatura.com
Copyright © 2011-2017, Csaba Kappel
License: LGPLv3
https://raw.githubusercontent.com/nervatura/nervatura/master/LICENSE
*/

function main(params) {
  var ow = require('openwhisk')();
  params.path = "npi"; 
  params.method = "jsonrpc";
  
  return ow.actions.invoke({actionName:"nturaApi", params:params, blocking:true})
  .then(result => {
    return result.response.result;
  }).catch(err => {
    return err;
  });
}