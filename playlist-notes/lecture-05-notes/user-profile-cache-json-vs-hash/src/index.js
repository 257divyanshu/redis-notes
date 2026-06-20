import express from 'express';
import Redis from 'ioredis';

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Create a Redis client and connect to Redis
const redis = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379'
);

// ==================================================
// APPROACH 1: Store User Profile as JSON String
// ==================================================
//
// Redis values are fundamentally stored as strings (or raw bytes).
// Therefore, a JavaScript object cannot be stored directly using SET.
//
// Example:
// req.body
// {
//   "name": "Divyanshu",
//   "email": "abc@gmail.com"
// }
// gets converted to:
// '{"name":"Divyanshu","email":"abc@gmail.com"}'
// before being stored in Redis.
//
// Redis Key:
// user:123:json
//
app.post("/user/:id/json", async (req, res) => {

    await redis.set(
        `user:${req.params.id}:json`,
        JSON.stringify(req.body)
    );

    res.json({
        savedAs: "json"
    });
});

app.get("/user/:id/json", async (req, res) => {

    // Redis GET command
    // GET user:123:json
    const raw = await redis.get(
        `user:${req.params.id}:json`
    );
    // If key doesn't exist, GET returns null.

    // Since data was serialized using JSON.stringify(), we must deserialize it using JSON.parse() before sending it back.
    //
    res.json({
        user: raw ? JSON.parse(raw) : null
    });
});

// ==================================================
// Limitation of JSON String Storage
// ==================================================
//
// Suppose the stored profile is:
// {
//   "name": "Divyanshu",
//   "email": "abc@gmail.com",
//   "city": "Bhopal"
// }
//
// If we want to update only city:
// "city": "Raipur"
// Redis cannot directly modify one field inside the JSON string.
//
// Typical workflow:
//
// GET entire object
// ↓
// JSON.parse()
// ↓
// modify field
// ↓
// JSON.stringify()
// ↓
// SET entire object again
//
// This is one reason Redis Hashes exist.

// ==================================================
// APPROACH 2: Store User Profile as Redis Hash
// ==================================================
//
// Redis Hash is a native Redis data structure.
//
// Conceptually:
// Key
//  ↓
// Hash
//   ├── field1 -> value1
//   ├── field2 -> value2
//   └── field3 -> value3
//
// Example:
// user:123:hash
//     |
//     +-- name  -> Divyanshu
//     +-- email -> abc@gmail.com
//     +-- city  -> Bhopal
//
// This structure resembles an object/document.
//
// Redis commands:
// HSET
// HGET
// HGETALL
// HDEL
// HEXISTS
// are specifically designed for hashes.
//
app.post("/user/:id/hash", async (req, res) => {

    // HSET stores object properties as fields inside a Redis Hash.
    //
    // Example:
    // HSET user:123:hash
    //      name "Divyanshu"
    //      email "abc@gmail.com"
    //
    await redis.hset(
        `user:${req.params.id}:hash`,
        req.body
    );

    res.json({
        savedAs: "hash"
    });
});

app.get("/user/:id/hash", async (req, res) => {

    // HGETALL returns all fields from the Redis Hash.
    //
    // Example output:
    // {
    //   name: "Divyanshu",
    //   email: "abc@gmail.com"
    // }
    //
    const user = await redis.hgetall(
        `user:${req.params.id}:hash`
    );

    res.json({ user });
});

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});