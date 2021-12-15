# LITERATE Web App

![alt text](https://github.com/BoiseState/literate-webapp/blob/master/literate-app/public/images/ClassroomLogo.png)

## Building and Running the Project (Docker)

* install and run Docker
* navigate to /literate-webapp (this directory)

To build the project containers:

* docker-compose build

To run the project:

* docker-compose up

The web app listens on port 3000. (http://localhost:3000/)

The readability server listens on port 5000.

(Note: The readability server runs in debug mode by default. See "Using Debug Mode" below for instructions.)

## Building and Running the Project (without Docker)

### Build the readability server

* navigate to directory /readability-server and run 'npm install'

### Build the web app

* navigate to directory /literate-app and run 'npm install'

## Running the Project

### Running the readability server

in /readability-server:

* npm start

OR

* npm run debug (for debug mode)

The readability server listens on port 5000.

### Running the web app server

in /literate-app:

* npm start

OR

* npm run debug (for debug mode)

The web app listens on port 3000. (http://localhost:3000/)

### Using Redis

* The readability server is optimized to use a Redis server for caching.
* To use this feature, start a local Redis server with: redis-server.
* Start/restart the readability server and caching should be enabled and functioning.

### Using Debug Mode

* Use Chrome debugging tools to see logged messages.

1. In a Chrome browser, navigate to: chrome://inspect.
2. Make sure that 'Discover network targets' is checked.
3. Click the 'configure' button next to it.
4. Add the server/port numbers that server processes are running on.
  (e.g. localhost:5555)
 (The server will always be localhost. Port numbers are logged
  to the terminal's console.)
5. Once configuration is complete and all ports are designated, click the link "Open dedicated DevTools for Node."

* This will let you use the same debugging tools for all server
  processes that Chrome offers for client-side JavaScript.
* You can also use this tool for individual processes by clicking
  the 'inspect' link under a given target.
* NOTE: Only one server can be ran in debug mode at a given time.
