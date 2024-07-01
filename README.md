<!-- omit in toc -->
# Werf Env File (.env) Generator

<!-- omit in toc -->
## Contents

- [Summary](#summary)
- [Install](#install)
- [Run](#run)
- [Compile](#compile)

## Summary

This is a simple tool that help us generate a .env based on the render of werf.

## Install

To install dependencies:

```bash
bun install
```

## Run

To run:

```bash
./cli.ts --environment 'stage' --secrets
```

## Compile

To compile the project:

```bash
bun build ./cli.ts --compile --outfile werf-env-generator
```
