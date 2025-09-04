import { Palette } from './palette';
import { lighten, darken, alpha, rgbToHsl, hexToRgb } from './color';

// Small helper to compose fragments
const mix = (...parts: Array<Record<string, string>>): Record<string, string> => Object.assign({}, ...parts);

type Ctx = {
  p: Palette;
  bg: string;
  panel: string;
  selection: string;
  fg: string;
  dim: string;
  isDark: boolean;
  border: string;
  hoverBg: string;
  inactiveTabBg: string;
};

function makeCtx(p: Palette): Ctx {
  const bg = p.base.base3;
  const panel = p.base.base2;
  const selection = p.base.base1;
  const fg = p.base.base03;
  const dim = p.base.base02;
  const { l } = rgbToHsl(hexToRgb(bg));
  const isDark = l < 0.5;
  const border = isDark ? lighten(panel, 0.12) : darken(panel, 0.12);
  const hoverBg = isDark ? lighten(panel, 0.06) : lighten(panel, 0.03);
  const inactiveTabBg = isDark ? darken(panel, 0.02) : lighten(panel, 0.02);
  return { p, bg, panel, selection, fg, dim, isDark, border, hoverBg, inactiveTabBg };
}

// ── Individual builders ─────────────────────────────────────────────────────
export function buildTitleBar(ctx: Ctx) {
  const { panel, fg, dim, border, isDark } = ctx;
  return {
    'titleBar.activeBackground': panel,
    'titleBar.activeForeground': fg,
    'titleBar.inactiveBackground': isDark ? darken(panel, 0.04) : lighten(panel, 0.04),
    'titleBar.inactiveForeground': dim,
    'titleBar.border': border,
  };
}

export function buildActivityBar(ctx: Ctx) {
  const { panel, fg, border, p, bg, isDark } = ctx;
  return {
    'activityBar.background': panel,
    'activityBar.foreground': fg,
    'activityBar.border': border,
    'activityBar.activeBorder': p.accents.orange,
    'activityBarBadge.background': p.accents.orange,
    'activityBarBadge.foreground': isDark ? '#000000' : bg,
  };
}

export function buildSideBar(ctx: Ctx) {
  const { panel, fg, border, p, isDark } = ctx;

  // Slight tone shift to separate title/header areas from the base panel
  const titleBg = isDark ? darken(panel, 0.02) : lighten(panel, 0.02);

  return {
    // Core container
    'sideBar.background': panel,
    'sideBar.foreground': fg,
    'sideBar.border': border,

    // Drag & drop feedback (transparent so content shines through)
    'sideBar.dropBackground': alpha(p.accents.blue, isDark ? 0.18 : 0.12),

    // Section headers
    'sideBarSectionHeader.background': titleBg,
    'sideBarSectionHeader.foreground': fg,
    'sideBarSectionHeader.border': border,

    // Title area (Explorer, Search, etc.)
    'sideBarTitle.background': titleBg,
    'sideBarTitle.foreground': fg,
    'sideBarTitle.border': border,

    // Border between Activity Bar and Side Bar views
    'sideBarActivityBarTop.border': border,

    // Sticky Scroll in Side Bar
    'sideBarStickyScroll.background': titleBg,
    'sideBarStickyScroll.border': border,
    'sideBarStickyScroll.shadow': alpha('#000000', isDark ? 0.35 : 0.15),
  };
}

