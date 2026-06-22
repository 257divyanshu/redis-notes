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
// Queue Configuration
// ==================================================
//
// Every queue needs a Redis key.

// Here:
// queue:email
// queue -> namespace/category
// email -> specific queue name
//
// Examples:
// queue:email
// queue:sms
// queue:notifications
// queue:image-processing
//
const QUEUE_KEY = "queue:email";

// ==================================================
// Important Queue Terminology
// ==================================================
//
// Producer:
//     Component that creates jobs.
//
// Queue:
//     Temporary storage where jobs wait.
//
// Worker:
//     Component that consumes jobs.
//
// Job:
//     A single unit of work.
//
// Example:
// User Signup
//      ↓
// Create Email Job
//      ↓
// Push to Queue
//      ↓
// Worker Sends Email
//
// In this demo:
// POST /emails          => Producer
// Redis List           => Queue
// GET /emails/process-one => Worker

// ==================================================
// Producer Endpoint
// ==================================================
//
// Push a new email job into the queue.
// Real-world flow:
// User Registers
//      ↓
// Create Email Job
//      ↓
// Push Job to Redis Queue
// Return Response Immediately
// Email will be processed later by a worker.
//
app.post('/emails', async (req, res) => {

    // Create a job payload.
    //
    // In production this could contain:
    // - userId
    // - email template
    // - attachments
    // - priority
    // - retry count
    //
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No subject',
        body: req.body.body || 'No content',
        createdAt: new Date().toISOString()
    };

    // Redis Lists store strings.  the job object must be serialized before storage.
    //
    // LPUSH = Push element to the LEFT side of the list.
    // Redis command: LPUSH queue:email "{...job...}"
    //
    await redis.lpush(
        QUEUE_KEY,
        JSON.stringify(job)
    );

    res.json({
        queued: true,
        job
    });
});

// ==================================================
// Worker Endpoint
// ==================================================
//
// Simulates a worker processing one email job.
// Real applications usually run workers as eparate processes rather than HTTP endpoints.
//
app.get('/emails/process-one', async (req, res) => {

    // RPOP = Remove element from the RIGHT side.
    //
    // Using LPUSH + RPOP gives FIFO behavior.
    // First Job Added
    // First Job Processed
    //
    const rawJob =
        await redis.rpop(QUEUE_KEY);

    // If queue is empty,
    // RPOP returns null.
    if (!rawJob) {
        return res.json({
            message: 'No jobs in the queue'
        });
    }

    // Convert serialized job string back into a JavaScript object.
    const job = JSON.parse(rawJob);

    // Simulate actual email sending.
    // In production: await emailService.send(...) would happen here.
    //
    // IMPORTANT:
    // At this point the job has already been removed from Redis.
    // If the worker crashes now, the job is lost.
    // This is one limitation of using raw Redis Lists as queues.
    //
    res.json({
        message: 'Email sent',
        job
    });
});

app.listen(3000, () => {
    console.log(
        "Server is running on port http://localhost:3000"
    );
});