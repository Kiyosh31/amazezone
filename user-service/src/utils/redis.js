const transformRedisToJSON = (data) => JSON.parse(data)

const transformJSONToRedis = (data) => JSON.stringify(data)

export { transformJSONToRedis, transformRedisToJSON }