export function buildMinimap(ctx: Ctx) {
  const { p, bg, dim, isDark } = ctx;

  const overlay = (hex: string, aDark = 0.25, aLight = 0.20) => alpha(hex, isDark ? aDark : aLight);
  const softOverlay = (hex: string, aDark = 0.18, aLight = 0.14) => alpha(hex, isDark ? aDark : aLight);

  return {
    // Core surface
    'minimap.background': bg,

    // Highlights & markers
    'minimap.findMatchHighlight': overlay(p.accents.yellow, 0.35, 0.30),
    'minimap.selectionHighlight': overlay(p.accents.blue, 0.22, 0.18),
    'minimap.selectionOccurrenceHighlight': softOverlay(p.accents.blue, 0.14, 0.12),
    'minimap.errorHighlight': overlay(p.accents.red, 0.28, 0.24),
    'minimap.warningHighlight': overlay(p.accents.yellow, 0.26, 0.22),
    'minimap.infoHighlight': overlay(p.accents.blue, 0.24, 0.20),
    'minimap.chatEditHighlight': overlay(p.accents.aqua, 0.26, 0.22),

    // Foreground opacity (rendered glyphs)
    // 75% opacity = C0 alpha; VS Code expects a color with alpha
    'minimap.foregroundOpacity': '#000000C0',

    // Slider (viewport)
    'minimapSlider.background': softOverlay(dim, 0.22, 0.18),
    'minimapSlider.hoverBackground': softOverlay(dim, 0.28, 0.24),
    'minimapSlider.activeBackground': softOverlay(dim, 0.34, 0.30),

    // Gutter (diffs)
    'minimapGutter.addedBackground': alpha(p.accents.green, 0.8),
    'minimapGutter.modifiedBackground': alpha(p.accents.blue, 0.8),
    'minimapGutter.deletedBackground': alpha(p.accents.red, 0.8),

    // Inline chat markers
    'editorMinimap.inlineChatInserted': alpha(p.accents.green, 0.75),
  };
}

