const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379"
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

async function connect() {
  if (!client.isOpen) {
    await client.connect();
  }
}

async function set(key, value) {
  await connect();
  await client.set(key, value);
}

async function get(key) {
  await connect();
  return await client.get(key);
}

module.exports = {
  set,
  get
};