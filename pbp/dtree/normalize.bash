#!/bin/bash
cat - >/tmp/pre-normalized.json
cat /tmp/pre-normalized.json | jq 'if type == "array" then . else [.] end'
