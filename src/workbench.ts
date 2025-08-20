import { Palette } from './palette';
import { lighten, darken, alpha, rgbToHsl, hexToRgb } from './color';

export function buildWorkbench(p: Palette) {
  const bg = p.base.base3;
  const panel = p.base.base2;
  const selection = p.base.base1;
  const fg = p.base.base03;
  const dim = p.base.base02;

  // Detect dark vs light by background lightness
  const { l } = rgbToHsl(hexToRgb(bg));
  const isDark = l < 0.5;

  const border = isDark ? lighten(panel, 0.12) : darken(panel, 0.12);
  const hoverBg = isDark ? lighten(panel, 0.06) : lighten(panel, 0.03);
  const inactiveTabBg = isDark ? darken(panel, 0.02) : lighten(panel, 0.02);

  return {
    // Title Bar
    'titleBar.activeBackground': panel,
    'titleBar.activeForeground': fg,
    'titleBar.inactiveBackground': isDark ? darken(panel, 0.04) : lighten(panel, 0.04),
    'titleBar.inactiveForeground': dim,
    'titleBar.border': border,

    // Activity Bar
    'activityBar.background': panel,
    'activityBar.foreground': fg,
    'activityBar.border': border,
    'activityBar.activeBorder': p.accents.orange,
    'activityBarBadge.background': p.accents.orange,
    'activityBarBadge.foreground': isDark ? '#000000' : bg,

    // Side Bar
    'sideBar.background': panel,
    'sideBar.foreground': fg,
    'sideBar.border': border,
    'sideBarSectionHeader.background': panel,
    'sideBarSectionHeader.border': border,

    // Editor
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

    // Editor Groups & Tabs
    'editorGroup.border': border,
    'editorGroupHeader.tabsBackground': panel,
    'tab.activeBackground': panel,
    'tab.activeForeground': fg,
    'tab.inactiveBackground': inactiveTabBg,
    'tab.inactiveForeground': dim,
    'tab.border': panel,
    'tab.activeBorderTop': p.accents.brown,
    'tab.hoverBackground': hoverBg,

    // Breadcrumbs
    'breadcrumb.background': panel,
    'breadcrumb.foreground': dim,
    'breadcrumb.focusForeground': fg,
    'breadcrumb.activeSelectionForeground': p.accents.blue,

    // Status Bar
    'statusBar.background': p.accents.brown,
    'statusBar.foreground': isDark ? '#000000' : bg,

    // Terminal
    'terminal.background': bg,
    'terminal.foreground': fg,
    'terminalCursor.foreground': fg,

    // Lists / Trees
    'list.hoverBackground': selection,
    'list.activeSelectionBackground': selection,
    'list.activeSelectionForeground': fg,
    'list.highlightForeground': p.accents.orange,
    'list.errorForeground': p.accents.red,
    'list.warningForeground': p.accents.yellow,

    // Buttons
    'button.background': p.accents.orange,
    'button.foreground': isDark ? '#000000' : bg,
    'button.hoverBackground': isDark ? lighten(p.accents.orange, 0.06) : darken(p.accents.orange, 0.06),

    // Badges
    'badge.background': p.accents.orange,
    'badge.foreground': isDark ? '#000000' : bg,

    // Notifications / Widgets
    'notifications.background': panel,
    'notifications.foreground': fg,
    'notificationCenterHeader.background': panel,
    'widget.shadow': alpha('#000000', isDark ? 0.35 : 0.15),

    // Diff
    'diffEditor.insertedTextBackground': alpha(p.accents.green, isDark ? 0.18 : 0.20),
    'diffEditor.removedTextBackground': alpha(p.accents.red, isDark ? 0.18 : 0.20),
  } as const;
}