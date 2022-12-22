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
