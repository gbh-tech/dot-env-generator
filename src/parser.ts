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
    let existingContent = '';
    existingContent = fs.readFileSync(filePath, 'utf8');
    
    existingContent.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        envObject[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
      }
    });
  }

  const envContent = Object.entries(envObject)
    .map(([key, value]) => `${key}='${value}'`)
    .join('\n');

  fs.writeFileSync(filePath, envContent, 'utf8');
  console.log(`dotenv file generated in ${filePath}!`);
}
