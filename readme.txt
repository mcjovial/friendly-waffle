***********************************************************************************
 Production Build Deployed on Heroku
***********************************************************************************

** For your convenience we have deployed our production build to a cloud server
	It is hosted on heroku and can be accessed with the following URL:
	
	"https://the-biblio-mecca.herokuapp.com/"
	
	(Note that the initial visit to this URL might take a few seconds)
	The website will be hosting the Patron App
	You can access the Librarian app by clicking the "Librarian Portal" on the
	Login page underneath the Login button

** We provided the source code if you would like to build the app on your local machine
	Follow the instructions below...

***********************************************************************************
 Connect to Your Local Postgres Database
***********************************************************************************
	
** Import a simple database (finalProjectDB.sql)
	After login to Database on pgAdmin 4
	Right click on your database
	Click "Restore"
	On the right side of the Filename click "..." 
	On the button right click on the dropdown for format, select "sql"
	Select the finalProjectDB.sql, then click "Select"
	Click "Restore"

** How to connect your local database to our App
	The root dir will have a "config.js"
	You can edit the connection string to your postgres connection string
	How to format the connection string will be described in the file 

	
***********************************************************************************
 Building the Patron and Librarian App
***********************************************************************************

** In order to build the application, you need to have installed node and npm

After installing the prerequisites, go to the root dir and run the command:
	"npm run build"
This will install all the dependencies of our app and build both applications 
(this might take a while). If the build succeeds, run the command:
	"npm start"
This will create an express server that will serve both apps. The console will 
tell you which port to listen to. Open in your browser "localhost:[PORT]" to run
Patron App and "localhost:[PORT]\lib" to run the Librarian App
	 

