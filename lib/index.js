/*
This file is part of the Nervatura Framework
http://www.nervatura.com
Copyright © 2011-2017, Csaba Kappel
License: LGPLv3
https://raw.githubusercontent.com/nervatura/nervatura/master/LICENSE
*/

var readFileSync = require('fs').readFileSync;
var path = require('path');
var ejs = require('ejs')
var out = require('nervatura').tools.DataOutput()

var Lang = require('nervatura').lang
var Conf = require('nervatura').conf
var basicStore = require('nervatura').storage.basicStore
var Nervastore = require('nervatura').nervastore

var Ndi = require('nervatura').ndi;
var Npi = require('nervatura').npi;
var Nas = require('nervatura').nas;

function render(file, data, dir){
  dir = dir || "template"
  var template = path.join(out.getValidPath(),"..","views",dir,file)
  return ejs.compile(readFileSync(template, 'utf8'), {
    filename: template})(data); }

function sendResult(result){
  switch (result.type) {
    case "error":
      return {
        statusCode:200,
        body: {"id":result.id || -1, "jsonrpc": "2.0", 
         "error": {"code": result.ekey, "message": result.err_msg, "data": result.data}}, 
        headers:{
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET, DELETE, POST, PUT, HEAD, PATCH',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          'Content-Type': 'application/json' }};
    
    case "csv":
      return {
        statusCode:200,
        body: result.data, 
        headers:{
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment;filename='+result.filename+'.csv' }};
    
    case "html":
      return {
        statusCode:200,
        body: render(result.tempfile, result.data, result.dir), 
        headers:{
          'Content-Type': 'text/html' }};
    
    case "xml":
      return {
        statusCode:200,
        body: render(result.tempfile, result.data), 
        headers:{
          'Content-Type': 'text/xml' }};
    
    case "json":
      return {
        statusCode:200,
        body: {"id": result.id, "jsonrpc": "2.0", "result": result.data}, 
        headers:{
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET, DELETE, POST, PUT, HEAD, PATCH',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          'Content-Type': 'application/json' }};

    default:
      return {
        statusCode:200,
        body: result }}}

exports.main = function (params) {
  
  if(params.method === "getVernum"){
    var version = require('./package.json').version+'-NJS/OWHISK';
    return sendResult(version); }
  
  var databases = require('./databases.json');
  var conf = Conf(params); var lang = Lang[conf.lang]
  
  var storage = basicStore({ data_store: conf.data_store, databases: databases,
    conf: conf, lang: lang, data_dir: conf.data_dir, host_type: conf.host_type});
  var nstore = Nervastore({ 
    conf: conf, data_dir: conf.data_dir, report_dir: conf.report_dir,
    host_ip: "", host_settings: conf.def_settings, storage: storage,
    lang: lang });
  
  switch (params.path) {
    case "ndi":
      return new Promise(function(resolve, reject) {
        Ndi(lang).getApi(nstore, params, function(result){
          resolve(sendResult(result)); });})
    
    case "npi":
      return new Promise(function(resolve, reject) {
        Npi(lang)(nstore, params, function(result){
          resolve(sendResult(result)); });});
    
    case "nas":
    default:
      return new Promise(function(resolve, reject) {
        Nas()(nstore, params, function(result){
          resolve(sendResult(result)); });});
  }
}
