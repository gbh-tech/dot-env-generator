#!/usr/bin/env bun

import { execSync } from 'node:child_process';
import { Command } from 'commander';
import yaml from 'js-yaml';
import type { yamlDoc } from '../interfaces';
import { generateEnvFile, mergeDataFromManifests } from '../parser';

export const werfCommand = () => {
  const command = new Command();

  command
    .name('werf')
    .summary('Werf Env-File Generator CLI')
    .option('-v,--values <variable>', 'Set extra environment values')
    .requiredOption(
      '-e, --environment <env>',
      'Target environment for which to generate the .env file',
    )
    .option(
      '-s, --secrets',
      'Whether to include secret files in the Werf command',
      true,
    )
    .option(
      '-p, --to-path <path...>',
      'Path(s) to generate the dot env (.env) file to',
      ['.env'],
    )
    .action((options) => {
      const environment = options.environment.trim();

      const werfCommand = [
        'werf',
        'render',
        `--env ${environment}`,
        `--values .helm/values/${environment}.yaml`,
        '--dev',
      ];

      if (options.secrets) {
        werfCommand.push(`--secret-values .helm/secrets/${environment}.yaml`);
      }

      if (options.values) {
        const extra_vars = options.values.trim();
        werfCommand.push(`--set ${extra_vars}`);
      }

      console.log('Werf command:');
      console.log(werfCommand);

      const renderedManifests = execSync(werfCommand.join(' ').trim(), {
        encoding: 'utf-8',
      });

      console.log('Obtaining env vars from rendered manifests...');
      const manifests = yaml.loadAll(renderedManifests) as yamlDoc[];

      const envData = mergeDataFromManifests(manifests);

      for (const path of options.toPath) {
        generateEnvFile(envData, path);
      }
    });

  return command;
};

export default werfCommand();
