import { Palette } from './palette';

export function buildTokens(p: Palette) {
  const tokenColors = [
    { name: 'Comments', scope: ['comment', 'punctuation.definition.comment'], settings: { fontStyle: 'italic', foreground: '#AAAAAA' } },
    { name: 'Doc Comments', scope: ['comment.documentation', 'comment.block.documentation'], settings: { foreground: p.accents.green } },
    { name: 'Invalid - Illegal', scope: 'invalid.illegal', settings: { foreground: '#660000' } },
    { name: 'Operators', scope: 'keyword.operator', settings: { foreground: '#777777' } },
    { name: 'Keywords', scope: ['keyword', 'storage'], settings: { foreground: p.accents.blue } },
    { name: 'Types', scope: ['storage.type', 'support.type'], settings: { foreground: p.accents.purple } },
    { name: 'Language Constants', scope: ['constant.language', 'support.constant', 'variable.language'], settings: { foreground: '#AB6526' } },
    { name: 'Variables', scope: ['variable', 'support.variable'], settings: { foreground: p.accents.purple } },
    { name: 'Functions', scope: ['entity.name.function', 'support.function'], settings: { fontStyle: 'bold', foreground: '#AA3731' } },
    { name: 'Strings', scope: 'string', settings: { foreground: p.accents.green } },
    { name: 'Numbers', scope: ['constant.numeric', 'constant.character', 'constant'], settings: { foreground: '#AB6526' } },
  ];

  const semanticTokenColors: Record<string, any> = {
    namespace: p.accents.purple,
    class: { bold: true, foreground: p.accents.purple },
    interface: { bold: true, foreground: p.accents.purple },
    enum: { foreground: '#AB6526' },
    typeParameter: p.accents.purple,
    parameter: p.accents.purple,
    variable: p.accents.purple,
    property: p.accents.purple,
    function: { foreground: '#AA3731', bold: true },
    method: { foreground: '#AA3731', bold: true },
    string: p.accents.green,
    number: '#AB6526',
    regexp: p.accents.blue,
    comment: '#AAAAAA',
    keyword: p.accents.blue,
    operator: '#777777',
    modifier: p.accents.blue,
    deprecated: { strikethrough: true },
  };

  return { tokenColors, semanticHighlighting: true, semanticTokenColors };
}