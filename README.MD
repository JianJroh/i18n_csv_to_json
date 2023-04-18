# i18n_csv_to_json

A script for converts i18n CSV file to JSON format with deno.

## Usage

### Options

- `--source(-s)`: the path to the CSV file you want to convert. e.g.,`--source=./example/translates.csv`
- `--output(-o):`: the directory where the JSON files will be outputted. e.g.,`--output=./example/locales`
- `--langs(-l)`: a comma-separated list of the languages in the CSV file. e.g.,`--langs=zh,ja,en`
- `--key(-k)`: The name of the column in the CSV file to be used as the keys in the output JSON files. Default is `key`.
- `--head(-h)`: The index of the first row in the CSV file to be used as the data. Default is `0`.

## Example

```bash
deno run --allow-read --allow-write bin.ts --source=./example/translates.csv --output=./example/locales --langs=zh,ja,en -k key -h 0
```
