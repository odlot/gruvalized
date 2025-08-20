// src/index.ts
import { GruvalizedLight, GruvalizedDark } from './palette';
import { buildWorkbench } from './workbench';
import { buildTokens } from './tokens';
import * as fs from 'fs';
import * as path from 'path';

type Variant = {
  file: string;
  type: 'light' | 'dark';
  palette: typeof GruvalizedLight; // any Palette
};

const variants: Variant[] = [
  { file: 'gruvalized-light-color-theme.json', type: 'light', palette: GruvalizedLight },
  { file: 'gruvalized-dark-color-theme.json', type: 'dark', palette: GruvalizedDark },
];

const outDir = path.resolve('themes');
fs.mkdirSync(outDir, { recursive: true });

for (const v of variants) {
  const theme = {
    name: v.palette.name,
    type: v.type,
    colors: buildWorkbench(v.palette),
    ...buildTokens(v.palette),
  };
  const outFile = path.join(outDir, v.file);
  fs.writeFileSync(outFile, JSON.stringify(theme, null, 2));
  console.log(`Wrote ${outFile}`);
}