export function buildEditor(ctx: Ctx) {
  const { p, bg, fg, dim, selection, panel, isDark, border } = ctx;

  // Subtle tints
  const lineHighlightBg = isDark ? darken(bg, 0.06) : lighten(bg, 0.06);
  const placeholder = alpha(dim, 0.9);

  return {
    // ── Base
    'editor.background': bg,
    'editor.foreground': fg,

    // Line numbers
    'editorLineNumber.foreground': dim,
    'editorLineNumber.activeForeground': fg,
    'editorLineNumber.dimmedForeground': alpha(dim, 0.6),

    // Cursor(s)
    'editorCursor.background': alpha(fg, 0.25),
    'editorCursor.foreground': fg,
    'editorMultiCursor.primary.foreground': p.accents.brown,
    'editorMultiCursor.primary.background': alpha(p.accents.brown, 0.25),
    'editorMultiCursor.secondary.foreground': p.accents.blue,
    'editorMultiCursor.secondary.background': alpha(p.accents.blue, 0.25),

    // Placeholder & IME composition
    'editor.placeholder.foreground': placeholder,
    'editor.compositionBorder': p.accents.blue,

    // ── Selection
    'editor.selectionBackground': alpha(selection, isDark ? 0.35 : 0.85),
    'editor.selectionForeground': isDark ? '#000000' : fg, // high-contrast text if needed
    'editor.inactiveSelectionBackground': alpha(selection, isDark ? 0.22 : 0.55),
    'editor.selectionHighlightBackground': alpha(selection, isDark ? 0.18 : 0.45),
    'editor.selectionHighlightBorder': alpha(p.accents.orange, 0.6),

    // ── Word / symbol highlight
    'editor.wordHighlightBackground': alpha(p.accents.blue, isDark ? 0.22 : 0.18),
    'editor.wordHighlightBorder': alpha(p.accents.blue, 0.7),
    'editor.wordHighlightStrongBackground': alpha(p.accents.orange, isDark ? 0.22 : 0.20),
    'editor.wordHighlightStrongBorder': alpha(p.accents.orange, 0.7),
    'editor.wordHighlightTextBackground': alpha(p.accents.yellow, isDark ? 0.18 : 0.20),
    'editor.wordHighlightTextBorder': alpha(p.accents.yellow, 0.7),

    // ── Find
    'editor.findMatchBackground': alpha(p.accents.yellow, 0.45),
    'editor.findMatchForeground': fg,
    'editor.findMatchBorder': alpha(p.accents.orange, 0.9),
    'editor.findMatchHighlightBackground': alpha(p.accents.yellow, 0.25),
    'editor.findMatchHighlightForeground': p.accents.orange,
    'editor.findMatchHighlightBorder': alpha(p.accents.orange, 0.6),
    'editor.findRangeHighlightBackground': alpha(p.accents.blue, 0.12),
    'editor.findRangeHighlightBorder': alpha(p.accents.blue, 0.5),

    // ── Search editor
    'searchEditor.findMatchBackground': alpha(p.accents.yellow, 0.25),
    'searchEditor.findMatchBorder': alpha(p.accents.orange, 0.7),
    'searchEditor.textInputBorder': border,

    // ── Hover
    'editor.hoverHighlightBackground': alpha(p.accents.blue, 0.12),

    // ── Line highlight
    'editor.lineHighlightBackground': alpha(lineHighlightBg, 0.9),
    'editor.lineHighlightBorder': alpha(border, 0.7),

    // ── Watermark
    'editorWatermark.foreground': alpha(dim, 0.7),

    // ── Unicode highlight
    'editorUnicodeHighlight.background': alpha(p.accents.purple, 0.12),
    'editorUnicodeHighlight.border': alpha(p.accents.purple, 0.7),

    // ── Links
    'editorLink.activeForeground': p.accents.blue,

    // ── Range highlight
    'editor.rangeHighlightBackground': alpha(p.accents.aqua, 0.12),
    'editor.rangeHighlightBorder': alpha(p.accents.aqua, 0.6),

    // ── Symbol navigation highlight
    'editor.symbolHighlightBackground': alpha(p.accents.purple, 0.12),
    'editor.symbolHighlightBorder': alpha(p.accents.purple, 0.6),

    // ── Whitespace & guides
    'editorWhitespace.foreground': alpha(dim, 0.5),
    'editorIndentGuide.background': alpha(dim, 0.35),
    'editorIndentGuide.background1': alpha(dim, 0.35),
    'editorIndentGuide.background2': alpha(dim, 0.32),
    'editorIndentGuide.background3': alpha(dim, 0.29),
    'editorIndentGuide.background4': alpha(dim, 0.26),
    'editorIndentGuide.background5': alpha(dim, 0.23),
    'editorIndentGuide.background6': alpha(dim, 0.20),
    'editorIndentGuide.activeBackground': alpha(p.accents.blue, 0.7),
    'editorIndentGuide.activeBackground1': alpha(p.accents.blue, 0.7),
    'editorIndentGuide.activeBackground2': alpha(p.accents.aqua, 0.7),
    'editorIndentGuide.activeBackground3': alpha(p.accents.green, 0.7),
    'editorIndentGuide.activeBackground4': alpha(p.accents.yellow, 0.7),
    'editorIndentGuide.activeBackground5': alpha(p.accents.orange, 0.7),
    'editorIndentGuide.activeBackground6': alpha(p.accents.purple, 0.7),

    // ── Inlay hints
    'editorInlayHint.background': isDark ? darken(panel, 0.06) : lighten(panel, 0.06),
    'editorInlayHint.foreground': alpha(fg, 0.75),
    'editorInlayHint.typeForeground': p.accents.aqua,
    'editorInlayHint.typeBackground': isDark ? darken(panel, 0.08) : lighten(panel, 0.08),
    'editorInlayHint.parameterForeground': p.accents.purple,
    'editorInlayHint.parameterBackground': isDark ? darken(panel, 0.08) : lighten(panel, 0.08),

    // ── Rulers & linked editing
    'editorRuler.foreground': alpha(dim, 0.45),
    'editor.linkedEditingBackground': alpha(p.accents.blue, 0.08),

    // ── CodeLens
    'editorCodeLens.foreground': alpha(dim, 0.8),

    // ── Lightbulbs
    'editorLightBulb.foreground': p.accents.yellow,
    'editorLightBulbAutoFix.foreground': p.accents.green,
    'editorLightBulbAi.foreground': p.accents.purple,

    // ── Brackets
    'editorBracketMatch.background': alpha(p.accents.blue, 0.12),
    'editorBracketMatch.border': alpha(p.accents.blue, 0.8),

    // Pair colorization
    'editorBracketHighlight.foreground1': p.accents.blue,
    'editorBracketHighlight.foreground2': p.accents.aqua,
    'editorBracketHighlight.foreground3': p.accents.green,
    'editorBracketHighlight.foreground4': p.accents.yellow,
    'editorBracketHighlight.foreground5': p.accents.orange,
    'editorBracketHighlight.foreground6': p.accents.purple,
    'editorBracketHighlight.unexpectedBracket.foreground': p.accents.red,

    // Pair guides
    'editorBracketPairGuide.activeBackground1': alpha(p.accents.blue, 0.9),
    'editorBracketPairGuide.activeBackground2': alpha(p.accents.aqua, 0.9),
    'editorBracketPairGuide.activeBackground3': alpha(p.accents.green, 0.9),
    'editorBracketPairGuide.activeBackground4': alpha(p.accents.yellow, 0.9),
    'editorBracketPairGuide.activeBackground5': alpha(p.accents.orange, 0.9),
    'editorBracketPairGuide.activeBackground6': alpha(p.accents.purple, 0.9),
    'editorBracketPairGuide.background1': alpha(p.accents.blue, 0.4),
    'editorBracketPairGuide.background2': alpha(p.accents.aqua, 0.4),
    'editorBracketPairGuide.background3': alpha(p.accents.green, 0.4),
    'editorBracketPairGuide.background4': alpha(p.accents.yellow, 0.4),
    'editorBracketPairGuide.background5': alpha(p.accents.orange, 0.4),
    'editorBracketPairGuide.background6': alpha(p.accents.purple, 0.4),

    // ── Folding
    'editor.foldBackground': alpha(p.accents.blue, 0.06),
    'editor.foldPlaceholderForeground': dim,

    // ── Overview ruler
    'editorOverviewRuler.background': alpha(panel, isDark ? 0.55 : 0.9),
    'editorOverviewRuler.border': border,
    'editorOverviewRuler.findMatchForeground': alpha(p.accents.yellow, 0.8),
    'editorOverviewRuler.rangeHighlightForeground': alpha(p.accents.aqua, 0.75),
    'editorOverviewRuler.selectionHighlightForeground': alpha(selection, 0.7),
    'editorOverviewRuler.wordHighlightForeground': alpha(p.accents.blue, 0.7),
    'editorOverviewRuler.wordHighlightStrongForeground': alpha(p.accents.orange, 0.7),
    'editorOverviewRuler.wordHighlightTextForeground': alpha(p.accents.yellow, 0.7),
    'editorOverviewRuler.modifiedForeground': alpha(p.accents.blue, 0.8),
    'editorOverviewRuler.addedForeground': alpha(p.accents.green, 0.8),
    'editorOverviewRuler.deletedForeground': alpha(p.accents.red, 0.8),
    'editorOverviewRuler.errorForeground': alpha(p.accents.red, 0.9),
    'editorOverviewRuler.warningForeground': alpha(p.accents.yellow, 0.9),
    'editorOverviewRuler.infoForeground': alpha(p.accents.blue, 0.9),
    'editorOverviewRuler.bracketMatchForeground': alpha(p.accents.blue, 0.9),
    'editorOverviewRuler.inlineChatInserted': alpha(p.accents.green, 0.75),
    'editorOverviewRuler.inlineChatRemoved': alpha(p.accents.red, 0.75),

    // ── Diagnostics
    'editorError.foreground': p.accents.red,
    'editorError.border': alpha(p.accents.red, 0.6),
    'editorError.background': alpha(p.accents.red, 0.12),

    'editorWarning.foreground': p.accents.yellow,
    'editorWarning.border': alpha(p.accents.yellow, 0.6),
    'editorWarning.background': alpha(p.accents.yellow, 0.12),

    'editorInfo.foreground': p.accents.blue,
    'editorInfo.border': alpha(p.accents.blue, 0.6),
    'editorInfo.background': alpha(p.accents.blue, 0.12),

    'editorHint.foreground': p.accents.aqua,
    'editorHint.border': alpha(p.accents.aqua, 0.6),

    'problemsErrorIcon.foreground': p.accents.red,
    'problemsWarningIcon.foreground': p.accents.yellow,
    'problemsInfoIcon.foreground': p.accents.blue,

    // ── Unused code
    'editorUnnecessaryCode.border': alpha(p.accents.purple, 0.6),
    'editorUnnecessaryCode.opacity': '#00000080', // 50% fade

    // ── Gutter
    'editorGutter.background': bg,
    'editorGutter.modifiedBackground': alpha(p.accents.blue, 0.35),
    'editorGutter.modifiedSecondaryBackground': alpha(p.accents.blue, 0.2),
    'editorGutter.addedBackground': alpha(p.accents.green, 0.35),
    'editorGutter.addedSecondaryBackground': alpha(p.accents.green, 0.2),
    'editorGutter.deletedBackground': alpha(p.accents.red, 0.35),
    'editorGutter.deletedSecondaryBackground': alpha(p.accents.red, 0.2),
    'editorGutter.commentRangeForeground': alpha(p.accents.aqua, 0.8),
    'editorGutter.commentGlyphForeground': p.accents.aqua,
    'editorGutter.commentUnresolvedGlyphForeground': p.accents.orange,
    'editorGutter.foldingControlForeground': dim,
    'editorGutter.itemGlyphForeground': p.accents.purple,
    'editorGutter.itemBackground': isDark ? darken(panel, 0.04) : lighten(panel, 0.04),

    // ── Comments widget
    'editorCommentsWidget.resolvedBorder': p.accents.green,
    'editorCommentsWidget.unresolvedBorder': p.accents.orange,
    'editorCommentsWidget.rangeBackground': alpha(p.accents.aqua, 0.12),
    'editorCommentsWidget.rangeActiveBackground': alpha(p.accents.blue, 0.12),
    'editorCommentsWidget.replyInputBackground': isDark ? darken(panel, 0.06) : lighten(panel, 0.06),

    // ── Inline edits (Copilot, etc.)
    'inlineEdit.gutterIndicator.primaryBorder': p.accents.blue,
    'inlineEdit.gutterIndicator.primaryForeground': p.accents.blue,
    'inlineEdit.gutterIndicator.primaryBackground': alpha(p.accents.blue, 0.15),

    'inlineEdit.gutterIndicator.secondaryBorder': p.accents.purple,
    'inlineEdit.gutterIndicator.secondaryForeground': p.accents.purple,
    'inlineEdit.gutterIndicator.secondaryBackground': alpha(p.accents.purple, 0.15),

    'inlineEdit.gutterIndicator.successfulBorder': p.accents.green,
    'inlineEdit.gutterIndicator.successfulForeground': p.accents.green,
    'inlineEdit.gutterIndicator.successfulBackground': alpha(p.accents.green, 0.15),

    'inlineEdit.gutterIndicator.background': alpha(panel, 0.6),

    'inlineEdit.originalBackground': alpha(p.accents.red, 0.08),
    'inlineEdit.modifiedBackground': alpha(p.accents.green, 0.08),

    'inlineEdit.originalChangedLineBackground': alpha(p.accents.red, 0.12),
    'inlineEdit.originalChangedTextBackground': alpha(p.accents.red, 0.18),

    'inlineEdit.modifiedChangedLineBackground': alpha(p.accents.green, 0.12),
    'inlineEdit.modifiedChangedTextBackground': alpha(p.accents.green, 0.18),

    'inlineEdit.originalBorder': alpha(p.accents.red, 0.7),
    'inlineEdit.modifiedBorder': alpha(p.accents.green, 0.7),

    'inlineEdit.tabWillAcceptModifiedBorder': p.accents.green,
    'inlineEdit.tabWillAcceptOriginalBorder': p.accents.red,
  };
}

