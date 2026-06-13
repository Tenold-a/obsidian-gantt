import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import type { GanttStore } from './store';

export function MarkdownView(props: { markdown: string; store: GanttStore }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const platform = (props.store as any)._platform;

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      if (platform?.renderMarkdown) {
        platform.renderMarkdown(ref.current, props.markdown);
      } else {
        ref.current.textContent = props.markdown;
      }
    }
  }, [props.markdown]);

  return (
    <div
      ref={ref}
      class="gantt-markdown-view"
      style={{ fontSize: '12px', lineHeight: 1.5, wordBreak: 'break-word' }}
    />
  );
}
