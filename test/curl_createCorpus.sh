#!/bin/bash

# Upload PDF file testpdf.pdf 
# and run norma makeProject under name corpus1
# Form data is multipart

# norma Doc-level operation
# Note: Doc name allows retrieval of individual doc's generated results 
# although operations are applied at the level of the corpus (CProject)
# which contains the single doc (CTree)

curl --form userWorkspace="user1" --form corpusName="corpus1" --form docName="doc1" --form "fileupload=@testpdf.pdf" http://localhost:3000/api/createCorpus

