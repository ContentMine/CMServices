
#Tests for CMServices endpoints

Note: A test script is included for every endpoint, but some endpoints have pre-requisites (dependencies). Calling these endpoints will fail if the files resulting from previous setup and transformations steps do not already exist.  See comments in each script for any specific pre-requisites.

##Overview

###Endpoints without pre-requisites:

* createCorpus 
* extractTableToHTML

###Endpoints with pre-requisites:

* transformPDF2SVG
* cropbox
* transformSVGTABLE2HTML
* getTableHTML
* getTableCSV


