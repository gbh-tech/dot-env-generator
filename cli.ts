#!/usr/bin/env bun

import { Command } from 'commander';
import { description, name, version } from './package.json';
import { onePasswordCommand } from './src/commands/op';
import { werfCommand } from './src/commands/werf';

const cli = new Command();

cli
  .name(name)
  .version(version)
  .summary(description)
  .addCommand(werfCommand())
  .addCommand(onePasswordCommand());

cli.parse();
