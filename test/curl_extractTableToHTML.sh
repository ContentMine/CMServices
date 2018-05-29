#!/bin/bash

# Call one-shot service endpoint extractTableToHTML
# Note: this is a long-running process 

curl --form userWorkspace="user2" --form corpusName="corpus2" --form docName="doc2" --form "fileupload=@pdftestp5only.pdf" --form x0=17.5 --form y0=26 --form width=178.5 --form height=97.5 --form pageNumber=1 http://localhost:3000/api/extractTableToHTML


