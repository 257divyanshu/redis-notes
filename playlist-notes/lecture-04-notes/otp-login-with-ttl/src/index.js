import express from 'express';
import Redis from 'ioredis';

const app = express();

app.use(express.json());

// Create a Redis client and connect to the Redis server.
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// - the recommended way is to keep keys in files
// - but if keys need to be dynamic, usually functions are used

function otpKey(phone) {
    return `otp:${phone}`
}

app.post('/otp', async (req, res) => {
    const { phone } = req.body;
    // - in real applications, phone number is verified before generating OTP for it

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(otpKey(phone), otp, 'EX', 30); // OTP expires in 30 seconds
    res.json({ message: 'OTP sent', otp }); // in real applications, send OTP via SMS
});

app.post('/otp/verify', async (req, res) => {
    const { phone, otp } = req.body;
    const savedOtp = await redis.get(otpKey(phone));

    if (!savedOtp) {
        return res.status(400).json({ message: 'OTP expired or not found' });
    }

    if (savedOtp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    await redis.del(otpKey(phone)); // in real applications, first user will be verified/validated and then the OTP will be deleted

    res.json({message: "OTP verified successfully"});

});

// - now, we'll build an endpoint to check the TTL of the OTP a particular phone number
app.get('/otp/:phone/ttl', async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ ttl });
});

app.listen(3000, () => {
    console.log('Server running on port http://localhost:3000');
});