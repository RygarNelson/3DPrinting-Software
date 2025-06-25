# NodeJS Express Base
This repository contains a prebuilt NodeJS and ExpressJS backend server, with multiple functionalities already been implemented. You can simply download the project and start working on your REST API server.

This project has been created with the purpose to give everyone a hassle-free, pre-built configuration of a typical NodeJS + ExpressJS installation.

This project aims to be as compact as possible, so it can be used as a single, large server or as a part of multiple microservices.

## Functionalities

- Support for multiple configurations
- Support for both HTTPS and HTTP
- Support for enhanced header security
- Support for daily logging
- Support for CORS
- Support for extended JSON payloads
- Support for JsonWebToken, as standard authentication
- Support for input sanitization
- Support for middlewares
- Support for sending emails
- Support for the following databases: MySQL, PostgreSQL

## Modules

- **Bcrypt**: Encryption / Decryption of passwords
- **Cors**: Allows for REST API calls on the same machine
- **Dotenv**: Configuration files
- **Express**: Base for the server
- **Express Validator**: Input sanitization
- **Helmet**: Security module
- **JsonWebToken**: Authentication module that uses the standard [RFC 7519](https://tools.ietf.org/html/rfc7519)
- **Morgan**: Logging module
- **Mysql**: MySQL database module
- **Nodemailer**: email module
- **Nodemon**: Live Reload
- **Npm**: Standard package manager
- **Pg**: PostgreSQL database module
- **Rotating File Streams**: Allows to perform daily logs

## Structure

- Every configuration variable should be put inside the *.env* file in the root folder. 
> ***REMEMBER TO IMMEDIATELY PUT THE FILE INSIDE .gitignore, OTHERWISE YOUR SENSIBLE INFORMATION COULD BE EXPOSED***
- All configuration files should be put inside *src/config*. You can already find some examples inside the folder
- All middlewares should be put inside *src/middleware*. You can already find an example inside the folder
- *src/methods* is a folder used to store common functions. You can already find some examples inside the folder
- Routes should be placed inside *src/routes*. Then they must be declared inside the *src/app.js* file. You can already find some examples inside the folder
- *src/app.js* is the main file and contains everything for the server to function properly
- *src/db.js* contains all the necessary information to connect to a database

## Future Work

- Extend the database support for Oracle and MongoDB
- Support for extended logging via Winston
- Support for anti-tampering of log files
- SMS module
- Socket module, for live interaction
- Add scalability
- Explanation of all the configuration variables inside the *.env* file
