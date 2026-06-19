import express from 'express';
import Redis from 'ioredis';

const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Create a Redis client and connect to the Redis server.
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// --------------------------------------------------
// Redis Key Design
// --------------------------------------------------
//
// In production applications, Redis keys are usually centralized in constants/enums files.
//
// However, when keys contain dynamic information (user id, phone number, order id, etc.), helper functions are commonly used to generate them.
//
// Examples:
// otp:9876543210
// otp:9123456780
// otp:9999999999
//
// This namespacing convention helps:
// - avoid collisions
// - improve readability
// - simplify debugging
//
function otpKey(phone) {
    return `otp:${phone}`
}

// --------------------------------------------------
// Generate OTP
// --------------------------------------------------
//
// Workflow:
//
// Client
//   ↓
// POST /otp
//   ↓
// Generate OTP
//   ↓
// Store OTP in Redis with TTL
//   ↓
// Send OTP to user
//
// Redis is a perfect fit here because OTPs are:
// - temporary
// - short-lived
// - frequently read
// - automatically removable via TTL
//
app.post('/otp', async (req, res) => {

    const { phone } = req.body;

    // In a real application:
    // - validate phone number format
    // - verify user existence
    // - apply rate limiting
    // before generating an OTP

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Redis SET command with expiration.
    //
    // Equivalent Redis command:
    //
    // SET otp:9876543210 123456 EX 30
    //
    // EX = Expire after N seconds
    //
    // Redis automatically removes the key after 30 seconds.
    await redis.set(otpKey(phone), otp, 'EX', 30);

    // For learning purposes we return the OTP.
    //
    // In production:
    // - send OTP via SMS/email
    // - never expose OTP in API response
    res.json({ message: 'OTP sent', otp });
});

// --------------------------------------------------
// Verify OTP
// --------------------------------------------------
//
// Workflow:
//
// Client submits OTP
//      ↓
// Fetch OTP from Redis
//      ↓
// Compare values
//      ↓
// Success / Failure
//
app.post('/otp/verify', async (req, res) => {

    const { phone, otp } = req.body;

    // Read OTP from Redis
    //
    // Redis GET command:
    // GET otp:9876543210
    //
    const savedOtp =
        await redis.get(otpKey(phone));

    // If Redis returns null,
    // the OTP either:
    // - never existed
    // - expired due to TTL
    // - was already deleted
    if (!savedOtp) {
        return res.status(400).json({
            message: 'OTP expired or not found'
        });
    }

    // OTP exists but values don't match
    if (savedOtp !== otp) {
        return res.status(400).json({
            message: 'Invalid OTP'
        });
    }

    // OTP successfully verified.
    //
    // Since OTPs are one-time passwords,
    // they should not be reusable.
    // Therefore we immediately delete it.
    //
    // Redis command:
    // DEL otp:9876543210
    //
    await redis.del(otpKey(phone));

    // In production:
    // - mark phone/email as verified
    // - create account/session/token
    // - then delete OTP
    res.json({
        message: "OTP verified successfully"
    });
});

// --------------------------------------------------
// Check Remaining TTL
// --------------------------------------------------
//
// Useful for debugging and learning.
//
// Example:
// OTP expires in 30 seconds.
// 
// After 10 seconds:
// TTL -> 20
//
app.get('/otp/:phone/ttl', async (req, res) => {

    // Redis TTL command:
    // TTL otp:9876543210
    //
    const ttl = await redis.ttl(otpKey(req.params.phone));

    // Possible responses:
    // > 0  -> seconds remaining
    // -1   -> key exists but no expiration
    // -2   -> key does not exist
    //
    res.json({ ttl });
});

app.listen(3000, () => {
    console.log('Server running on port http://localhost:3000');
});