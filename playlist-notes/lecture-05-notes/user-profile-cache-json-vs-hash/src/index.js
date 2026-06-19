import express from 'express';
import Redis from 'ioredis';

const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Create a Redis client and connect to the Redis server.
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// the normal way to store user sessions (user session data will be stored as string) :

app.post("/user/:id/json", async (req, res) => {
    await redis.set(
        `user:${req.params.id}:json`,
        JSON.stringify(req.body) // redis stores values as strings (or ray bytes), not javascript objects
    );

    res.json({ savedAs: "json" });
});

app.get("/user/:id/json", async (req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`);

    // - assuming that the keys exists

    res.json({ user: raw ? JSON.parse(raw) : null });
});

// - this was the basic way

// - but, usually such data is stored as object in hash, so that we can do manipulations on object

// - we want to store data as object (not as string)

// the better way to store user sessions (user session data will be stored as actual objects) :

app.post("/user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({ savedAs: "hash" });
});

app.get("/user/:id/hash", async (req, res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({ user });
});

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});