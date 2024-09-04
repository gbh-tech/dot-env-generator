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
  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, 'utf8').split('\n');

    for (const line of existingContent) {
      if (line.length !== 0 && !line.startsWith('#')) {
        const [key, value] = line.split(/=(.+)/s);
        if (!(Object.hasOwn(envObject, key))) {
          // Save value to object and remove quotes from value
          envObject[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
        }
      }
    }
  }

  const envContent = Object.entries(envObject)
    .map(([key, value]) => `${key}='${value}'`)
    .join('\n');

  fs.writeFileSync(filePath, envContent, 'utf8');
  console.log(`dotenv file generated in ${filePath}!`);
}
