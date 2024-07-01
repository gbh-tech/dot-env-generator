import type { EnvironmentVariables, yamlDoc } from './interfaces';

export function parseEnvDataToString(data: EnvironmentVariables) {
  return Object.entries(data)
    .map(([key, value]) => `${key}='${value}'`)
    .join('\n');
}

export function stripEnvDataFrom(manifests: yamlDoc[]) {
  let envData = '';

  for (const doc of manifests) {
    if (doc.data) {
      envData += parseEnvDataToString(doc.data);
    }

    if (doc.stringData) {
      envData += parseEnvDataToString(doc.stringData);
    }
  }

  return envData;
}
