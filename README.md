# musical-octo-train
This is the parent repo for macro-calorie-counter.
It's being used to separate infrastructure code from application code.

The mcc directory is a git submodule with a dedicated github repo.
Mcc is the application code.
Mcc's github repo is integrated with AWS code pipeline and elastic beanstalk.
When a commit is made to the macro-calorie-counter repo,
code pipeline detects it and publishes to elastic beanstalk.

The application code has been separated in this recent change so that the deployment of the application and infrastructure can be separated.