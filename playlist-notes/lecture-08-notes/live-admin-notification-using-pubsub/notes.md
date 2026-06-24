# Live Admin Notification Using Redis Pub/Sub

## Project Structure

The demo consists of two main components:

### 1. `api.js`

Acts as the **Publisher**.

Responsibilities:

* Receives incoming HTTP requests.
* Creates notification payloads.
* Publishes notifications to a Redis channel.

In this demo, a separate publisher file is not required because the API itself performs the publishing operation whenever a request is received.

---

### 2. `subscriber.js`

Acts as the **Subscriber**.

Responsibilities:

* Subscribes to one or more Redis channels.
* Continuously listens for incoming messages.
* Processes notifications whenever a message is published to a subscribed channel.

---

## Publisher-Subscriber Flow

```text
Admin Request
      ↓
API (Publisher)
      ↓
Redis Channel
      ↓
Subscriber(s)
```

Example:

```text
POST /notifications
        ↓
Publish message on "notifications" channel
        ↓
All active subscribers receive the message
```

---

## Why No Separate Publisher File?

In this demo:

```text
Client Request
      ↓
API Endpoint
      ↓
publisher.publish(...)
```

The API itself is acting as the publisher.

Therefore:

```text
api.js = API + Publisher
```

A dedicated publisher process is unnecessary for such a small example.

---

## When Are Separate Publishers Used?

In larger systems, publishers are often independent services.

Examples:

### Order Service

```text
Order Created
      ↓
Publish "order-created" event
```

### Payment Service

```text
Payment Successful
      ↓
Publish "payment-success" event
```

### Inventory Service

```text
Stock Updated
      ↓
Publish "inventory-updated" event
```

In such architectures:

```text
Order Service
        ↓
Payment Service
        ↓
Inventory Service
        ↓
Notification Service
```

all may act as publishers and communicate through Redis Pub/Sub channels.

---

## Key Learning from This Demo

The goal of this project is not notification delivery itself.

The main concept being demonstrated is:

> Redis Pub/Sub enables real-time communication between independent applications, services, or workers through channels, where publishers send messages and all active subscribers listening on that channel receive them immediately.

---

## Important Limitation

Redis Pub/Sub is an **ephemeral messaging system**.

```text
Subscriber Online
      ↓
Receives Message
```

```text
Subscriber Offline
      ↓
Misses Message
```

Redis does not store Pub/Sub messages for later delivery.

Only subscribers that are actively connected at the time of publication receive the message. This is one of the major differences between **Pub/Sub** and **BullMQ queues**.
