import { describe, expect, test } from 'bun:test';
import type { yamlDoc } from '../src/interfaces';
import { stripEnvDataFrom } from '../src/parser';

describe('stripEnvDataFrom', () => {
  test('should correctly strip env data from manifests', () => {
    const input: yamlDoc[] = [
      {
        data: {
          KE1: 'https://blackbox-api.stage.gbh.tech',
          KEY2: 'https://login.example.com/64aa16ab',
          KEY3: 'localStorage',
          KEY4: 'sadgsadfs-asdf-sdgf-gsdf-gasdfasdf',
          KEY5: 'https://app.example.com',
          KEY6: 'User.Read,User.Write',
          KEY7: 'https://app.example.com',
          KEY8: 'stage',
        },
      },
    ];

    const expectedOutput = `KE1='https://blackbox-api.stage.gbh.tech'\nKEY2='https://login.example.com/64aa16ab'\nKEY3='localStorage'\nKEY4='sadgsadfs-asdf-sdgf-gsdf-gasdfasdf'\nKEY5='https://app.example.com'\nKEY6='User.Read,User.Write'\nKEY7='https://app.example.com'\nKEY8='stage'`;

    const output = stripEnvDataFrom(input);
    expect(output).toBe(expectedOutput);
  });
});
