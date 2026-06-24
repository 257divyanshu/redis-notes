import express from 'express';
import Redis from 'ioredis';

const app = express();

app.use(express.json());

// --------------------------------------------------
// Publisher Connection
// --------------------------------------------------
//
// This Redis client acts as a Publisher.
//
// A publisher's responsibility:
// Create Message
//      ↓
// Publish Message To Channel
//
// It does NOT care who receives the message.
//
const publisher = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379'
);

// --------------------------------------------------
// Publish Notification
// --------------------------------------------------
//
// Example Request:
// POST /notifications
// {
//   "title": "Server maintenance at 10 PM"
// }
//
// This endpoint receives a request and immediately publishes a message to the Redis channel.
//
app.post('/notifications', async (req, res) => {

    const payload = {

        // Message Content
        title: req.body.title || "Default Title",

        // Useful metadata
        createdAt: new Date().toISOString()
    };

    // --------------------------------------------------
    // Redis PUBLISH Command
    // --------------------------------------------------
    //
    // publish(channel, message)
    //
    // Channel:
    //     notifications
    //
    // Message:
    //     serialized payload
    //
    // JSON.stringify is standard practice because Redis Pub/Sub messages are transmitted as strings.
    //
    // Return value:
    // Number of active subscribers that received the message.
    //
    const receivers =
        await publisher.publish(
            'notifications',
            JSON.stringify(payload)
        );

    res.json({
        message:
            `Notification sent to ${receivers} subscribers`
    });
});

app.listen(3000, () => {
    console.log(
        "Server running on port 3000"
    );
});