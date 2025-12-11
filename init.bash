#!/bin/bash
# copy necessary files into local directory, once ./pbp has been copied
if [ -z "./pbp/" ]; then
    echo "Error: You need to make a copy of ./pbp/ before running this init.bash script"
    echo "   see ${PBP_ROOT}/import-minimal.bash"
    echo "   where ${PBP_ROOT} is the path to your copy of the full pbp development repository"
    exit 1
fi
cp ./pbp/das/PBP.xml .
cp ./pbp/kernel/package.json .
npm install yargs prompt-sync ohm-js @xmldom/xmldom

