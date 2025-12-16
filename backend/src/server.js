import dotenv from "dotenv"
dotenv.config()

import app from "./app.js";
import pool from "./config/db.js";
import "./cron/tripReminder.cron.js";


const PORT=process.env.PORT

// test db connection
pool.connect()
    .then(()=>console.log("✅ PostgreSQL connected"))
    .catch((err)=>console.error("❌ DB connection error", err))

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})