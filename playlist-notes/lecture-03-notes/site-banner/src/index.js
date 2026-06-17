import express from 'express';
import Redis from 'ioredis';

const app = express();

app.use(express.json());

// Create a Redis client and connect to the Redis server.
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Redis stores data as key-value pairs.
// It is a good practice to keep Redis keys centralized (in constants file, enums, etc.) to avoid typos and duplication.
// - but since we have only one key and this is a demo application we'll have the key name here itself for simplicity
const BANNER_KEY = "app:banner";

// Key Naming Convention:
// app:banner
// └─ app       => application namespace
//    banner    => resource name
//
// Namespaced keys improve readability and help avoid collisions.
//
// Examples:
// user:123
// session:abc123
// otp:9876543210
// app:banner

// --------------------------------------------------
// CREATE / UPDATE Banner
// --------------------------------------------------
//
// In a real-world application:
//
// Admin Panel
//      ↓
// Database (source of truth)
//      ↓
// Redis Cache
//
// Here we are skipping the database layer and directly storing the banner inside Redis to learn Redis commands.
app.post("/banner", async (req, res) => {

    // Redis SET command:
    // SET key value
    //
    // If the key already exists,
    // Redis overwrites the previous value.
    //
    // Therefore SET acts as both:
    // - Create
    // - Update
    await redis.set(
        BANNER_KEY,
        req.body.message || "Welcome to chai aur redis!"
    );

    res.json({ success: true });
});

// --------------------------------------------------
// READ Banner
// --------------------------------------------------
app.get("/banner", async (req, res) => {

    // Redis GET command:
    // Returns the value stored for the given key.
    //
    // If the key does not exist,
    // Redis returns null.
    const message = await redis.get(BANNER_KEY);
    res.json({ message }); // we are simply returning the message for now, ideally we should do validation as well
});

// - key value pairs aren't generally updated 
// - mostly we set values or remove them using TTL

// --------------------------------------------------
// DELETE Banner
// --------------------------------------------------
//
// Redis data is often:
// - overwritten using SET
// - automatically removed using TTL
// - explicitly deleted using DEL
app.delete("/banner", async (req, res) => {

    // Redis DEL command:
    // Removes the specified key completely.
    await redis.del(BANNER_KEY);
    res.json({ success: true });
});

// --------------------------------------------------
// Check Whether Banner Exists
// --------------------------------------------------
app.get("/banner/exists", async (req, res) => {

    // Redis EXISTS command:
    //
    // Returns:
    // 1 => key exists
    // 0 => key does not exist
    const exists = await redis.exists(BANNER_KEY);

    // Many developers convert it into a boolean:
    //
    // Boolean(1) -> true
    // Boolean(0) -> false
    //
    // Both approaches are acceptable.

    // res.json({ exists: Boolean(exists) });
    res.json({ exists: exists });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});