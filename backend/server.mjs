import "dotenv/config"
import "./db.mjs"
import express, { json } from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"

import authRoutes from "./routes/authRoutes.mjs"
import profileRoutes from "./routes/profileRoutes.mjs"
import chatRoutes from "./routes/chatRoutes.mjs"
import { authenticationMiddleware } from "./middlewares/jwtMiddlewares.mjs"

const app = express()

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(json())
app.use(cookieParser())
app.use(morgan())

app.use("/api/v1", authRoutes, authenticationMiddleware, profileRoutes, chatRoutes)

const PORT = process.env.PORT || 5002

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))