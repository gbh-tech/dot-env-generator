import { execSync } from "node:child_process";
import fs from "node:fs";
import yaml from "js-yaml";

let finalString = "";

interface yamlDoc {
	data?: Record<string, unknown>;
	stringData?: Record<string, unknown>;
}

const environment = process.argv[2] || "stage";

const werf_render = execSync(
	`werf render --env ${environment} --values .helm/values/${environment}.yaml --secret-values .helm/secrets/${environment}.yaml --dev`,
	{ encoding: "utf-8" },
);

const docs = yaml.loadAll(werf_render) as yamlDoc[];

for (const doc of docs) {
	if (doc.data) {
		finalString += JSON.stringify(doc.data);
	}
	if (doc.stringData) {
		finalString += JSON.stringify(doc.stringData);
	}
}

const parsed = finalString
	.replaceAll(",", "\n")
	.replaceAll('":"', '"="')
	.replaceAll(/{|}|undefined|"/g, "");

fs.writeFileSync(".env", parsed);
console.log(".env generated!");
