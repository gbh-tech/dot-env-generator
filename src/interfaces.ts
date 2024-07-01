export interface yamlDoc {
  data?: Record<string, string>;
  stringData?: Record<string, string>;
}

export type EnvironmentVariables = {
  [key: string]: string;
};
