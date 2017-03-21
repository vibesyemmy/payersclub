#!/bin/sh

curl --request POST \
  --url https://fxchange.club/1/jobs/genericMatch \
  --header 'cache-control: no-cache' \
  --header 'postman-token: eee6c78b-f27d-b900-7321-6e6d3eaf22db' \
  --header 'x-parse-application-id: 9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC' \
  --header 'x-parse-master-key: 2h7bu8iPlLZ43Vt80rB97X2CDFmY087P' \
  --data '{\n  "plan": "1"\n}'