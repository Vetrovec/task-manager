#!/bin/bash

npm run start:frontend &
npm run start:backend &
npm run proxy &
wait -n

exit $?
