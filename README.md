# hackathon-project
This repository contains the project files, which we created and won at internal hackathon conducted by our college. Our project was categorized under "____________________" category.

## Quick start (React + MongoDB test)

1. **Backend setup**
   - Copy `server/.env.example` to `server/.env` and add your MongoDB connection string.
     Follow the steps below to get this URI from Atlas.

     ### Obtaining your Atlas connection string
     1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/) and select your project.
     2. Under **Clusters** click **Connect** for `Cluster0` (or whatever yours is named).
     3. Choose **Connect your application**.
     4. Select **Node.js** and the driver version (latest is fine).
     5. Atlas will show a URI similar to:
        ```text
        mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
        ```
     6. Replace `<username>`, `<password>`, and especially the database name (`mydatabase` in the example) with the **exact database name you intend to use**. In your Atlas screenshot the database is called `main`, so the URI should end with `/main?`.
        If you leave a different name Atlas will create (or use) that other database, which is why you may see only the sample record even after manually inserting documents elsewhere.

        Paste the full, corrected URI into `server/.env` as the `MONGO_URI` value.

        ```env
        MONGO_URI=mongodb+srv://myUser:secret123@cluster0.mongodb.net/main?retryWrites=true&w=majority
        ```
     7. (Optional) restart the server so the new `.env` value is used.

   > **Tip:** the enhanced `/api/users` handler now logs the name of the connected database and the documents returned. Check the backend console when you hit the endpoint to verify you're looking at the same DB/collection that Atlas is showing.

     > **Note**: you may need to
     > - Add an IP whitelist entry under **Network Access** (`0.0.0.0/0` for testing),
     > - Create a database user with a username/password under **Database Access**.

     Example environment file:
     ```env
     MONGO_URI=mongodb+srv://myUser:secret123@cluster0.mongodb.net/mydb?retryWrites=true&w=majority
     ```
   - Install server dependencies and start the API:
     ```powershell
     cd server
     npm install
     npm run dev      # uses nodemon
     # or "npm start" once you've verified everything works
     ```
   - The API listens on port 5000 by default and exposes:
     * `GET /`            – simple health check
     * `GET /api/users`   – returns user documents (auto‑seeds one if empty)

2. **Client setup**
   - From the root folder:
     ```powershell
     cd client
     npm install
     npm run dev
     ```
   - Open the Vite server (usually http://localhost:5173) and you should see a page
     listing the user(s) fetched from MongoDB.

3. **Verify**
   - When the frontend loads it will log network requests in the browser dev tools.
   - The server console will print connection status messages from `server/config/db.js`.
   - If the database is empty the first request to `/api/users` will insert a sample record
     so you see something on the page.

This minimal setup proves that React can communicate with the Node/Express backend,
and that the backend successfully reads from MongoDB.
