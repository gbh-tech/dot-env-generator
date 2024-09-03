import fs from 'node:fs';
import type { EnvVarObject, yamlDoc } from './interfaces';

export function mergeDataFromManifests(manifests: yamlDoc[]) {
  const envData = {};

  for (const manifest of manifests) {
    if (manifest.data) {
      Object.assign(envData, manifest.data);
    }

    if (manifest.stringData) {
      Object.assign(envData, manifest.stringData);
    }
  }

  return envData;
}

export function generateEnvFile(envObject: EnvVarObject, filePath: string) {
  const envContent = Object.entries(envObject)
    .map(([key, value]) => `${key}='${value}'`)
    .join('\n');

  fs.appendFileSync(filePath, envContent + '\n', 'utf8');
  console.log(`dotenv file generated in ${filePath}!`);
}
