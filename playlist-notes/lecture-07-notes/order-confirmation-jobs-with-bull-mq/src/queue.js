import { Queue } from "bullmq";

// --------------------------------------------------
// Redis Connection Configuration
// --------------------------------------------------
//
// BullMQ uses Redis as its storage backend.
// Every producer and worker that wants to interact with BullMQ must connect to the same Redis instance.
//
export const connection = {
    host: "localhost",
    port: 6379
};

// --------------------------------------------------
// Queue Creation
// --------------------------------------------------
//
// Creates a queue named "emails".
// Think of this as:
// emails
//   ↓
// [ Job1 ]
// [ Job2 ]
// [ Job3 ]
//
// BullMQ will automatically create the required Redis structures behind the scenes.
// We don't manually use LPUSH/RPOP anymore.
//
export const emailQueue = new Queue(
    'emails',
    { connection }
);

// Export shared objects.
//
// Producers use emailQueue to add jobs.
// Workers use connection to process jobs.
//