When people say:

> "Containers are isolated"

the natural question is:

> "If all containers share the same kernel, why don't they interfere with each other?"

The answer is:

```text
Namespaces + cgroups
```

Let's understand them one by one.

---

# First: What problem are we solving?

Suppose you run:

```bash
docker run redis
docker run mongo
docker run ubuntu
```

Now three containers are running.

Without isolation, all three would:

* See each other's files
* See each other's processes
* Use all available RAM
* Use all available CPU

Chaos.

Linux solves this using namespaces and cgroups.

---

# Part 1: Namespaces

Think of a namespace as:

> A private view of the system.

Each container gets its own view.

---

## Example 1: Process Namespace

Suppose your machine has:

```text
Chrome
VS Code
Redis Container
Mongo Container
```

Normally, if Redis could see everything, it would see:

```text
Chrome
VS Code
Mongo
Redis
```

But Linux creates a process namespace.

Inside Redis container:

```text
Redis
```

is all it sees.

Inside Mongo container:

```text
Mongo
```

is all it sees.

Each container thinks:

```text
I am the only process running.
```

Even though that's not true.

---

## Example 2: File System Namespace

Imagine your Windows machine has:

```text
C:\Users
C:\Photos
C:\Movies
```

You run:

```bash
docker run ubuntu
```

Inside the container:

```bash
ls /
```

you might see:

```text
bin
etc
usr
home
```

The container cannot see:

```text
C:\Photos
C:\Movies
```

unless you explicitly share them.

Why?

Because it has its own filesystem namespace.

The container thinks:

```text
This is the whole disk.
```

But it's only seeing its own isolated view.

---

## Example 3: Network Namespace

Suppose:

```text
Redis Container
Mongo Container
Node Container
```

are running.

Each container gets:

```text
Own IP
Own network interfaces
Own ports
```

Redis thinks:

```text
I own port 6379
```

Mongo thinks:

```text
I own port 27017
```

Node thinks:

```text
I own port 3000
```

Each container gets a private networking world.

---

## Example 4: User Namespace

Inside a container:

```bash
whoami
```

may return:

```text
root
```

But that doesn't necessarily mean:

```text
Root on the host machine
```

Linux can map container users to different host users.

This improves security.

---

# What Namespaces Really Do

Namespaces create the illusion:

```text
Container:
"I have my own machine."
```

Reality:

```text
Many containers
Same machine
Same kernel
```

Namespaces are basically:

```text
Isolation of visibility
```

They control:

```text
What a container can see.
```

---

# Part 2: cgroups

Namespaces solve:

```text
Visibility
```

But not:

```text
Resource usage
```

Example:

Suppose Redis suddenly consumes:

```text
100% CPU
All RAM
```

Then Mongo and Node may crash.

Linux solves this with cgroups.

---

# What is a cgroup?

cgroup = Control Group

Think:

> Resource quotas.

---

## Example: Memory Limit

Suppose machine has:

```text
16 GB RAM
```

You say:

```bash
docker run --memory=2g redis
```

Redis now gets:

```text
Maximum 2 GB
```

Even if:

```text
14 GB is free
```

it cannot exceed:

```text
2 GB
```

because cgroups enforce the limit.

---

## Example: CPU Limit

Machine:

```text
8 CPU cores
```

Container:

```bash
docker run --cpus=2 redis
```

Redis may only use:

```text
2 CPU cores worth
```

even though the machine has 8.

---

# Real World Analogy

Imagine an apartment building.

---

## Namespaces

Namespaces are:

```text
Walls
Doors
Separate Apartments
```

They determine:

```text
What tenants can see.
```

Tenant A cannot see inside Tenant B's apartment.

---

## cgroups

cgroups are:

```text
Electricity limits
Water limits
Parking limits
```

They determine:

```text
How much resources tenants can consume.
```

One tenant cannot use all the water and leave nothing for everyone else.

---

# Putting It Together

Suppose you run:

```bash
docker run redis
docker run mongo
docker run node
```

Linux provides:

### Namespaces

```text
Redis sees only Redis world
Mongo sees only Mongo world
Node sees only Node world
```

### cgroups

```text
Redis gets limited CPU/RAM
Mongo gets limited CPU/RAM
Node gets limited CPU/RAM
```

Result:

```text
Shared Kernel
+
Namespaces
+
cgroups
=
Containers
```

This is the secret sauce.

Containers are **not tiny virtual machines**.

They are simply **regular Linux processes** that the kernel isolates using:

```text
Namespaces -> isolate visibility
cgroups -> isolate resources
```

That's the core idea behind modern containerization. 🚀
