#Balance Sheet

## Application Specific Files

Some of the data is managed with custom software. It's listed here.

|File Type  |Application|Location       |
|-----------|-----------|---------------|
|.uxf       |UMLet      |libraries/umlet|

## Commands

### Infrastructure

#### npm test
Run the full test suite.

#### npm deploy
Mercilessly deploy the infrastructure. If the desired infrastructure is in use, tear it down and build it new.

- database
- api-implementation
- api-interface
- form

### application

#### npm test

- test web service to add entry

## Project Remarks

### Infrastructure as Code
Infrastucture will be code when reasonable.
 
### Third Party Software

#### Binaries
If legal and no license key is required it is to be included in this project. Only software for which perpetual licenses are owned should be used.

#### Cloud Service Providers
Only highly respectable service providers are to be used. Our full faith and trust is put into AWS. Therefore AWS should be the first choice for any services which make sense to be outsourced. The main concern is to secure access to the service.