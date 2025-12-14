import express from 'express'
const app=express()

//middleware
app.use(express.json())

import userRoute from "./routes/user.route.js";//users

app.use("/api", userRoute);

import tripRoute from "./routes/trip.route.js";//trips

app.use("/api", tripRoute);

import categoryRoute from "./routes/category.route.js"//category
app.use("/api", categoryRoute);

import expenseRoute from "./routes/expense.route.js";//expenses

app.use("/api", expenseRoute);


import healthRoute from './routes/health.route.js'


app.use('/api',healthRoute);
// test route
app.get('/',(req,res)=>{
    res.send('Traveleo backend is running 🚀')
})

export default app