export function buildEditorGroupsAndTabs(ctx: Ctx) {
  const { p, panel, fg, dim, border, hoverBg, inactiveTabBg, bg, isDark } = ctx;

  // Subtle backgrounds for states
  const emptyBg = isDark ? darken(panel, 0.03) : lighten(panel, 0.03);
  const unfocusedActiveBg = isDark ? darken(panel, 0.01) : lighten(panel, 0.01);

  return {
    // ── Editor Group container & headers
    'editorGroup.border': border,
    'editorGroup.dropBackground': alpha(p.accents.blue, isDark ? 0.18 : 0.14),
    'editorGroupHeader.noTabsBackground': panel,
    'editorGroupHeader.tabsBackground': panel,
    'editorGroupHeader.tabsBorder': border,
    'editorGroupHeader.border': border,
    'editorGroup.emptyBackground': emptyBg,
    'editorGroup.focusedEmptyBorder': p.accents.blue,

    // Drop-into prompt when dragging files over editor
    'editorGroup.dropIntoPromptForeground': fg,
    'editorGroup.dropIntoPromptBackground': alpha(panel, isDark ? 0.85 : 0.92),
    'editorGroup.dropIntoPromptBorder': border,

    // ── Tabs: backgrounds / foregrounds
    'tab.activeBackground': panel,
    'tab.unfocusedActiveBackground': unfocusedActiveBg,
    'tab.activeForeground': fg,

    // Separators & borders
    'tab.border': panel,
    'tab.dragAndDropBorder': p.accents.blue,
    'tab.lastPinnedBorder': border,

    // Active/selected borders
    'tab.activeBorder': p.accents.brown,
    'tab.selectedBorderTop': p.accents.brown,
    'tab.activeBorderTop': p.accents.brown,
    'tab.unfocusedActiveBorder': alpha(p.accents.brown, 0.6),
    'tab.unfocusedActiveBorderTop': alpha(p.accents.brown, 0.6),

    // Selected (aliasing VS Code expectations)
    'tab.selectedBackground': panel,
    'tab.selectedForeground': fg,

    // Inactive tabs
    'tab.inactiveBackground': inactiveTabBg,
    'tab.unfocusedInactiveBackground': inactiveTabBg,
    'tab.inactiveForeground': dim,
    'tab.unfocusedActiveForeground': dim,
    'tab.unfocusedInactiveForeground': dim,

    // Hover states
    'tab.hoverBackground': hoverBg,
    'tab.unfocusedHoverBackground': hoverBg,
    'tab.hoverForeground': fg,
    'tab.unfocusedHoverForeground': fg,
    'tab.hoverBorder': alpha(p.accents.blue, 0.7),
    'tab.unfocusedHoverBorder': alpha(p.accents.blue, 0.45),

    // Dirty/modified markers
    'tab.activeModifiedBorder': p.accents.orange,
    'tab.inactiveModifiedBorder': alpha(p.accents.orange, 0.65),
    'tab.unfocusedActiveModifiedBorder': alpha(p.accents.orange, 0.65),
    'tab.unfocusedInactiveModifiedBorder': alpha(p.accents.orange, 0.45),

    // Editor pane & split borders
    'editorPane.background': panel,
    'sideBySideEditor.horizontalBorder': border,
    'sideBySideEditor.verticalBorder': border,
  };
}

