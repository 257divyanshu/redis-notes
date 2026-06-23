import Redis from 'ioredis';

const subscriber = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379'
);

subscriber.subscribe('notifications',(err) => {
    if(err){
        console.log('failed to subscribe', err.message);
        return;
    }
    console.log('subscribed successfully');
})
// - we can have many such subscribers
// - here 'notifications' is the name of the channel to which the subscriber is subscribed to

subscriber.on('message', (channel, message) => {
    console.log("Received message on '", channel, "' channel :", JSON.parse(message))
})