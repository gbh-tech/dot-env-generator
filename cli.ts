#!/usr/bin/env bun

import { execSync } from 'node:child_process';
import { Command } from 'commander';
import yaml from 'js-yaml';
import { version } from './package.json';
import type { yamlDoc } from './src/interfaces';
import { generateEnvFile, mergeDataFromManifests } from './src/parser';

const cli = new Command();

cli
  .name('werf-env-file-generator')
  .version(version)
  .summary('Werf Env-File Generator CLI')
  .requiredOption(
    '-e, --environment <env>',
    'Target environment for which to generate the .env file',
  )
  .option(
    '-s, --secrets',
    'Whether to include secret files in the Werf command',
    true,
  )
  .option('-p, --to-path <path...>', 'Path(s) to generate the .env file to', [
    '.env',
  ])
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

cli.parse();
