# Serverless Merge Config
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

Serverless merge config adds the ability to merge configuration after serverless variables have been evaluated.

# Installation
Run:
```
# From npm (recommended)
npm install --save-dev @cruglobal/serverless-merge-config

# From github
npm install --save-dev https://github.com/CruGlobal/serverless-merge-config.git
```
Then make the following edits to your serverless.yml file:
```yaml
plugins:
  - '@cruglobal/serverless-merge-config'
  - other-plugins
```
Including serverless-merge-config first will give other plugins access to the merged configuration.

# How it Works

Serverless merge config works similarly to YAML merge except that it merges after serverless has completed variable substitution.

Use `$<<` property to merge:
```yaml
provider:
    name: aws
    $<<: ${file:path/to/other.yml}
```
This will merge everything in `path/to/other.yml` to provider. Duplicate properties will be overridden by the merged value.

**caveat**: `serverless print` will not show the merged configuration. This command reloads and parses serverless.yml a second time with no hooks for plugins to tie into.

# Contributing
We welcome pull requests!
1. For any sizable change, first open a GitHub issue to discuss your idea.
2. Create a pull request.  Explain why you want to make the change and what it’s for.
