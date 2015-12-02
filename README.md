
# ![Icon](icon.png) Nuget4Code [![Build status](https://travis-ci.org/fforjan/nuget4code.svg)](https://travis-ci.org/fforjan/nuget4code)

This is a simple extension to add and remove nuget packages to your project.json.

## Where is the name coming from ?

Well, I was looking for an excuse to do some coding into Visual Studio Code extensions... 
And I'm looking to demo aspnet5 ConsoleApplication to my team and was missing the nuget stuff.
So, which is my reason to code ? Yes, nuget4code !
Also, instead of dogfood, I prefer to eat my own nuggets.. So here is nuget4code.

## Feature:
- Query and add a package from official nuget.org repository
- Remove a referenced package
- Upgrade to latest

## Current limitation:
- Only one repository which must be a gallery, but can be configured.
- It only support one project.json. If you have multiple, it will check if the active document is a project.json and use that one if possible.
- it only installs the latest version.
- it doesn't take care of the dependencies
- extension doesn't use Visual Studio Code document and write directly to file which bring inconsystency

## Commands screenshot :
![nuget remove and install commands](./resources/commands.png)

## Todo :
- handle wrong cases better
- support extra configuration (number of items displayed...)

## Others
Copyright : icon is coming from http://www.clker.com/clipart-15451.html
