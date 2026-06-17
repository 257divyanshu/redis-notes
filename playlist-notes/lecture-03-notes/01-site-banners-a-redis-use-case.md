### Site Banners / Hello Bars — Redis Use Case

* **Site banners**, **announcement bars**, **promo bars**, or **hello bars** are UI elements displayed across a website to show:

  * Promotional offers and discounts
  * Important announcements
  * Maintenance notifications
  * Warnings or alerts
  * New feature launches

* These banners are typically displayed to **all users** visiting the website.

* Since the same banner data is requested repeatedly by a large number of users, fetching it directly from the primary database on every request is inefficient.

* A common approach is:

  * Store the banner configuration permanently in the **database** (source of truth).
  * Cache the banner data in **Redis**.
  * Serve banner data from Redis to reduce database reads and improve response times.

### Why Redis is a Good Fit

* Banner data changes infrequently but is read very frequently.
* This makes it an ideal candidate for caching.
* Serving banners from Redis:

  * Reduces database load.
  * Improves application performance.
  * Provides faster response times to users.

### Banner Management

* Banner content is usually managed through an **admin panel (CMS/dashboard)**.
* When an administrator updates the banner:

  * The database record is updated.
  * The Redis cache can be refreshed or invalidated accordingly.

### Alternative Approach

* For applications where banner content rarely changes, banners can also be hardcoded or served as static configuration files.
* However, using a database + Redis cache provides greater flexibility for dynamic updates.

### Redis Concept Demonstrated

This example demonstrates one of the most common Redis use cases:

> **Cache frequently-read, rarely-updated data to reduce database read pressure and improve response times.**

---

### Interview Takeaway

A site banner/hello bar is a classic example of **cacheable data** because it is:

* Read frequently
* Updated infrequently
* Shared across many users

Such data is commonly stored in Redis while the database remains the source of truth.
