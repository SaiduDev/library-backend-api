import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoute.js";
dotenv.config();
const app = express();

app.use(express.json({limit: "10kb"}));
app.use(cors());
app.use(helmet());


try {
    app.use("/api", adminRouter);

    let port = process.env.PORT || 8080
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
    });
    
} catch (error) {
     res.status(500).json({message: "internal server failed", error: error.message});
        console.error(error);
}
