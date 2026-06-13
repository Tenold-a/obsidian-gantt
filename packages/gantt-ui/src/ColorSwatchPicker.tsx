import { h } from 'preact';
import { useSignal } from '@preact/signals';
import { PRESET_COLORS } from './constants';

export function ColorSwatchPicker(props: {
  value: string;
  colors?: string[][];
  onChange: (color: string) => void;
}) {
  const palette = props.colors ?? PRESET_COLORS;
  const showCustom = useSignal(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${palette[0]?.length ?? 7}, 14px)`,
        gap: '3px',
      }}>
        {palette.flat().map(c => (
          <button
            key={c}
            onClick={() => props.onChange(c)}
            title={c}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '2px',
              background: c,
              border: props.value === c
                ? '2px solid var(--text-normal, #333)'
                : '1px solid var(--background-modifier-border, #ccc)',
              cursor: 'pointer',
              padding: 0,
              outline: props.value === c ? `2px solid ${c}` : 'none',
              outlineOffset: '1px',
            }}
          />
        ))}
      </div>
      <button
        onClick={() => { showCustom.value = !showCustom.value; }}
        style={{
          padding: '2px 6px',
          border: '1px solid var(--background-modifier-border, #ccc)',
          borderRadius: '3px',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '10px',
          color: 'var(--text-muted, #999)',
          alignSelf: 'flex-start',
        }}
      >
        {showCustom.value ? 'Hide custom' : 'Custom...'}
      </button>
      {showCustom.value && (
        <input
          type="color"
          value={props.value}
          onInput={(e) => props.onChange((e.target as HTMLInputElement).value)}
          style={{ width: '100%', height: '28px', padding: 0, border: 'none', cursor: 'pointer' }}
        />
      )}
    </div>
  );
}
