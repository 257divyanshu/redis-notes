## Redis

```yaml
volumes:
  - redis-data:/data
```

Format:

```text
VOLUME_NAME : PATH_INSIDE_CONTAINER
```

So Docker reads:

```text
redis-data  ->  /data
```

Meaning:

> Mount the Docker volume named `redis-data` inside the Redis container at `/data`.

---

## Mongo

```yaml
volumes:
  - mongo-data:/data/db
```

Docker reads:

```text
mongo-data -> /data/db
```

Meaning:

> Mount the Docker volume named `mongo-data` inside the Mongo container at `/data/db`.

---

## Then what is the bottom section doing?

```yaml
volumes:
  redis-data:
  mongo-data:
```

This is simply declaring:

```text
Please create two named volumes:

1. redis-data
2. mongo-data
```

Nothing more.

---