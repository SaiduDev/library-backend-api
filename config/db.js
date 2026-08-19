import { Pool } from "pg";
import { configDotenv } from "dotenv";

export let pool = new Pool({
    user: process.env.DB_user,
    host: process.env.DB_host,
    database: process.env.DB_name,
    password: process.env.DB_password,
    port: process.env.DB_port
})