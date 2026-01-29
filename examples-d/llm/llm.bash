#!/bin/bash
./agency/main -model gpt-3.5-turbo -maxTokens 1000 -temp=1 -prompt "concise responses" "$(cat)"

