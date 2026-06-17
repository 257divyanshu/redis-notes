# 1. Why do we need Docker to use Redis locally?

**Short answer:**
You don't.

You can install Redis directly on your machine.

```text
Windows
  Redis installed directly

or

Windows
  Docker
    └── Redis Container
```

Both work.

---

## Then why did the instructor use Docker?

Because Docker makes setup easier and consistent.

Without Docker:

```text
1. Download Redis
2. Install Redis
3. Configure Redis
4. Start Redis
5. Deal with OS-specific issues
```

With Docker:

```bash
docker compose up
```

Done.

Docker automatically:

* Downloads Redis image
* Creates Redis container
* Starts Redis server
* Exposes port 6379

---

## Real-world reason

Suppose:

* You use Windows
* Friend uses Mac
* Company server uses Linux

Redis installation steps differ.

But Docker works almost the same everywhere.

```text
Docker
   ↓
Same Redis setup
   ↓
Windows / Mac / Linux
```

This is why Docker is extremely popular.

---

# What exactly is Docker?

Think of Docker as:

```text
A box that contains:
- Application
- Dependencies
- Configuration
```

For Redis:

```text
Redis Container
 ├── Redis Server
 ├── Redis Config
 └── Everything Redis needs
```

You don't install Redis directly on your machine.

You run the Redis container.

---