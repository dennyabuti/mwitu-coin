#!/bin/bash
# instance names of our cluster
INSTANCES=("mwitu0"
"mwitu1"
"mwitu2"
"mwitu3"
)
URLS=()
data=""
# get ips of our INSTANCES
port=4040
for instance in "${INSTANCES[@]}"
do
  # stop instance if it exists
  docker stop ${instance}
  # remove instance if it exists
  docker rm ${instance}
  # create instance
  docker run -d -p "${port}":4040 --name "${instance}" -t mwitu_image bash
  sleep 3
  host="$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${instance})"
  URLS+=("localhost:${port}")
  data+="\"${host}:4040\"",
  port=$((port+1))
done

# replace trailing comma with ]
data=["${data/%,/}"]
for baseUrl in "${URLS[@]}"
do
  echo ${baseUrl}/nodes/register
  json={\"nodes\":${data}}
  echo $json
  # make all nodes know about each other
  curl -X POST -H "Content-Type:application/json"  --globoff -d "${json}"  http://"${baseUrl}"/nodes/register 
done
