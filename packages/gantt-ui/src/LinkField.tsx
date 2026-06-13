import { h } from 'preact';
import { useSignal } from '@preact/signals';
import type { GanttStore } from './store';
import { Icon } from './icon';

export function LinkField(props: {
  url: string;
  store: GanttStore;
  label?: string;
}) {
  const copied = useSignal(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(props.url);
      copied.value = true;
      setTimeout(() => { copied.value = false; }, 1500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = props.url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  function openLink(e: MouseEvent) {
    e.preventDefault();
    const platform = (props.store as any)._platform;
    if (platform?.openExternal) {
      platform.openExternal(props.url);
    } else {
      window.open(props.url, '_blank');
    }
  }

  return (
    <div style={{ fontSize: '12px', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <a
        href={props.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={openLink}
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
        title={props.url}
      >
        <span style={{ fontSize: '10px', flexShrink: 0 }}>↗</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{props.label || props.url}</span>
      </a>
      <button
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await copyToClipboard();
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
      >{copied.value ? <Icon name="check" size={14} title="Copied!" /> : <Icon name="copy" size={14} title="Copy link" />}</button>
    </div>
  );
}
