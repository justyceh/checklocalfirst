# CHECK LOCAL FIRST REPO


# Repo Breakdown


## API Folder

- Contains all of the logic for interacting with supabase, queries to supabase, sign up users, sign up businesses

- Utilizes server.js for hosting the main server, utilizes sub routes in routes folder for specific task like users and auth, businesses, services, categories etc

- Dbconnect.js utilizes dotenv to pull from a .env file and specify the special keys for connecting to supabase client

NPM libraries

@supabase/supabase-js
├── cors
├── dotenv
└── express

Supabase js is primarily used for connecting to the supabase client we store all of our real info at

Dotenv is used for loading env files to keep secrets safe

Cors is for cross origin resource sharing


### Auth.js middleware

This middleware is used to validate and check if a user is logged in, and if they are we check to make sure that they are allowed to access the resource they are requesting


### Server.js API route

- This holds all the routers for other routes, we have them separated into separate files so we separate the concerns and our main server.js file stays small and not hundreds of lines

### Users.js

- Routes for getting all users, getting a user by id, user getting their own profile, and user updating their own profile. Note that getting all users is protected to only be used by admins by utilizing the account_type variable in our database

### Auth.js

- Contains all routes for signing up, logging in, logging out, and admin user account creation

- Utilizes supabase libraries to directly insert users into authentication tables, and we insert them into our users table

### Businesses.js 

- Builds routes for getting all businesses, updating businesses information and services, deleting a businesses and deleting businesses services


### Search.js

- Specifies our search routes that utilizes three database queries that fallback upon eachother, the first is full text search, the second is ilike matching search, and the third is fuzzy search

- Could possibly be upgraded to AI powered search later? Might have higher costs, only necessary if businesses scale up a lot to maybe 50+

### Categories.js

- Returns all categories in the database

### Services.js

- Returns all services in the database

## DATABASE Folder

- Specifies the base schema for users, businesses, services, and categories as well as functions and triggers for updating them

- Specifies seed.sql for uploading basic info into the tables for businesses




## Project Tech Stack breakdown

### Next.js and typescript frontend

### Render on the backend for hosting API on checklocalfirst.render.com for managing all API requests

### Resend for email sending and confirmation emails, will work in unison with supabase and render and clouflare

### Supabase is postgresql relational database for holding all the data for API use to show on frontend also supports user auth and can use a smtp for email through sendgrid

### Switch DNS hosting to cloudflare or provider that will suport or smtp email confirmation setup


### Current setup

- Files on github
When finished with internship allow github to be accessed or transfer ownership over to 
checklocalfirst@gmail.com

- API on onrender
Currently on my email but will setup on checklocalfirst@gmail.com email
simply use this api file
configure envs to match what the code says
Buy the cheapest plan to ensure 0 api downtime for website 7.99


- Frontend on vercel
Original frontend host was wix, we changed to vercel and next.js react framework with html css, js, etc
Transfer email to checklocalfirst@gmail.com on vercel 


- DNS host
Started off with wix but transfered to cloudflare hosting, 
setting it up on checklocalfirstgmail so no problems there


### Important things to not forget

- Need to set up resend / email smtp, make sure it works with postgresql auth sign up, log in, password reset etc

- Ensure no hardcodings in backend routes or frontend routes

- Turn on RLS in supabase

- Ensure all accounts and emails with software are linked to checklocalfirst

- Design frontend to be easily able to changed in github with constant files to change headings / imgs easily

- For premium users they must contact our team with a photo directly after signing up to have their photo uploaded onto the page
Pretty simple we just add a image to the folder and make sure its name is the same as the businesses unique slug

- Design certain things so they are easy for tessa to change later

### Features to implement

- Analytic tracking on business button clicks for calls, emails, individual page listing, and maybe even address, do not link to other websites for saftey

- Make a admin dashboard for tessa to access to be able to CRUD all users and businesses and services and categories

- Discount integrations using our own software or possible third party api's

- Build the backend routes and edit the current tables to make discount generation and tracking for users and businesses

- Build premium upgrade page for users and businesses

- Build premium upgrade pop ups for when users click discount codes, or businesses try to click add image, etc

- Implement stripe and secure checkout forms

- Make sure website uses a consistent color scheme, make it easy to change by using global.css file, make sure it uses consistent font

- Design website so that it looks vintage and professional

- AI powered search?


### Most recent update

- Pointed wix web servers to point to the vercel hosting so the site i built is currently displayed at checklocalfirst.com

- Implemented basic admin dashboard to view businesses, suspend them or delete them

- Built backend admin routes

