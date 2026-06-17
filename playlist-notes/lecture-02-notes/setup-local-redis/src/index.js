// this script ensures that all the three systems (this Express Application, Redis Server and Mongo Server) can talk to each other successfully

import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
// it creates a Redis client and establishes communication between the Express application and the Redis server running in the Docker container
// since Docker exposed 6379:6379, Redis is available on localhost:6379


app.get('/redis', async (req, res) => {
    const reply = await redis.ping();
    res.json({ redis: reply });
});
// /redis is health check (or connectivity test) route proving Express - Redis connection works

app.get('/mongo', async (req, res) => {
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/chai_aur_redis';
    // since Docker exposed 27017:27017, Mongo is available on localhost:27017

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(url);
    }
    // readyState:
    //   0 -> disconnected
    //   1 -> connected
    //   2 -> connecting
    //   3 -> disconnecting

    res.json({
        mongo: "connected",
        database: mongoose.connection.name
    });
});
// /mongo is health check (or connectivity test) route proving Express-Mongo connection works

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})