# Redis Notes — Lecture 1: Introduction & Use Cases

## What is Redis?

* Redis stands for **Remote Dictionary Server**.
* Redis is an **in-memory data store** that primarily keeps data in **RAM**, making data access extremely fast.
* Although Redis is often called an **in-memory database**, it is more accurate to describe it as an **in-memory data structure store**.
* Redis also supports **data persistence**, allowing data to be saved to disk and restored after a restart.
* Since Redis loads its working dataset into RAM, read and write operations are significantly faster than traditional disk-based databases.

### Why is Redis Fast?

* Accessing data from RAM is much faster than accessing data from a hard disk or SSD.
* Redis keeps frequently accessed data in memory, reducing retrieval time.

---

# Redis in a Typical Application

## Redis + Database Architecture

A common architecture looks like:

```text
User
  ↓
Backend Application
  ↓
Redis (Cache)
  ↓
Database (MongoDB/PostgreSQL)
```

### Data Retrieval Flow

1. User sends a request.
2. Backend checks Redis first.
3. If data exists in Redis:

   * Return data immediately.
   * No database query is required.
4. If data does not exist in Redis:

   * Fetch data from the database.
   * Store the data in Redis (optional, depending on caching strategy).
   * Return the data to the user.

### Important Points

* Redis is **not a replacement for a primary database**.
* The primary database remains the **source of truth**.
* Redis is mainly used to improve performance and reduce database load.
* Modern databases may also support in-memory caching, but Redis is purpose-built for high-performance caching.

---

# Cache Hit vs Cache Miss

## Cache Hit

A **cache hit** occurs when the requested data is already present in Redis.

```text
User → Backend → Redis → Backend → User
```

### Benefits

* Very fast response.
* Database is not queried.
* Reduced read load on the database.

---

## Cache Miss

A **cache miss** occurs when the requested data is not found in Redis.

```text
User → Backend → Redis
                    ↓
                Database
                    ↓
                 Redis
                    ↓
                 Backend
                    ↓
                  User
```

### Characteristics

* Slower than a cache hit.
* Requires a database query.
* Retrieved data is often cached in Redis for future requests.

---

## Hot Data

**Hot data** refers to data that is requested frequently.

Examples:

* Restaurant menus
* Product catalogs
* Popular products
* Trending content

Such data is often stored in Redis to reduce repeated database reads.

### Real-World Examples

Applications like food delivery and e-commerce platforms often cache:

* Restaurant information
* Menus
* Product listings
* Frequently viewed content

---

# Common Redis Use Cases

## 1. Caching

The most common Redis use case.

### Goal

Reduce database read pressure and improve response times.

### Good Candidates for Caching

* Frequently accessed data
* Data that changes infrequently
* Public data requested by many users

---

## 2. Session Store

Redis can be used to store user sessions.

Example:

```text
session:abcd123
{
  userId: 4,
  role: "user"
}
```

### Benefits

* Fast session lookup
* Shared across multiple application servers
* Sessions can expire automatically

---

## 3. OTP Storage

OTPs are temporary data and fit Redis perfectly.

Example:

```text
otp:98989898 → 342324
TTL: 3 minutes
```

### Benefits

* Fast access
* Automatic expiration
* No manual cleanup required

---

## 4. Rate Limiting

Redis can track request counts efficiently.

Example:

```text
rate_limit:192.168.1.1

count: 6
TTL: 10 minutes
```

### Common Uses

* API rate limiting
* Login attempt limits
* OTP request limits
* Abuse prevention

---

## 5. Job Queues

Redis supports queue-like data structures such as **Lists**.

Example workflow:

```text
Producer
   ↓
 Redis Queue
   ↓
Worker 1
Worker 2
Worker 3
```

### Examples

* Sending emails
* Push notifications
* Report generation
* Image processing
* Background tasks

### Worker

A worker is a separate process/application dedicated to performing a specific task asynchronously.

---

# Redis Data Model

Redis commonly stores data as **key-value pairs**.

Examples:

```text
product:all      → [ ...products ]
otp:98989898     → 342324
session:abcd123  → { userId: 4, role: "user" }
```

### Key Naming Best Practices

Use descriptive names and namespaces:

```text
user:1
session:abcd123
otp:98989898
product:all
```

This helps avoid key collisions and improves maintainability.

---

# TTL (Time To Live)

TTL defines how long a key should remain in Redis.

Example:

```text
SET otp:98989898 342324 EX 180
```

The key automatically expires after 180 seconds.

### Benefits

* Automatic cleanup
* No manual deletion required
* Ideal for temporary data

---

# Key Expiration & Invalidation

Redis has built-in support for:

### Expiration

Keys are automatically deleted after their TTL expires.

### Invalidation

Cached data can be removed when it becomes outdated or invalid.

This helps ensure users do not receive stale data.

---

# When Should You Use Redis?

Consider Redis when:

### 1. You need to reduce database read pressure.

Examples:

* Product catalogs
* Menus
* Frequently viewed pages

### 2. You need temporary storage.

Examples:

* OTPs
* Verification tokens
* Password reset tokens

### 3. You need shared counters.

Examples:

* Page views
* Likes
* API request counts
* Rate limiting

### 4. You need background job processing.

Examples:

* Email queues
* Notification queues
* Report generation
* Image processing

---

# Interview Takeaways

* Redis = **In-memory data structure store**.
* Redis is commonly used as a **cache**, **session store**, **rate limiter**, and **job queue backend**.
* Redis is **not a replacement for MongoDB/PostgreSQL**.
* The database remains the **source of truth**.
* **Cache Hit = Fast**, **Cache Miss = Slower**.
* **Hot data** is often cached in Redis.
* **TTL (Time To Live)** enables automatic expiration of keys.
* Redis helps reduce database load and improve application performance.
