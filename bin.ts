import { parse } from 'encoding/csv.ts';
import { csv2json } from './mod.ts';
import { type FlagOptions, parseFlags, type ParseFlagsContext } from 'cliffy/flags/mod.ts';
import { ensureDir } from 'fs/mod.ts';

type Flags = {
  source: string;
  output: string;
  langs: string[];
  key: string;
  head: number;
};
const { flags } = parseFlags<
  Flags,
  FlagOptions,
  ParseFlagsContext
>(Deno.args, {
  flags: [{
    name: 'source',
    type: 'string',
    equalsSign: true,
  }, {
    name: 'output',
    type: 'string',
    equalsSign: true,
  }, {
    name: 'key',
    type: 'string',
    equalsSign: true,
  }, {
    name: 'head',
    type: 'integer',
    equalsSign: true,
  }, {
    name: 'langs',
    list: true,
    type: 'string',
    equalsSign: true,
  }],
});

const keyColHeader = flags.key ?? 'key';
const firstRowIndex = flags.head ?? 0;
const langs = flags.langs;
const sourceFile = flags.source;
const outputDir = flags.output;

const fileContent = await parse(await Deno.readTextFile(sourceFile));
// transform
const langTranslatesMap = await csv2json(fileContent, {
  langs,
  firstRowIndex: firstRowIndex,
  keyColHead: keyColHeader,
});

// write
await ensureDir(outputDir);
const outputTasks = langs.map((lang) => {
  const content = langTranslatesMap[lang];
  return Deno.writeTextFile(
    `${outputDir}/${lang}.json`,
    JSON.stringify(content),
  );
});
await Promise.all(outputTasks);
// finish log
console.log(
  `✅ Complete the conversion of csv to [${langs.join(',')}].json file`,
);
// check done detail
Object.entries(langTranslatesMap).forEach(([lang, content]) => {
  const texts = Object.values(content);
  const total = texts.length;
  const doneNum = texts.filter((text) => text !== '').length;
  const doneIcon = doneNum < total ? '🔸' : '🔹';
  console.log(`${doneIcon} ${lang}: ${doneNum}/${total}`);
});
