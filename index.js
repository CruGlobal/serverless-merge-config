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
      'before:offline:start:init': this.mergeConfig.bind(this),
      'before:invoke:local:invoke': this.mergeConfig.bind(this)
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
        if (isArray(value)) {
          value.forEach((subValue) => {
            this.assignValue(collection, subValue)
          })
        } else {
          this.assignValue(collection, value)
        }
        unset(obj, key)
      }
    })
  }

  assignValue (collection, value) {
    if (isPlainObject(value)) {
      // Only merge objects
      assign(collection, value)
    }
  }
}

module.exports = ServerlessMergeConfig
