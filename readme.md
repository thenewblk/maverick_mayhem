# Maverick Mayhem
---

## Running 
With [Mongo](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) running, use the gulp file to start the node server and watch for scss changes.

## Testing
### Backend
Testing done with [Mocha](http://mochajs.org/), [Chai](http://chaijs.com/) and [Supertest](https://github.com/tj/supertest). Working towards having model and route tests for all models.
To run the tests: 

    npm test

## Structure
I started this from a version of another site meant to be a single page app with routing done mostly with js. Some of that stuff is in the public/javascripts directory and we can probably just trash it. Figured I'd leave it incase we want to go that direction with this guy. Otherwise, the whole public/ folder is up for grabs and we can use what ever structure seems best. Right now the gulp file is looking for any scss files in the stylesheets and compiling them to css in the same directory. 
