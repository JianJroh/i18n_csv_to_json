import { type FlagOptions, parseFlags, type ParseFlagsContext } from './deps.ts';
import { executeCSV2JSON } from './mod.ts';

type Flags = {
  source: string;
  output: string;
  langs: string[];
  key?: string;
  head?: number;
};
const { flags } = parseFlags<
  Flags,
  FlagOptions,
  ParseFlagsContext
>(Deno.args, {
  flags: [{
    name: 'source',
    aliases: ['s'],
    type: 'string',
    equalsSign: true,
  }, {
    name: 'output',
    aliases: ['o'],
    type: 'string',
    equalsSign: true,
  }, {
    name: 'key',
    aliases: ['k'],
    type: 'string',
    equalsSign: true,
  }, {
    name: 'head',
    aliases: ['h'],
    type: 'integer',
    equalsSign: true,
  }, {
    name: 'langs',
    aliases: ['l'],
    list: true,
    type: 'string',
    equalsSign: true,
  }],
});

const { key, head, langs, source, output } = flags;

await executeCSV2JSON({ key, head, langs, source, output });
