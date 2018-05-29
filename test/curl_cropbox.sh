#!/bin/bash

# Pre-requisites: 
#  curl_createCorpus.sh
#  curl_transformPDF2SVG.sh 

# cropbox on corpusName and page number. Crop a single rectangular box 
# Form data is x-www-form-urlencoded
# Corpus-level operation

curl -d userWorkspace=user1 -d corpusName=corpus1 -d x0=17.5 -d y0=26 -d width=178.5 -d height=97.5 -d pageNumber=5 http://localhost:3000/api/cropbox

