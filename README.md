# Nuget4Code [![Build status](https://travis-ci.org/fforjan/nuget4code.svg)](https://travis-ci.org/fforjan/nuget4code)

This is a simple extension to add and remove nuget packages to your project.json.

Current limitation:
- the repository is hard-coded to nuget.org.
- It only support one project.json. If you have multiple, it will check if one is currently active and use that one if required.
- it only installs the latest version.