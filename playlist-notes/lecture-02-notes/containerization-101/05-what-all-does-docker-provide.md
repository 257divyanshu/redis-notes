### 1. Build Images

Docker can create an **image** (blueprint/template) from your application and its dependencies.

Example:

```bash
docker build -t my-app .
```

---

### 2. Run Containers

Docker can create and start a **container** (running instance) from an image.

Example:

```bash
docker run my-app
```

---

### 3. Distribute Containers

Docker can package your image and make it available across machines and environments.

Example:

```text
Build on laptop → Run on server
```

---

### 4. Share Containers

Docker lets you upload images to registries like Docker Hub so other people can download and run them.

Example:

```text
You upload → Teammate downloads
```

---

### 5. Version Containers

Docker images can be tagged with versions, allowing you to track and use specific releases.

Example:

```text
node:18
node:20
redis:7
redis:8
```

So in one sentence:

```text
Build = Create image
Run = Start container
Distribute = Move image across environments
Share = Publish image for others
Version = Maintain multiple image releases
```
