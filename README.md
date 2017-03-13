# Node Batteries

This repo contains several modules I find myself needing in just about every
Nodejs project I've encountered. The idea of `node-batteries` is to provide a
repo that will include these common modules in one place.

## What is a battery?

For a module to be a 'battery' it must be capable of being 1) dropped into any
project, 2) have no external dependencies outside the battery context so it can
easily be copied as source into a project.

## Requiring this package

This package, although not intended to be installed as a dependency directly,
can be required as a module itself, wherein all batteries are exposed as the
module's API.
