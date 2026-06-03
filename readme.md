# CHECK LOCAL FIRST REPO


# Repo Breakdown


## API Folder

- Contains all of the logic for interacting with supabase, queries to supabase, sign up users, sign up businesses

- Utilizes server.js for hosting the main server, utilizes sub routes in routes folder for specific task like users and auth

- Dbconnect.js utilizes dotenv to pull from a .env file and specify the special keys for connecting to supabase client


## DATABASE Folder

- Specifies the base schema for users, businesses, services, and categories as well as functions and triggers for updating them

- Specifies seed.sql for uploading basic info into the tables for businesses




## Project Tech Stack breakdown

### Wix on the frontend for displaying everything, building designs, showcasing data from database and backend

### Render on the backend for hosting API on checklocalfirst.render.com for managing all API requests

### Resend for email sending and confirmation emails, will work in unison with supabase and render and clouflare

### Supabase is postgresql relational database for holding all the data for API use to show on frontend also supports user auth and can use a smtp for email through sendgrid

### Switch DNS hosting to cloudflare eventually to connect to resend as wix limits