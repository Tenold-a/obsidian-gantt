import type { GanttStore } from './store';

// ============================================================
// Shared constants
// ============================================================

export const DAY_WIDTH = 30;
export const ROW_HEIGHT = 40;
export const LANE_OFFSET = 12;
export const LEFT_PANEL_WIDTH = 180;
export const RIGHT_PANEL_WIDTH = 220;
export const GRID_BUFFER_PX = 600;

export const DEFAULT_COLORS = ['#4A90D9', '#7B61F8', '#E06C75', '#61AFEF', '#98C379', '#E5C07B', '#C678DD', '#56B6C2'];

export function getDefaultColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i);
  return DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length];
}

export const STATUS_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: '#888' },
  { value: 'in-progress', label: 'In Progress', color: '#2196f3' },
  { value: 'cancelled', label: 'Cancelled', color: '#e53935' },
  { value: 'pending-online', label: 'Pending Online', color: '#fb8c00' },
  { value: 'online', label: 'Online', color: '#00897b' },
  { value: 'completed', label: 'Completed', color: '#4caf50' },
];

// 7 hues × 4 lightness levels: red, orange, yellow, green, cyan, blue, purple
export const PRESET_COLORS = [
  ['#C0392B', '#D35400', '#D4AC0D', '#1E8449', '#148F77', '#2471A3', '#7D3C98'],
  ['#E74C3C', '#E67E22', '#F1C40F', '#2ECC71', '#1ABC9C', '#3498DB', '#9B59B6'],
  ['#F1948A', '#F0B27A', '#F7DC6F', '#82E0AA', '#76D7C4', '#85C1E9', '#C39BD3'],
  ['#FADBD8', '#FDEBD0', '#FEF9E7', '#D5F5E3', '#D1F2EB', '#D6EAF8', '#E8DAEF'],
];

export const KEY_DATE_PRESETS = [
  { name: '验收时间', color: '#98C379', icon: 'check' },
  { name: '上线时间', color: '#61AFEF', icon: 'triangle' },
  { name: '提测时间', color: '#C678DD', icon: 'diamond' },
  { name: '评审时间', color: '#E5C07B', icon: 'target' },
  { name: '交付时间', color: '#56B6C2', icon: 'circle' },
  { name: '启动时间', color: '#4A90D9', icon: 'play' },
];

/** Collapse 3+ consecutive newlines down to 2 (one blank line). */
export function collapseNewlines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n');
}

/** Generate a stable HSL color from a string for position tags. */
export function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 35%)`;
}
