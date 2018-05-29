#!/bin/bash

# Pre-requisites:
#  curl_createCorpus.sh
#  curl_transformPDF2SVG.sh 
#  curl_cropbox.sh

# svgtable2html on corpusName and page number. 
# Form data is x-www-form-urlencoded
# Corpus-level operation + doc-level return of table HTML data (table.svg.html)

curl -d userWorkspace=user1 -d corpusName=corpus1 -d docName=doc1 http://localhost:3000/api/transformSVGTABLE2HTML

