import express from 'express';
import Redis from 'ioredis';

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Create a Redis client and connect to Redis
const redis = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379'
);

// - a queue needs a name and a key 
const QUEUE_KEY = "queue:email"; // "queue:email" is standard convention

// - the thing we keep inside queue is called 'job' technically

// - storing a job in the queue
app.post('/emails', async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No subject',
        body: req.body.body || 'No content',
        createdAt: new Date().toISOString()
    };

    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.json({ queued: true, job });
});

// - consuming a job
app.get('/emails/process-one', async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_KEY);

    if (!rawJob) {
        return res.json({ message: 'No jobs in the queue' });
    }

    const job = JSON.parse(rawJob);

    // Simulate email sending
    res.json({ message: 'Email sent', job });
});

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});