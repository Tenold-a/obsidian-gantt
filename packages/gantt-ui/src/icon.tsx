import { useRef, useEffect } from 'preact/hooks';

type SetIconFn = (el: HTMLElement, name: string) => void;

let _setIcon: SetIconFn | null = null;

/** Call once at app init to inject the platform's setIcon implementation. */
export function configureIconRenderer(fn: SetIconFn): void {
  _setIcon = fn;
}

/** Curated Lucide icon names for the KeyDate icon picker. */
export const CURATED_ICONS = [
  'check', 'triangle', 'diamond', 'target',
  'circle', 'play', 'star', 'flag',
  'clock', 'calendar', 'alert-triangle', 'zap',
  'pin', 'bookmark', 'heart', 'thumbs-up',
];

/** Returns true if the string is a known Lucide icon name (from the curated set). */
export function isLucideIcon(name: string): boolean {
  return CURATED_ICONS.includes(name);
}

export interface IconProps {
  name: string;
  size?: number;
  class?: string;
  style?: Record<string, string>;
  title?: string;
}

/** Renders a Lucide SVG icon via the platform's setIcon. Falls back to text content. */
export function Icon(props: IconProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const { name, size = 16 } = props;

  useEffect(() => {
    if (ref.current) {
      if (_setIcon) {
        _setIcon(ref.current, name);
      } else {
        // No setIcon available: show icon name as fallback text
        ref.current.textContent = name;
      }
    }
  }, [name]);

  return (
    <span
      ref={ref}
      class={props.class ?? 'gantt-icon'}
      title={props.title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        ...props.style,
      }}
    />
  );
}
