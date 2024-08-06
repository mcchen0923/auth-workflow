const redis = require('redis')
const client = redis.createClient({ host: '127.0.0.1', port: 6379 })

client.connect();

client.on('connect', () => console.log('Connected to Redis'))
client.on('error', (err) => console.log('Redis error: ' + err))

exports.get = async (key) => await client.get(key)
exports.set = async (key, value) => await client.set(key, value)
exports.del = async (key) => await client.del(key)

