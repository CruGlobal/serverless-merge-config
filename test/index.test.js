'use strict'

const ServerlessMergeConfig = require('../index')

const constructPlugin = (serviceConfig) => {
  const serverless = {
    service: serviceConfig,
    cli: {},
    providers: {
      aws: {}
    }
  }
  return new ServerlessMergeConfig(serverless)
}

describe('serverless-merge-config', () => {
  it('should do nothing if config has no merge', () => {
    let config = {provider: {name: 'aws', runtime: 'nodejs6.10'}}
    let plugin = constructPlugin(config)
    plugin.mergeConfig()
    expect(plugin.serverless.service).toEqual(config)
  })

  it('should merge config and overwrite existing values', () => {
    let config = {provider: {name: 'aws', runtime: 'nodejs6.10', '$<<': {runtime: 'python', region: 'us-west-2'}}}
    let plugin = constructPlugin(config)
    plugin.mergeConfig()
    expect(plugin.serverless.service).toEqual({provider: {name: 'aws', runtime: 'python', region: 'us-west-2'}})
  })

  it('should handle multiple merges', () => {
    let config = {
      provider: {name: 'aws', runtime: 'nodejs6.10', '$<<': {runtime: 'python', region: 'us-west-2'}},
      custom: {sample: {name: 'test', '$<<': {foo: 'bar'}}}
    }
    let plugin = constructPlugin(config)
    plugin.mergeConfig()
    expect(plugin.serverless.service).toEqual({
      provider: {name: 'aws', runtime: 'python', region: 'us-west-2'},
      custom: {sample: {name: 'test', foo: 'bar'}}
    })
  })

  it('should handle nested merges', () => {
    let config = {
      provider: {name: 'aws'},
      custom: {sample: {name: 'test', '$<<': {foo: 'bar', '$<<': {nested: true}}}}
    }
    let plugin = constructPlugin(config)
    plugin.mergeConfig()
    expect(plugin.serverless.service).toEqual({
      provider: {name: 'aws'},
      custom: {sample: {name: 'test', foo: 'bar', nested: true}}
    })
  })

  it('should merge arrays of objects', () => {
    let config = {provider: {name: 'aws', '$<<': [{foo: 'bar'}, {egg: 'spam'}]}}
    let plugin = constructPlugin(config)
    plugin.mergeConfig()
    expect(plugin.serverless.service).toEqual({provider: {name: 'aws', foo: 'bar', egg: 'spam'}})
  })

  it('should not merge arrays', () => {
    let config = {provider: {name: 'aws', '$<<': [1, 2, 3]}}
    let plugin = constructPlugin(config)
    plugin.mergeConfig()
    expect(plugin.serverless.service).toEqual({provider: {name: 'aws'}})
  })

  it('should not merge strings', () => {
    let config = {provider: {name: 'aws', '$<<': 'hello'}}
    let plugin = constructPlugin(config)
    plugin.mergeConfig()
    expect(plugin.serverless.service).toEqual({provider: {name: 'aws'}})
  })

  it('should not merge undefined', () => {
    let config = {provider: {name: 'aws', '$<<': undefined}}
    let plugin = constructPlugin(config)
    plugin.mergeConfig()
    expect(plugin.serverless.service).toEqual({provider: {name: 'aws'}})
  })
})
