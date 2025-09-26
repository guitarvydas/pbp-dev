#!/bin/bash
input=$(cat)
./agency/main -model gpt-3.5-turbo -maxTokens 1000 -temp=1 -prompt "concise responses ; extract main issue, then ask what causes the main issue" "${input}"
