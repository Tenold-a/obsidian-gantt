import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { GanttStore } from './store';
import { Icon } from './icon';

export function KeyLinkEditor(props: {
  store: GanttStore;
  keyLinks: { name: string; url: string }[];
  editing: boolean;
  onChange: (keyLinks: { name: string; url: string }[]) => void;
  valueStyle: Record<string, string>;
  fieldStyle: Record<string, string>;
  labelStyle: Record<string, string>;
}) {
  const copiedKey = useSignal<string | null>(null);
  const editKeyLinks = useSignal(props.keyLinks.map(kl => ({ ...kl })));

  // Sync internal edit signal from props when entering edit mode,
  // so that detail-fetched data is picked up.
  useEffect(() => {
    if (props.editing) {
      editKeyLinks.value = props.keyLinks.map(kl => ({ ...kl }));
    }
  }, [props.editing]);

  async function copyToClipboard(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      copiedKey.value = url;
      setTimeout(() => { copiedKey.value = null; }, 1500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  return (
    <div style={props.fieldStyle}>
      <div style={props.labelStyle}>Key Links</div>
      {props.editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {editKeyLinks.value.map((kl, i) => (
            <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <input
                type="text"
                value={kl.name}
                list="keylink-name-memory-list"
                onInput={(e) => {
                  const next = [...editKeyLinks.value];
                  next[i] = { ...next[i], name: (e.target as HTMLInputElement).value };
                  editKeyLinks.value = next;
                  props.onChange(next);
                }}
                placeholder="Link name"
                style={{
                  width: '80px', fontSize: '11px', padding: '3px', borderRadius: '3px', flexShrink: 0,
                  border: '1px solid var(--background-modifier-border, #ccc)',
                  background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                }}
              />
              <input
                type="url"
                value={kl.url}
                onInput={(e) => {
                  const next = [...editKeyLinks.value];
                  next[i] = { ...next[i], url: (e.target as HTMLInputElement).value };
                  editKeyLinks.value = next;
                  props.onChange(next);
                }}
                placeholder="https://..."
                style={{
                  flex: 1, fontSize: '11px', padding: '3px', borderRadius: '3px',
                  border: '1px solid var(--background-modifier-border, #ccc)',
                  background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                }}
              />
              <button
                onClick={() => {
                  const next = editKeyLinks.value.filter((_, idx) => idx !== i);
                  editKeyLinks.value = next;
                  props.onChange(next);
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px',
                  color: 'var(--text-error, #e00)', padding: '0 2px', lineHeight: 1, flexShrink: 0,
                }}
                title="Remove link"
              >x</button>
            </div>
          ))}
          <button
            onClick={() => {
              const next = [...editKeyLinks.value, { name: '', url: '' }];
              editKeyLinks.value = next;
              props.onChange(next);
            }}
            style={{
              padding: '2px 8px', border: '1px dashed var(--background-modifier-border, #ccc)',
              borderRadius: '4px', background: 'transparent', cursor: 'pointer', fontSize: '11px',
              marginTop: '2px',
            }}
          >+ Add Link</button>
        </div>
      ) : (
        <div>
          {props.keyLinks.length > 0 ? (
            props.keyLinks.map((kl, i) => (
              <div key={i} style={{ fontSize: '12px', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <a
                  href={kl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    const platform = (props.store as any)._platform;
                    if (platform?.openExternal) {
                      platform.openExternal(kl.url);
                    } else {
                      window.open(kl.url, '_blank');
                    }
                  }}
                  style={{
                    color: 'var(--interactive-accent, #4A90D9)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={kl.url}
                >
                  <span style={{ fontSize: '10px', flexShrink: 0 }}>↗</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{kl.name || kl.url}</span>
                </a>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await copyToClipboard(kl.url);
                  }}
                  title="Copy link"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '0 2px',
                    color: 'var(--text-muted, #999)',
                    flexShrink: 0,
                  }}
                >{copiedKey.value === kl.url ? <Icon name="check" size={14} title="Copied!" /> : <Icon name="copy" size={14} title="Copy link" />}</button>
              </div>
            ))
          ) : (
            <div style={props.valueStyle}>—</div>
          )}
        </div>
      )}
    </div>
  );
}
