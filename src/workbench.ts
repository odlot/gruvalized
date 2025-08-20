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
  const { panel, fg, border } = ctx;
  return {
    'sideBar.background': panel,
    'sideBar.foreground': fg,
    'sideBar.border': border,
    'sideBarSectionHeader.background': panel,
    'sideBarSectionHeader.border': border,
  };
}

export function buildEditor(ctx: Ctx) {
  const { bg, fg, dim, selection, p, isDark } = ctx;
  return {
    'editor.background': bg,
    'editor.foreground': fg,
    'editorCursor.foreground': fg,
    'editorLineNumber.foreground': dim,
    'editorLineNumber.activeForeground': fg,
    'editor.selectionBackground': alpha(selection, isDark ? 0.35 : 0.85),
    'editor.inactiveSelectionBackground': alpha(selection, isDark ? 0.22 : 0.55),
    'editor.selectionHighlightBackground': alpha(selection, isDark ? 0.18 : 0.45),
    'editor.wordHighlightBackground': alpha(p.accents.blue, isDark ? 0.22 : 0.18),
    'editor.wordHighlightStrongBackground': alpha(p.accents.blue, isDark ? 0.30 : 0.25),
  };
}

export function buildEditorGroupsAndTabs(ctx: Ctx) {
  const { panel, fg, dim, border, hoverBg, inactiveTabBg, p } = ctx;
  return {
    'editorGroup.border': border,
    'editorGroupHeader.tabsBackground': panel,
    'tab.activeBackground': panel,
    'tab.activeForeground': fg,
    'tab.inactiveBackground': inactiveTabBg,
    'tab.inactiveForeground': dim,
    'tab.border': panel,
    'tab.activeBorderTop': p.accents.brown,
    'tab.hoverBackground': hoverBg,
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
  const { bg, fg } = ctx;
  return {
    'terminal.background': bg,
    'terminal.foreground': fg,
    'terminalCursor.foreground': fg,
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