export function buildBreadcrumbs(ctx: Ctx) {
  const { panel, dim, fg, p } = ctx;
  return {
    'breadcrumb.background': panel,
    'breadcrumb.foreground': dim,
    'breadcrumb.focusForeground': fg,
    'breadcrumb.activeSelectionForeground': p.accents.blue,
  };
}

export function buildStatusBar(ctx: Ctx) {
  const { p, bg, isDark } = ctx;
  return {
    'statusBar.background': p.accents.brown,
    'statusBar.foreground': isDark ? '#000000' : bg,
  };
}

export function buildTerminal(ctx: Ctx) {
  const { p, bg, fg, dim, selection, panel, isDark, border } = ctx;

  // Helpers for “bright” ANSI variants and UI overlays
  const bright = (hex: string) => (isDark ? lighten(hex, 0.18) : darken(hex, 0.18));
  const faint = (hex: string) => alpha(hex, isDark ? 0.7 : 0.6);
  const overlay = (hex: string, aDark = 0.18, aLight = 0.14) => alpha(hex, isDark ? aDark : aLight);

  // Derive neutrals for black/white in both modes
  const ansiBlack = isDark ? lighten(bg, 0.20) : dim;
  const ansiBrightBlack = isDark ? lighten(bg, 0.35) : lighten(dim, 0.25);
  const ansiWhite = fg;
  const ansiBrightWhite = isDark ? '#FFFFFF' : darken(fg, 0.25);

  // Slightly distinct surface for sticky/aux areas
  const stickyBg = isDark ? darken(panel, 0.02) : lighten(panel, 0.02);
  const stickyHoverBg = isDark ? darken(panel, 0.03) : lighten(panel, 0.03);

  return {
    // Viewport
    'terminal.background': bg,
    'terminal.foreground': fg,
    'terminal.border': border,

    // ANSI 16-color palette
    'terminal.ansiBlack': ansiBlack,
    'terminal.ansiRed': p.accents.red,
    'terminal.ansiGreen': p.accents.green,
    'terminal.ansiYellow': p.accents.yellow,
    'terminal.ansiBlue': p.accents.blue,
    'terminal.ansiMagenta': p.accents.purple,
    'terminal.ansiCyan': p.accents.aqua,
    'terminal.ansiWhite': ansiWhite,

    'terminal.ansiBrightBlack': ansiBrightBlack,
    'terminal.ansiBrightRed': bright(p.accents.red),
    'terminal.ansiBrightGreen': bright(p.accents.green),
    'terminal.ansiBrightYellow': bright(p.accents.yellow),
    'terminal.ansiBrightBlue': bright(p.accents.blue),
    'terminal.ansiBrightMagenta': bright(p.accents.purple),
    'terminal.ansiBrightCyan': bright(p.accents.aqua),
    'terminal.ansiBrightWhite': ansiBrightWhite,

    // Selection
    'terminal.selectionBackground': overlay(selection, 0.35, 0.85),
    'terminal.selectionForeground': isDark ? '#000000' : fg,
    'terminal.inactiveSelectionBackground': overlay(selection, 0.18, 0.55),

    // Find
    'terminal.findMatchBackground': overlay(p.accents.yellow, 0.35, 0.30),
    'terminal.findMatchBorder': alpha(p.accents.orange, 0.8),
    'terminal.findMatchHighlightBackground': overlay(p.accents.yellow, 0.20, 0.20),
    'terminal.findMatchHighlightBorder': alpha(p.accents.orange, 0.6),

    // Hover link highlight
    'terminal.hoverHighlightBackground': overlay(p.accents.blue, 0.14, 0.12),

    // Cursor
    'terminalCursor.foreground': fg,
    'terminalCursor.background': alpha(fg, 0.25),

    // Drag & drop
    'terminal.dropBackground': overlay(p.accents.blue, 0.22, 0.18),

    // Tab border (panel terminal tabs)
    'terminal.tab.activeBorder': p.accents.brown,

    // Command decorations (left gutter bubbles)
    'terminalCommandDecoration.defaultBackground': faint(p.accents.blue),
    'terminalCommandDecoration.successBackground': faint(p.accents.green),
    'terminalCommandDecoration.errorBackground': faint(p.accents.red),

    // Overview ruler (inside terminal scrollbar)
    'terminalOverviewRuler.cursorForeground': alpha(fg, 0.9),
    'terminalOverviewRuler.findMatchForeground': alpha(p.accents.yellow, 0.85),
    'terminalOverviewRuler.border': border,

    // Sticky scroll overlay
    'terminalStickyScroll.background': stickyBg,
    'terminalStickyScroll.border': border,
    'terminalStickyScrollHover.background': stickyHoverBg,

    // Initial hint & command guide
    'terminal.initialHintForeground': alpha(dim, 0.85),
    'terminalCommandGuide.foreground': alpha(p.accents.aqua, 0.9),

    // Suggest widget symbol icon colors
    'terminalSymbolIcon.aliasForeground': p.accents.purple,
    'terminalSymbolIcon.flagForeground': p.accents.yellow,
    'terminalSymbolIcon.optionForeground': p.accents.blue,
    'terminalSymbolIcon.optionValueForeground': p.accents.orange,
    'terminalSymbolIcon.methodForeground': p.accents.green,
    'terminalSymbolIcon.argumentForeground': p.accents.aqua,
    'terminalSymbolIcon.inlineSuggestionForeground': dim,
    'terminalSymbolIcon.fileForeground': fg,
    'terminalSymbolIcon.folderForeground': p.accents.brown,
    'terminalSymbolIcon.symbolicLinkFileForeground': p.accents.aqua,
    'terminalSymbolIcon.symbolicLinkFolderForeground': p.accents.aqua,
  };
}

