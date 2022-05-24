const mongoose = require('mongoose')
const db = require('./db')
const Cache = require('../models/cache.model')
const cacheService = require('../services/cache.service')

jest.mock('../config', () => ({
  maximumCacheSize: 2,
}))

const config = require('../config')

// Connect to new in-memory database before running a test
beforeAll(async () => await db.connect())

// Clear all data after every test
afterEach(async () => await db.clearDatabase())

// Close the db and server after all tests are finished
afterAll(async () => await db.closeDatabase())

describe('Cache', () => {

  describe('return cached data for given string', () => {
    test('should return new random string', async () => {
      const test = {
        key: 'test',
        value: 'randomstring',
      }

      const { hit, value } = await cacheService.handleGetCacheByKey(test.key, () => {
        return test.value
      })

      const record = await Cache.findOne({ key: 'test' })

      expect(hit).toBe(false)
      expect(record.key).toBe(test.key)
      expect(record.value).toBe(test.value)
    })

    test('should return an existing string', async () => {
      const test = {
        key: 'test',
        value: 'randomstring',
      }

      // Call first fetch the cache data to create it
      const initialHit = await cacheService.handleGetCacheByKey(test.key, () => {
        return test.value
      })

      expect(initialHit.hit).toBe(false)
      expect(initialHit.value).toBe(test.value)

      const secondHit = await cacheService.handleGetCacheByKey(test.key, () => {
        return test.anotherValue
      })

      const record = await Cache.findOne({ key: 'test' })

      expect(secondHit.hit).toBe(true)
      expect(secondHit.value).toBe(test.value)
      expect(record.key).toBe(test.key)
      expect(record.value).toBe(test.value)
    })

    test('should override oldest cache when cache size is reached', async () => {
      const date = new Date()
      const goneKey = 'testgone'
      const data = [
        {
          key: goneKey,
          value: 'ishouldbegone',
          createdAt: date.setHours(date.getHours() - 2),
          updatedAt: date.setHours(date.getHours() - 2),
        },
        {
          key: 'test',
          value: 'ishouldstay',
          createdAt: date.setHours(date.getHours() - 1),
          updatedAt: date.setHours(date.getHours() - 1),
        }
      ]

      await Cache.insertMany(data)

      const test = {
        key: 'newkey',
        value: 'newvalue'
      }

      const { hit, value } = await cacheService.handleGetCacheByKey(test.key, () => {
        return test.value
      })

      const newRecord = await Cache.findOne({ key: test.key })
      const oldRecord = await Cache.findOne({ key: goneKey })

      expect(hit).toBe(false)
      expect(value).toBe(test.value)
      expect(newRecord.key).toBe(test.key)
      expect(newRecord.value).toBe(test.value)
      expect(oldRecord).toBe(null)
    })
  })

  describe('return all stored keys', () => {
    test('should return all keys', async () => {
      const key1 = 'test1'
      const key2 = 'test2'
      const fixtures = [
        {
          key: key1,
          value: 'value1',
        },
        {
          key: key2,
          value: 'value2',
        },
      ]

      await Cache.insertMany(fixtures)
      const data = await cacheService.getAllStoredKeys()

      expect(data.length).toBe(2)
      expect(data).toContain(key1)
      expect(data).toContain(key2)
    })

    test('should return empty list', async () => {
      const data = await cacheService.getAllStoredKeys()

      expect(data.length).toBe(0)
    })
  })

  describe('create or update cache record', () => {
    test('should update existing cache record', async () => {
      const cacheRecord = {
        key: 'test',
        value: 'ineedtobeupdated',
      }
      const newValue = 'updatedvalue'

      const cache = new Cache(cacheRecord)
      await cache.save()

      const updatedValue = await cacheService.createOrUpdateCache(cacheRecord.key, newValue)
      const dbRecord = await Cache.findOne({ key: cacheRecord.key })

      expect(updatedValue).toBe(newValue)
      expect(dbRecord.value).toBe(newValue)
    })

    test('should create new record', async () => {
      const cacheRecord = {
        key: 'test',
        value: 'idontexist',
      }

      const record = await Cache.findOne({ key: cacheRecord.key })

      expect(record).toBeNull()

      const value = await cacheService.createOrUpdateCache(cacheRecord.key, cacheRecord.value)
      const dbRecord = await Cache.findOne({ key: cacheRecord.key })

      expect(dbRecord.value).toBe(cacheRecord.value)
      expect(value).toBe(cacheRecord.value)
    })
  })

  describe('remove a given key from cache', () => {
    test('should remove existing key from cache', async () => {
      const data = {
        key: 'test',
        value: 'ishouldberemoved'
      }

      await Cache.insertMany([data])

      const result = await cacheService.removeKey(data.key)

      expect(result).toBe(true)
    })

    test('should return false if it does not exist', async () => {
      const result = await cacheService.removeKey('whereami')

      expect(result).toBe(false)
    })
  })

  describe('remove all keys from cache', () => {
    test('should remove all keys from cache', async () => {
      const data = [
        {
          key: 'test1',
          value: 'ishouldberemoved'
        },
        {
          key: 'test2',
          value: 'ishouldberemoved'
        },
        {
          key: 'test3',
          value: 'ishouldberemoved'
        },
      ]

      await Cache.insertMany(data)

      const result = await cacheService.removeAllKeys()

      expect(result).toBe(true)
    })

    test('should return false if there are no keys', async () => {
      const result = await cacheService.removeAllKeys()
      expect(result).toBe(false)
    })
  })

})
