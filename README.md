# 🧠 local-storage-typed

A tiny, type-safe wrapper for `localStorage` powered by [Zod](https://zod.dev). Validate and persist structured data in the browser with full type safety.

---

## ✨ Features

- ✅ **Schema-based** storage with [Zod](https://zod.dev)
- ✅ **Type-safe** reads and writes
- ✅ Easy to use in **React**, **Next.js**, or vanilla JS
- ✅ Small, dependency-light footprint

---

## 📦 Install

```bash
npm install local-storage-typed zod
```

## Example

```typescript
import { z } from "zod";
import { LocalStorageTyped } from "local-storage-typed";

const store = new LocalStorageTyped({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  theme: z.enum(["light", "dark"]),
});

// Save data
store.set("user", {
  id: "123",
  name: "Alice",
  email: "alice@example.com",
});

// Read data (typed!)
const user = store.get("user");
console.log(user?.name); // "Alice"

// Remove
store.remove("user");

// Clear all schema-defined keys
store.clear();
```

## 🛠 API

`new LocalZodStore(schemas)`

Create a new storage instance with your key–schema map.

`store.set(key, value)`

Validates and saves a value to localStorage.

`store.get(key)`

Retrieves and validates a value from localStorage.

`store.remove(key)`

Removes a single key from localStorage.

`store.clear()`

Removes all keys defined in the schema map.
