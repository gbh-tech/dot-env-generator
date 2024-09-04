#!/usr/bin/env bun

import { Command } from 'commander';
import { createClient } from "@1password/sdk";
import type { EnvVarObject } from '../interfaces'
import { generateEnvFile } from '../parser';
import { name, version } from '../../package.json';

export const onePasswordCommand = () => {
  const command = new Command();

  command
    .name('op')
    .summary('1Password Env-File Generator CLI')
    .requiredOption(
        '-v, --vault <vault>',
        'Target vault to fetch secret item'
    )
    .requiredOption(
      '-i, --item <item...>',
      'Target secret for which to generate the .env file'
    )
    .option(
      '-p, --to-path <path...>',
      'Path(s) to generate the dot env (.env) file to',
      ['.env'],
    )
    .action(async(options) => {
      const vault = options.vault.trim();
      const items = options.item;

      const client = await createClient({
        auth: process.env.OP_SERVICE_ACCOUNT_TOKEN ?? '',
        integrationName: name,
        integrationVersion: version,
      });
        
      for (const item of items) {
        const vaultItem = await client.items.get(vault, item);
        
        const envData = vaultItem.fields.reduce((key, item) => {
          key[item.title] = item.value;
          return key;
        }, {} as EnvVarObject);

        for (const path of options.toPath) {
          generateEnvFile(envData, path);
        }
      }
    });

  return command;
};

export default onePasswordCommand();

