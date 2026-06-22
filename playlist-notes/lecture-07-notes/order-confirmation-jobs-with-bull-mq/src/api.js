import express from 'express';
import { emailQueue } from "./queue.js";

const app = express();

app.use(express.json());

// --------------------------------------------------
// Producer Endpoint
// --------------------------------------------------
//
// Producer's responsibility:
//
// Create Job
//     ↓
// Add Job To Queue
//
// Producer DOES NOT process the job.
//
// Example:
//
// User places order
//      ↓
// Create email job
//      ↓
// Push into BullMQ queue
//      ↓
// Return response immediately
//
app.post('/welcome-email', async (req, res) => {

    // --------------------------------------------------
    // Add Job To Queue
    // --------------------------------------------------
    //
    // add(name, data, options)
    //
    // name:
    //     Type of job.
    //
    // data:
    //     Information required by the worker.
    //
    // options:
    //     Retry, delay, priority, etc.
    //
    const job = await emailQueue.add(

        // Job Name
        //
        // Useful when one queue processes multiple job types.
        //
        "send-welcome-email",

        // Job Payload
        //
        // This data will be available inside job.data
        //
        {
            to: req.body.to,
            name: req.body.name || "Learner",
        },

        // Job Configuration
        {
            // Retry failed jobs up to 3 times
            attempts: 4,

            // Exponential Retry Strategy
            // Retry 1 -> 1 sec
            // Retry 2 -> 2 sec
            // Retry 3 -> 4 sec
            //
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        }
    );

    // BullMQ automatically generates job.id for tracking purposes.
    //
    res.json({
        message: "Welcome email job added to the queue!",
        jobId: job.id
    });
});

app.listen(3000, () => {
    console.log('server running on port 3000');
});