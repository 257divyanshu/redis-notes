import { Worker } from "bullmq";
import { connection } from "./queue.js";

// --------------------------------------------------
// Worker Creation
// --------------------------------------------------
//
// Worker Responsibilities:
// 1. Watch a queue
// 2. Pick jobs
// 3. Process jobs
//
// BullMQ continuously polls Redis behind the scenes.
// We don't manually fetch jobs.
//
const worker = new Worker(

    // Queue Name
    //
    // Must match the queue name used in queue.js.
    //
    'emails',

    // --------------------------------------------------
    // Job Processor
    // --------------------------------------------------
    //
    // This function contains the business logic. BullMQ automatically invokes it whenever a job arrives.
    //
    async (job) => {

        console.log(
            "Processing email job.",
            job.id,
            job.name,
            job.data
        );

        // Simulate email sending.
        //
        // In production:
        // await emailService.send(...)
        //
        // await new Promise(
        //     (resolve) =>
        //         setTimeout(resolve, 5000)
        // );

        await new Promise(
            (resolve, reject) =>
                setTimeout(
                    () => reject(
                        new Error("SMTP server unavailable") // Bull MQ expects an error
                    ),
                    5000
                )
        );

        // console.log(
        //     "email job completed...",
        //     job.id,
        //     job.name,
        //     job.data
        // );
    },

    // Redis Connection
    { connection }
);

// --------------------------------------------------
// Worker Events
// --------------------------------------------------
//
// BullMQ emits events when job state changes.
//

// Job completed successfully
worker.on("completed", (job) => {

    console.log(
        "Job completed!",
        job.id,
        job.name,
        job.data
    );
});

// Job failed after processing
worker.on("failed", (job, err) => {
    console.log(
        "Job failed!",
        job.id,
        job.name,
        err.message
    );
});