export function buildLists(ctx: Ctx) {
  const { p, fg, dim, selection, panel, isDark, hoverBg, border } = ctx;

  return {
    // Active selection (list has focus)
    'list.activeSelectionBackground': selection,
    'list.activeSelectionForeground': fg,
    'list.activeSelectionIconForeground': p.accents.brown,

    // DnD
    'list.dropBackground': alpha(p.accents.blue, isDark ? 0.25 : 0.20),
    'list.dropBetweenBackground': p.accents.blue,

    // Focused item (active list)
    'list.focusBackground': alpha(p.accents.blue, isDark ? 0.18 : 0.14),
    'list.focusForeground': fg,
    'list.focusHighlightForeground': p.accents.orange,
    'list.focusOutline': p.accents.blue,
    'list.focusAndSelectionOutline': darken(p.accents.blue, isDark ? 0.04 : 0.08),

    // Match highlights (search in list/tree)
    'list.highlightForeground': p.accents.orange,

    // Hover
    'list.hoverBackground': hoverBg,
    'list.hoverForeground': fg,

    // Inactive selection (list does not have focus)
    'list.inactiveSelectionBackground': alpha(selection, isDark ? 0.22 : 0.55),
    'list.inactiveSelectionForeground': fg,
    'list.inactiveSelectionIconForeground': dim,

    // Inactive focus (currently only lists)
    'list.inactiveFocusBackground': alpha(p.accents.blue, isDark ? 0.10 : 0.08),
    'list.inactiveFocusOutline': lighten(p.accents.blue, isDark ? 0.12 : 0.06),

    // Item states
    'list.invalidItemForeground': p.accents.red,
    'list.errorForeground': p.accents.red,
    'list.warningForeground': p.accents.yellow,
    'list.deemphasizedForeground': dim,

    // Type filter widget (list/tree search box)
    'listFilterWidget.background': alpha(p.accents.blue, isDark ? 0.25 : 0.15),
    'listFilterWidget.outline': p.accents.blue,
    'listFilterWidget.noMatchesOutline': p.accents.red,
    'listFilterWidget.shadow': alpha('#000000', isDark ? 0.35 : 0.15),

    // Filtered match chips
    'list.filterMatchBackground': alpha(p.accents.yellow, isDark ? 0.22 : 0.25),
    'list.filterMatchBorder': p.accents.orange,

    // Tree specifics
    'tree.indentGuidesStroke': dim,
    'tree.inactiveIndentGuidesStroke': alpha(dim, 0.6),
    'tree.tableColumnsBorder': border,
    'tree.tableOddRowsBackground': isDark ? darken(panel, 0.03) : lighten(panel, 0.03),
  };
}

