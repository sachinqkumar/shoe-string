# shoe-string
Shoe-String APIs Development
This document describes the approach and technologies used to create Shoe-String REST API as described in assignment problem.
As described in problem statement working RESTful APIs were to be developed as part of the solution for the followings.
•	Store Pet location.
•	Find Pet location history.
•	Find nearby Pet owners.

Solution Approach
The development of the above REST APIs is done using Nodejs, Express JS, and Mongo DB is used as backend of the solution on a Windows 10 operating system,
Visual Studio Code is used as an IDE for this development. Postman to invoke Endpoints in local.
Following Nodejs libraries are mainly used in the development of these APIs. The details of which could be found in package.json file inside the solution folder.
•	Express
•	Mongoose
•	jwttoken
•	Dotenv
•	Helmet
•	Cors
•	Mongo-Sanitize
•	Request
•	UUID
•	Winston
A history plugin is used while performing Create, Update and Delete operations on Pet location data to keep history of the pet location. The plugin keeps a copy of the pet in history collection whenever location is updated and used to return the location history of pet based on user subscriptions ( 24 hours for basic, 30 days for premium users).
Running the Solution
Prerequisite: 
Following software are required to be installed on the system to run this solution.
•	node-v14.16.0-x64
•	mongodb-windows-x86_64-4.4.4-signed
Following steps are required to run the solution.
•	Clone the git repo
•	Using terminal change the directory to above folder.
•	Run npm install
•	Npm start
•	To run tests – npm test 

