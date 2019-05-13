# DynamoDB Replication Console
The DynamoDB replication console is a front end utilizing angularjs for managing the [DynamoDB replication](https://github.com/Signiant/dynamodb-replication/) solution.  It is meant to be run as an s3 static website.


## Setup
To set up the replication console, follow these steps:

#### Configure
In order to view and manage your replications, the console must be configured with the proper endpoint and credentials for the replication API.  
To console configuration is located in ```app/config.js```.  
Replace ```<API_KEY>``` and ```<API_URL>``` with your values.  
Sample config:
```
angular.module('replicationConsole').constant('apiConfig', {
  key: 'abcdefghij1234567890ABCDEFGHIJ1234567890',
  url: 'https://abcde12345.execute-api.us-east-1.amazonaws.com/PROD'
});
```

  *Note:* Your url and api key can be found in the outputs of the CloudFormation stack for your replication deployment.

#### Install
  The replication console uses npm for package management.  
  To install dependencies :
  ```
  dynamodb-replication-console $ npm install
  ```  

#### Create
The console is hosted as a static website in s3.  
A CloudFormation template exists at ```cfn/bucket.cfn.json``` to create the with the appropriate configuration and policy.
Create a new CloudFormation stack using this template and complete the forms to create your bucket.  The URL to your console will be provided in the output by the stack.

*Note:* Since s3 static website hosting requires that the bucket be publicly available, it is recommended that you provide one or more IP's to the AllowedIps parameter.  Bucket access will be restricted to these IP addresses.

#### Deploy  
Finally, upload the code to your s3 bucket to deploy the replication console.
Using the AWS cli:  
```
dynamodb-replication-console $ aws s3 sync . s3://<YOUR_BUCKET_NAME>
```

## TODO
- Authentication  
- Individual replication metrics
- update angular js library from 1.5.7 to latest causes display issues to the console. More work is needed to resolve this issue.
