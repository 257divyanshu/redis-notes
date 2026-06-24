import Redis from 'ioredis';

// --------------------------------------------------
// Subscriber Connection
// --------------------------------------------------
//
// This Redis client acts as a Subscriber.
//
// A subscriber continuously listens for messages published to channels.
//
const subscriber = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379'
);

// --------------------------------------------------
// Subscribe To Channel
// --------------------------------------------------
//
// Redis command:
//
// SUBSCRIBE notifications
//
// After subscribing, Redis will push messages to this process whenever someone publishes to the channel.
//
subscriber.subscribe(
    'notifications',
    (err) => {

        if (err) {
            console.log(
                'failed to subscribe',
                err.message
            );
            return;
        }

        console.log(
            'subscribed successfully'
        );
    }
);

// Multiple subscribers can subscribe to the same channel.
//
// All active subscribers receive every message.

// --------------------------------------------------
// Message Listener
// --------------------------------------------------
//
// Triggered whenever a message arrives on a subscribed channel.
//
subscriber.on(
    'message',
    (channel, message) => {

        console.log(
            "Received message on channel:",
            channel
        );

        // Convert serialized JSON string back into a JavaScript object.
        const payload =
            JSON.parse(message);

        console.log(payload);
    }
);