'use strict'

const {
  assign,
  forEach,
  isArray,
  isPlainObject,
  unset
} = require('lodash')

class ServerlessMergeConfig {
  constructor (serverless, options) {
    this.serverless = serverless
    this.options = options

    this.hooks = {
      'before:package:initialize': this.mergeConfig.bind(this),
      'before:offline:start:init': this.mergeConfig.bind(this)
    }
  }

  mergeConfig () {
    this.deepMerge(this.serverless.service)
  }

  deepMerge (obj) {
    forEach(obj, (value, key, collection) => {
      if (isPlainObject(value) || isArray(value)) {
        this.deepMerge(value)
      }
      if (key === '$<<') {
        if (isPlainObject(value)) {
          // Only merge objects
          assign(collection, value)
        }
        unset(obj, key)
      }
    })
  }
}

module.exports = ServerlessMergeConfig
