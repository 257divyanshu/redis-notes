# Redis Pub/Sub - Introduction

## What is a Notification?

A notification is not limited to the push notifications we receive on mobile devices.

In software systems, a notification broadly refers to any form of communication intended to inform a user or another system about an event or update.

Examples:

* Email notifications
* SMS notifications
* WhatsApp messages
* Push notifications
* In-app notifications
* System alerts

Therefore, a notification can be thought of as:

> A mechanism for delivering information from one system/component to another.

---

## Email as a Notification Channel

Email is one of the most common notification channels.

Unlike real-time messaging systems, email acts as a relatively persistent delivery mechanism:

* The recipient does not need to be online when the email is sent.
* The email remains available in the recipient's inbox until it is read or deleted.

Because of this persistence, email is often used for:

* Welcome messages
* Password resets
* Order confirmations
* Security alerts
* Account verification

---

## Redis Pub/Sub

Redis provides a messaging pattern called **Publish/Subscribe (Pub/Sub)**.

Pub/Sub enables real-time communication between independent applications, services, or processes.

Instead of directly communicating with each other, components communicate through Redis channels.

---

## Publisher

A Publisher is responsible for sending messages.

Examples:

* Backend APIs
* Microservices
* Workers
* Background jobs
* Applications

The publisher does not know who will receive the message.

Its only responsibility is:

```text
Publish message → Channel
```

---

## Subscriber

A Subscriber listens for messages on one or more channels.

Examples:

* Notification services
* Analytics services
* Logging services
* Chat servers
* Worker processes

When a message is published on a subscribed channel, Redis immediately delivers it to all active subscribers.

---

## Key Idea

In Redis Pub/Sub:

```text
Publisher
    ↓
Redis Channel
    ↓
Subscribers
```

The publisher and subscribers are loosely coupled.

They do not need direct knowledge of each other; Redis acts as the intermediary responsible for message delivery.
