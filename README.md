# musical-octo-train
This is the parent repo for macro-calorie-counter.
It's being used to separate infrastructure code from application code.

The mcc directory is a git submodule with a dedicated github repo.
Mcc is the application code.
Mcc's github repo is integrated with AWS code pipeline and elastic beanstalk.
When a commit is made to the macro-calorie-counter repo,
code pipeline detects it and publishes to elastic beanstalk.

The application code has been separated in this recent change so that the deployment of the application and infrastructure can be separated.

#Practices and Disciplines
1. Test Driven Development (TDD)
2. Infrastructure as Code
3. Continuous Deployment

# Roadmap
1. build automated test suite - Projected 04/01/2016
    1. add the tape framework - Completed 03/15/2016
    2. implement strict TDD by separating tested and un-tested code(this is no longer even commit worthy) - Completed 03/16/2016
    3. create a test folder and run all tests in folder - Projected 03/30/2016
2. fully automate dynamo db deployment w/ data samples - Projected 04/06/2016
    1. test table cleanup
    2. data samples
    3. query samples
    4. production code deployment
        1. production and test configurations designating separate resources
            I don't want to go the route of separate AWS instances.
            I want a single bill for this project from AWS.
            Instead it's more appropriate to have test and production IAM users with separate credentials.
            Tests will only have access to test resources.
            Production code will only have access to production resources.
3. gated pushes to macro-calorie-counter git hub repo - Projected 05/01/2016