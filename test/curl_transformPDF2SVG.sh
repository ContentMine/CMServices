#!/bin/bash

# Pre-requisites:

# curl_createCorpus.sh

# transformPDF2SVG on corpusName
# Form data is x-www-form-urlencoded
# Corpus-level operation

curl -d "corpusName=corpus1&userWorkspace=user1" http://localhost:3000/api/transformPDF2SVG
