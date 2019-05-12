![Nami Header](https://i.imgur.com/WI3bJSx.png)

[![nami](https://img.shields.io/badge/nami-case%20study-33c5ff.svg?color=33c5ff&style=plastic)](https://nami-serverless.github.io)
[![npm](https://img.shields.io/npm/v/nami-serverless.svg?color=33c5ff&style=plastic)](https://www.npmjs.com/package/nami-serverless)
[![license](https://img.shields.io/npm/l/nami-serverless.svg?color=33c5ff&style=plastic)](https://www.npmjs.com/package/nami-serverless)


## Overview

Nami is a serverless framework for consuming webhooks at scale.

When events occur in batches, a wave of webhooks may overwhelm consumers, resulting in dropped data. Always-on systems must be provisioned to handle worst-case scenarios, however, this is inefficient as these resources will be idling most of the time.

<img src="https://i.imgur.com/00Yy8JA.gif" width="600" alt="nami deploy" />

The Nami framework accommodates bursty webhook traffic with AWS Lambda Functions as a Service (FaaS), which dynamically scales computing resources to match the flow of incoming data. Nami then throttles the flow using an SQS queue as message broker to send the data to a MongoDB data store deployed using Docker on an EC2 instance. The framework abstracts away the complexities of cloud infrastructure and the effort required to deploy, configure, and choreograph all of these services.

### Nami Architecture

![Nami components](https://i.imgur.com/FEghmSi.png)

## The Team
**[Sachin Chandy](https://sachinmc.github.io)** *Software Engineer* London, UK

**[Wendy Kuhn](https://wendykuhn.io)** *Software Engineer* Austin, TX

**[Nick Miller](https://nickmiller.io)** *Software Engineer* Los Angeles, CA

## Getting Started

### Prerequisites
* AWS account
* AWS CLI
* Node.js >= 8.10
* NPM

Nami requires that users have an account with AWS and have set up an AWS CLI configuration on their local machine.  If you have not already done so, please visit [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) for instructions.  Nami will use the default credentials and region specified within that profile in order to interact with AWS services.

### Install Nami
``` bash
npm install -g nami-serverless
```
---

## Commands

Nami commands conform to the following structure:
```
nami <commandName> [<resourceName>]
```

---

#### `nami create <resourceName>`
*optional: create local directories and files for pre-queue and post-queue Lambda functions for user to insert custom logic before deploying*

---

#### `nami deploy <resourceName>`
*deploy API endpoint and accompanying scalable architecture. User can register endpoint with the webhook provider*

The `deploy` command will create instances of the below:
- API Gateway resource
- SQS Queue (with Dead Letter Queue attached)
- Pre- and post-queue Lambda functions
- EC2 instance with MongoDB deployed using Docker

The first time the `deploy` command is run, Nami will also create:
- a hidden directory within the user's home directory that holds configuration files and serves as a staging directory for deploying the Lambda functions
- IAM roles for the Lambda functions
- an API Gateway

---

#### `nami destroy <resourceName>`
*delete API endpoint and accompanying scalable architecture*

All instances of AWS services for a particular endpoint will be deleted, except for the Elastic Block Storage (EBS) volume that persists any webhook data written to the MongoDB database.

---

#### `nami list`
*list active API endpoints*

---

#### `nami help`
*documentation of commands*

---

## Helpful Tips

### Accessing AWS services

The Nami framework deploys instances of multiple AWS services. While these instances can be deleted using the `destroy` command, they can also be accessed and modified using the [AWS CLI](https://docs.aws.amazon.com/cli/index.html) or via the [web console](https://console.aws.amazon.com/console/home).

### At-least once delivery

Due to the behavior of AWS services used by Nami, the nature of the HTTP request/response cycle, and retry policies of webhook providers, exactly once delivery of webhook data in not possible. Users should be aware of this and either write applications to be [idempotent](https://en.wikipedia.org/wiki/Idempotence), or remove duplicate messages.

### Message ordering

Webhook providers generally do not guarantee delivery of events in the order in which they are generated. Your endpoint should not expect delivery of events in order and should handle this accordingly. Event timestamps can be used to order messages once they are written to the database.

### Security and SSH

To ensure that the data store is not accessible from the public internet, the post-queue Lambda function and EC2 instance are both within their own Virtual Private Cloud (VPC) and the EC2 instance allows inbound access only from the post-queue Lambda security group. Users can access their own AWS EC2 instances using SSH, however, TCP port 22 is closed by default when users deploy instances of Nami. This can be opened by the user either by using the `authorize-security-group-ingress` [aws cli command](https://docs.aws.amazon.com/cli/latest/reference/ec2/authorize-security-group-ingress.html), or by editing the inbound rules for the `<resourceName>EC2SecurityGroup` to allow SSH connections from your desired source.

![Security Diagram](https://i.imgur.com/Lo7dYMo.png)

### Accessing database

Once port 22 is opened, a user can SSH into the EC2 instance and access their webhook data directly from MongoDB.

1. From the directory with the `nami.pem` keypair file, SSH into the EC2 instance.<br />
*Connection details can be found by navigating to the EC2 section of the web console, and clicking the 'Connect' button once the EC2 instance is selected.*
2. Type `yes` when prompted to finish initiating the connection.
3. Type `sudo docker exec -it namiStore bash` to create a new Bash session in the running `namiStore` MongoDB container.
4. Type `mongo nami` to start the Mongo shell with database `nami`.
5. Access your webhook data in `namiCollection`.

#### Common commands include:
  - `db.namiCollection.find()` - retrieves all documents from `namiCollection`
  - `db.namiCollection.count()` - display the number of documents in `namiCollection`
