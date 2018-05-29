#!/bin/bash

# Test of service not invoking backend Java processes

# Pre-requisites:
#  curl_extractTableToHTML.sh

#   or

#  curl_createCorpus.sh
#  curl_transformPDF2SVG.sh
#  curl_cropbox.sh
#  curl_transformSVGTABLE2HTML.sh

# Get previously generated table HTML. 
# Corpus-level operation + doc-level return of table data as HTML (table.svg.html)

curl http://localhost:3000/api/getTableHTML/user1/corpus1/doc1/
