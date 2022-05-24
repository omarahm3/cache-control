const mongoose = require('mongoose')
const db = require('./db')
const Cache = require('../models/cache.model')
const cacheService = require('../services/cache.service')

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

})
