# 2. Understanding docker-compose.yml

Think of this file as:

> "Docker, please create these containers for me."

---

## services

```yaml
services:
```

A service = a container definition.

Here you defined:

```yaml
services:
  redis:
  mongo:
```

Meaning:

```text
Create 2 containers

1. Redis Container
2. Mongo Container
```

---

## Redis Service

```yaml
redis:
```

Service name.

---

### image

```yaml
image: redis:7-alpine
```

Means:

```text
Use Redis version 7
Use Alpine Linux variant
```

Alpine = lightweight Linux distribution.

---

### container_name

```yaml
container_name: chai-aur-redis
```

Container's custom name.

Without this:

```text
redis-project-redis-1
```

With this:

```text
chai-aur-redis
```

---

### ports

```yaml
ports:
  - "6379:6379"
```

Format:

```text
HOST_PORT : CONTAINER_PORT
```

Meaning:

```text
Your Computer     Redis Container
6379     --->     6379
```

Now your Express app can access:

```text
localhost:6379
```

---

### command

```yaml
command:
  ["redis-server", "--appendonly", "yes"]
```

Normally Docker runs:

```bash
redis-server
```

You are overriding it with:

```bash
redis-server --appendonly yes
```

This enables:

```text
AOF Persistence
(Append Only File)
```

Redis writes operations to disk.

Without this:

```text
Container crash
↓
Data lost
```

---

### volumes

```yaml
volumes:
  - redis-data:/data
```

This is VERY IMPORTANT.

Without volume:

```text
Delete container
↓
All Redis data gone
```

With volume:

```text
Delete container
↓
Data survives
```

Think:

```text
Container = laptop RAM

Volume = hard disk
```

---

# Mongo Service

Same concepts.

---

### image

```yaml
image: mongo:7
```

MongoDB version 7.

---

### ports

```yaml
ports:
  - "27017:27017"
```

MongoDB default port:

```text
27017
```

---

### environment

```yaml
environment:
  MONGO_INITDB_DATABASE: chai_aur_redis
```

Environment variable passed to Mongo container.

Creates/defaults database:

```text
chai_aur_redis
```

---

### volume

```yaml
volumes:
  - mongo-data:/data/db
```

Mongo stores data inside:

```text
/data/db
```

Volume ensures persistence.

---

# Bottom Section

```yaml
volumes:
  redis-data:
  mongo-data:
```

Create named volumes:

```text
redis-data
mongo-data
```

Docker manages them automatically.

---

# What happens when you run?

```bash
docker compose up
```

Docker does:

```text
1. Read docker-compose.yml

2. Download:
   - Redis Image
   - Mongo Image

3. Create:
   - Redis Container
   - Mongo Container

4. Create:
   - redis-data volume
   - mongo-data volume

5. Start everything
```

Result:

```text
localhost:6379  -> Redis

localhost:27017 -> Mongo
```

---