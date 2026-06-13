import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

export function FilterMultiSelect(props: {
  label: string;
  options: { value: string; label: string }[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}) {
  const open = useSignal(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        open.value = false;
      }
    }
    if (open.value) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [open.value]);

  function toggle(val: string) {
    const next = new Set(props.selected);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    props.onChange(next);
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => { open.value = !open.value; }}
        title={`Filter by ${props.label}`}
        style={{
          padding: '2px 8px', fontSize: '11px', borderRadius: '3px', whiteSpace: 'nowrap',
          border: `1px solid ${props.selected.size > 0 ? 'var(--interactive-accent, #4A90D9)' : 'var(--background-modifier-border, #ccc)'}`,
          background: props.selected.size > 0 ? 'var(--interactive-accent, #4A90D9)' : 'var(--background-secondary, #f5f5f5)',
          color: props.selected.size > 0 ? '#fff' : 'var(--text-normal, #333)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px',
        }}
      >
        {props.label}{props.selected.size > 0 ? ` (${props.selected.size})` : ''}
        <span style={{ fontSize: '9px' }}>{open.value ? '▲' : '▼'}</span>
      </button>
      {open.value && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, zIndex: 100,
          background: 'var(--background-primary, #fff)', borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)', minWidth: '140px',
          maxHeight: '200px', overflowY: 'auto', marginTop: '2px',
          border: '1px solid var(--background-modifier-border, #ccc)',
        }}>
          {props.options.length === 0 ? (
            <div style={{ padding: '8px 12px', fontSize: '11px', color: 'var(--text-muted, #999)' }}>No options</div>
          ) : (
            props.options.map(opt => (
              <label key={opt.value} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap',
              }}>
                <input
                  type="checkbox"
                  checked={props.selected.has(opt.value)}
                  onChange={() => toggle(opt.value)}
                  style={{ margin: 0 }}
                />
                {opt.label}
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}
