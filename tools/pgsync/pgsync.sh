#!/bin/sh

./wait-for-it.sh $PG_HOST:$PG_PORT -t 60
./wait-for-it.sh $ELASTICSEARCH_HOST:$ELASTICSEARCH_PORT -t 60

bootstrap --config /code/schema.json
pgsync --config /code/schema.json --daemon
