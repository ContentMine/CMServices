#!/bin/bash

# Pre-requisites: 
#   curl_createCorpus.sh
#   curl_transformPDF2SVG.sh 
#   curl_cropbox.sh 
#   curl_transformSVGTABLE2CSV.sh

#     or

#   curl_extractTableToHTML.sh (does the first three steps above)
#   curl_transformSVGTABLE2CSV.sh

# Get previously generated table CSV. 
# Corpus-level operation + doc-level return of table data as CSV (table.svg.csv)
curl -X GET -d userWorkspace=user1 -d corpusName=corpus1 -d docName=doc1 http://localhost:3000/api/getTableCSV

