# Development and Deployment Guide

Below are the instructions for developing/deploying Open Joystick Display 2.x. Please note that these instructions will change when version 3.x is released as this will have a completely different build process for it.

## Development/Deployment Dependencies 

 - Node LTS Version 12 ([https://nodejs.org/en/download/](https://nodejs.org/en/download/))
 - Yarn (From Node NPM)
 - Gulp (From Node NPM)
 - Python 2 and 3
 - Compiler Suite (For Binary Building)
     - **Windows**: Visual Studio Express (or you can grab build tools from Chocolaty)
     - **MacOS**: XCode with Command Line Tools
     - **Linux**: GCC/G++ or CLANG/LLVM

## Development: Getting Started
In the root of the `open-joystick-display` directory do the following:
- `gulp electron-rebuild`
- `yarn start`

Rebuilding electron for your target platform is required due to the bindings required for `node-serialport`. If you skip this step and you launch electron it will have a very broken interface and won't load completely. **Do not skip this step.**

## Development: Compiling CSS (Using the Watcher)
In the root of the `open-joystick-display` directory run `gulp` to enable the CSS watcher. This compiles the LESS into CSS.

## Deploying: Building a Binary
In the root of the `open-joystick-display` directory do the following:

 - Run: `yarn install`
 - Run: `yarn build`

Note that `yarn build` does everything including building CSS and rebuilding the electron binary for `node-serialport`. You don't need to do anything else here.
 
 The binaries will be built in the `/dist` you will see various formats for bundles, the formats for each operating system are as follows:
 
- Windows
  - Package Types:  `zip` and `exe`
- macOS
  - Package Types: `zip` (DMG no longer supported)
- Linux
  - `tar.gz`, `deb`, `AppImage` 

The raw build will also be located in the `/dist/${os}-unpacked` directory if you wish to bundle it yourself.


