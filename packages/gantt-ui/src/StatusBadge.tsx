import { h } from 'preact';
import { STATUS_OPTIONS } from './constants';

export function StatusBadge(props: { status: string }) {
  const opt = STATUS_OPTIONS.find(o => o.value === props.status);
  const color = opt?.color ?? '#888';
  const label = opt?.label ?? props.status;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 500,
      color: '#fff',
      background: color,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}
