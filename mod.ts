import { ensureDir, parse } from './deps.ts';

export function csv2json<L extends string>(
  fileContent: string[][],
  { langs, firstRowIndex = 0, keyColHead = 'key' }: {
    langs: L[];
    firstRowIndex?: number;
    keyColHead?: string;
  },
) {
  const firstRow = fileContent[firstRowIndex];
  const rows = fileContent.slice(1);
  const keyIndex = firstRow.findIndex((str) => str === keyColHead);
  const keys = rows.map((row) => row[keyIndex]);
  const translates = langs.map((lang) => {
    const index = firstRow.findIndex((str) => str === lang);
    const texts = rows.map((row) => row[index]);
    const translateMap = new Map(keys.map((key, i) => [key, texts[i]]));
    const content = Object.fromEntries(translateMap);
    return [lang, content] as const;
  });
  const langMap = new Map(translates);
  return Object.fromEntries(langMap) as Record<typeof langs[number], Record<string, string>>;
}

export async function executeCSV2JSON(
  options: { key?: string; head?: number; langs: string[]; source: string; output: string },
) {
  const { key = 'key', head = 0, langs, source, output } = options;

  const fileContent = await parse(await Deno.readTextFile(source));
  // transform
  const langTranslatesMap = await csv2json(fileContent, {
    langs,
    firstRowIndex: head,
    keyColHead: key,
  });

  // write
  await ensureDir(output);
  const outputTasks = langs.map((lang) => {
    const content = langTranslatesMap[lang];
    return Deno.writeTextFile(
      `${output}/${lang}.json`,
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
}