export function buildButtons(ctx: Ctx) {
  const { p, bg, isDark } = ctx;
  return {
    'button.background': p.accents.orange,
    'button.foreground': isDark ? '#000000' : bg,
    'button.hoverBackground': isDark ? lighten(p.accents.orange, 0.06) : darken(p.accents.orange, 0.06),
  };
}

export function buildNotifications(ctx: Ctx) {
  const { panel, fg, isDark } = ctx;
  return {
    'notifications.background': panel,
    'notifications.foreground': fg,
    'notificationCenterHeader.background': panel,
    'widget.shadow': alpha('#000000', isDark ? 0.35 : 0.15),
  };
}

export function buildDiff(ctx: Ctx) {
  const { p, isDark } = ctx;
  return {
    'diffEditor.insertedTextBackground': alpha(p.accents.green, isDark ? 0.18 : 0.20),
    'diffEditor.removedTextBackground': alpha(p.accents.red, isDark ? 0.18 : 0.20),
  };
}

// Top-level composer
export function buildWorkbench(p: Palette) {
  const ctx = makeCtx(p);
  return mix(
    buildTitleBar(ctx),
    buildActivityBar(ctx),
    buildSideBar(ctx),
    buildMinimap(ctx),
    buildEditor(ctx),
    buildEditorGroupsAndTabs(ctx),
    buildBreadcrumbs(ctx),
    buildStatusBar(ctx),
    buildTerminal(ctx),
    buildLists(ctx),
    buildButtons(ctx),
    buildNotifications(ctx),
    buildDiff(ctx),
  );
}