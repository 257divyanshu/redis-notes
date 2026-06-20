# Lecture 5 Notes — Caching User Profiles: JSON vs Hash

## User Profile Caching in Redis

User profile data is a common candidate for caching because:

* It is read frequently.
* It changes less frequently than it is read.
* Fetching it from Redis is much faster than repeatedly querying the primary database.

The database remains the **source of truth**, while Redis acts as a **cache layer**.

---

## Two Common Ways to Store User Profiles in Redis

### 1. Store as JSON String

Example:

```json
{
  "name": "Divyanshu",
  "email": "abc@gmail.com",
  "city": "Bhopal"
}
```

Stored in Redis as:

```text
Key:
user:123:json

Value:
'{"name":"Divyanshu","email":"abc@gmail.com","city":"Bhopal"}'
```

### Redis Command Used

```redis
SET user:123:json '{"name":"Divyanshu","email":"abc@gmail.com"}'
```

### Characteristics

* Simple to implement.
* Good for storing entire objects as-is.
* Requires:

  * `JSON.stringify()` before storing.
  * `JSON.parse()` after retrieving.

### Limitation

Redis treats the entire JSON as a single string value.

To update one field:

```text
GET entire object
↓
Parse JSON
↓
Modify field
↓
Stringify JSON
↓
SET entire object again
```

The whole value must be rewritten.

---

## 2. Store as Redis Hash

Redis provides a native data structure called a **Hash**.

Example:

```text
Key:
user:123:hash

Fields:
name  -> Divyanshu
email -> abc@gmail.com
city  -> Bhopal
```

### Redis Command Used

```redis
HSET user:123:hash name "Divyanshu" email "abc@gmail.com"
```

### Characteristics

* Data is stored as field-value pairs.
* Similar to an object/document.
* Supports field-level operations.
* Better suited for user profiles, settings, sessions, and metadata.

---

## Redis Commands Introduced

### Store Object

```redis
HSET
```

Stores one or more fields inside a Redis Hash.

---

### Retrieve Entire Object

```redis
HGETALL
```

Returns all fields and values of a hash.

Example:

```redis
HGETALL user:123:hash
```

Result:

```text
name  -> Divyanshu
email -> abc@gmail.com
city  -> Bhopal
```

---

### Retrieve a Single Field

```redis
HGET
```

Example:

```redis
HGET user:123:hash email
```

Returns:

```text
abc@gmail.com
```

Useful when only one field is needed.

---

### Delete a Field

```redis
HDEL
```

Example:

```redis
HDEL user:123:hash city
```

Removes only the specified field.

---

### Check Field Existence

```redis
HEXISTS
```

Example:

```redis
HEXISTS user:123:hash email
```

Checks whether a particular field exists inside the hash.

---

## Why Hashes Are Often Preferred for User Profiles

### Updating Individual Fields

With JSON:

```text
Update city
↓
Rewrite entire JSON
```

With Hash:

```redis
HSET user:123:hash city "Raipur"
```

Only the `city` field is updated.

---

### Counter Operations

Hashes work very well with counters.

Example:

```text
user:123:hash

loginCount -> 10
```

Increment:

```redis
HINCRBY user:123:hash loginCount 1
```

Result:

```text
loginCount -> 11
```

This is much more efficient than reading and rewriting a JSON object.

---

## When to Use JSON vs Hash

### Use JSON String When:

* You always read/write the entire object.
* The object contains deeply nested structures.
* You don't need field-level updates.

### Use Redis Hash When:

* Data resembles a profile, session, or settings object.
* Individual fields need to be updated.
* Field-level reads/writes are common.
* Counters and numeric fields need atomic increment/decrement operations.

---

## Interview Takeaways

* Redis supports multiple data structures, not just simple key-value storage.
* `SET` stores a single value (often a string).
* `HSET` stores data inside a Redis Hash.
* `HGETALL` retrieves an entire hash.
* `HGET`, `HDEL`, and `HEXISTS` operate on individual fields.
* Storing user profiles as a Hash is often preferable because fields can be updated independently.
* Hashes support efficient field-level operations such as `HINCRBY` for counters.
* Redis Hashes are commonly used for:

  * User profiles
  * Sessions
  * User preferences
  * Metadata
  * Application settings
