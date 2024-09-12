import "dotenv/config"
import "./db.mjs"
import express, { json } from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
import { createServer } from "http"
import { Server as socketIo } from "socket.io"
import { allowedOrigins, globalIoObject } from "./core.mjs"

import authRoutes from "./routes/authRoutes.mjs"
import profileRoutes from "./routes/profileRoutes.mjs"
import userRoutes from "./routes/userRoutes.mjs"
import chatRoutes from "./routes/chatRoutes.mjs"
import callRoutes from "./routes/callRoutes.mjs"

import { authenticationMiddleware } from "./middlewares/jwtMiddlewares.mjs"

const app = express()

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api/v1", authRoutes, authenticationMiddleware, userRoutes, profileRoutes, chatRoutes, callRoutes)

// socket io

const server = createServer(app)
const io = new socketIo(server, { cors: { origin: allowedOrigins, methods: "*" } })
globalIoObject.io = io
io.on("connection", (socket) => console.log(`new client connected with id: ${socket?.id}`))

const PORT = process.env.PORT || 5002

server.listen(PORT, () => console.log(`server is running on port ${PORT}`))