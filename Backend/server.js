import express, { Router } from 'express'
import connectDB from './db.js'
import dotenv from "dotenv"
import userRoute from './Router/userRoute.js'
import cors from 'cors'
import productRoute from './Router/productRoute.js'
import cartRoute from './Router/cartRoute.js'
import orderRoute from './Router/orderRoute.js'
import aiRouter from './Router/aiRouter.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.url}`);
  next();
});

app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute )
app.use('/api/v1/cart', cartRoute )
app.use('/api/v1/orders', orderRoute )
app.use("/api/v1", aiRouter);


app.listen(PORT, () => {
    connectDB()
    console.log(`server is listening at PORT ${PORT}`)
})