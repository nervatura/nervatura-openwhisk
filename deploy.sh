#!/bin/bash

cd ./lib
npm install
zip -rq api.zip * -x node_modules/nervatura/public/**\* -x node_modules/nervatura/.git/**\* -x node_modules/nervatura/.vscode/**\*
bx wsk action create nturaApi --kind nodejs:8 api.zip --param-file ./settings.json
cd ../

bx wsk action create ndi_getVernum --kind nodejs:8 ./actions/ndi_getVernum.js --web true
bx wsk api create -n ndi /ndi /getVernum get ndi_getVernum --response-type http

bx wsk action create ndi_jsonrpc --kind nodejs:8 ./actions/ndi_jsonrpc.js --web true
bx wsk api create -n ndi /ndi /jsonrpc post ndi_jsonrpc --response-type http
bx wsk api create -n ndi /ndi /jsonrpc2 post ndi_jsonrpc --response-type http
bx wsk api create -n ndi /ndi /call/jsonrpc post ndi_jsonrpc --response-type http
bx wsk api create -n ndi /ndi /call/jsonrpc2 post ndi_jsonrpc --response-type http

bx wsk action create ndi_getData --kind nodejs:8 ./actions/ndi_getData.js --web true
bx wsk api create -n ndi /ndi /getData get ndi_getData --response-type http
bx wsk action create ndi_updateData --kind nodejs:8 ./actions/ndi_updateData.js --web true
bx wsk api create -n ndi /ndi /updateData get ndi_updateData --response-type http
bx wsk action create ndi_deleteData --kind nodejs:8 ./actions/ndi_deleteData.js --web true
bx wsk api create -n ndi /ndi /deleteData get ndi_deleteData --response-type http

bx wsk action create npi_jsonrpc --kind nodejs:8 ./actions/npi_jsonrpc.js --web true
bx wsk api create -n npi /npi /jsonrpc post npi_jsonrpc --response-type http
bx wsk api create -n npi /npi /jsonrpc2 post npi_jsonrpc --response-type http
bx wsk api create -n npi /npi /call/jsonrpc post npi_jsonrpc --response-type http
bx wsk api create -n npi /npi /call/jsonrpc2 post npi_jsonrpc --response-type http

bx wsk action create nas_databaseCreate --kind nodejs:8 ./actions/nas_databaseCreate.js --web true
bx wsk api create -n nas /nas /database/create get nas_databaseCreate --response-type http
bx wsk action create nas_databaseDemo --kind nodejs:8 ./actions/nas_databaseDemo.js --web true
bx wsk api create -n nas /nas /database/demo get nas_databaseDemo --response-type http
bx wsk action create nas_reportList --kind nodejs:8 ./actions/nas_reportList.js --web true
bx wsk api create -n nas /nas /report/list get nas_reportList --response-type http
bx wsk action create nas_reportInstall --kind nodejs:8 ./actions/nas_reportInstall.js --web true
bx wsk api create -n nas /nas /report/install get nas_reportInstall --response-type http
bx wsk action create nas_reportDelete --kind nodejs:8 ./actions/nas_reportDelete.js --web true
bx wsk api create -n nas /nas /report/delete get nas_reportDelete --response-type http