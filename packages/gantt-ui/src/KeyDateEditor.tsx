import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { GanttStore } from './store';
import { Icon, CURATED_ICONS } from './icon';
import { ColorSwatchPicker } from './ColorSwatchPicker';
import { KEY_DATE_PRESETS } from './constants';
import { todayString } from '@obsidian-gantt/core';

export function KeyDateEditor(props: {
  store: GanttStore;
  keyDates: { name: string; date: string; color?: string; icon?: string }[];
  editing: boolean;
  onChange: (keyDates: { name: string; date: string; color?: string; icon?: string }[]) => void;
  valueStyle: Record<string, string>;
  fieldStyle: Record<string, string>;
  labelStyle: Record<string, string>;
}) {
  const colorPickerOpen = useSignal<number | null>(null);
  const iconPickerOpen = useSignal<number | null>(null);

  const editKeyDates = useSignal(
    props.keyDates.map(kd => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon })),
  );

  // Sync internal edit signal from props when entering edit mode,
  // so that detail-fetched data is picked up.
  useEffect(() => {
    if (props.editing) {
      editKeyDates.value = props.keyDates.map(kd => ({ name: kd.name, date: kd.date, color: kd.color, icon: kd.icon }));
    }
  }, [props.editing]);

  return (
    <div style={props.fieldStyle}>
      <div style={props.labelStyle}>Key Dates</div>
      {props.editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Preset buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
            {KEY_DATE_PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => {
                  const next = [...editKeyDates.value, {
                    name: preset.name,
                    date: todayString(),
                    color: preset.color,
                    icon: preset.icon,
                  }];
                  editKeyDates.value = next;
                  props.onChange(next);
                }}
                title={preset.name}
                style={{
                  padding: '2px 6px', fontSize: '10px', borderRadius: '3px', cursor: 'pointer',
                  border: `1px solid ${preset.color}`,
                  background: 'var(--background-primary, #fff)',
                  color: preset.color,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{
                  display: 'inline-block', width: '12px', height: '12px',
                  textAlign: 'center', borderRadius: '2px',
                  background: preset.color, color: '#fff', marginRight: '3px',
                }}>
                  <Icon name={preset.icon} size={9} />
                </span>
                {preset.name}
              </button>
            ))}
          </div>
          {/* Key date rows */}
          {editKeyDates.value.map((kd, i) => (
            <div key={i} style={{ display: 'flex', gap: '3px', alignItems: 'center', width: '100%' }}>
              {/* Diamond color button — matches Gantt chart KeyDateMarker style */}
              <div style={{ position: 'relative', flexShrink: 0, width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  onClick={() => { colorPickerOpen.value = colorPickerOpen.value === i ? null : i; }}
                  title={kd.color ?? '#E5C07B'}
                  style={{
                    width: '16px', height: '16px', padding: 0, border: 'none',
                    borderRadius: '2px', cursor: 'pointer',
                    background: kd.color ?? '#E5C07B',
                    transform: 'rotate(45deg)',
                  }}
                />
                {colorPickerOpen.value === i && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, zIndex: 100,
                    background: 'var(--background-primary, #fff)',
                    border: '1px solid var(--background-modifier-border, #ccc)',
                    borderRadius: '4px', padding: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    marginTop: '2px',
                  }}>
                    <ColorSwatchPicker
                      value={kd.color ?? '#E5C07B'}
                      onChange={(c) => {
                        const next = [...editKeyDates.value];
                        next[i] = { ...next[i], color: c };
                        editKeyDates.value = next;
                        props.onChange(next);
                      }}
                    />
                  </div>
                )}
              </div>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => { iconPickerOpen.value = iconPickerOpen.value === i ? null : i; }}
                  title={kd.icon || 'Select icon'}
                  style={{
                    width: '24px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--background-modifier-border, #ccc)', borderRadius: '3px',
                    background: 'var(--background-primary, #fff)', cursor: 'pointer', padding: 0,
                  }}
                >
                  {kd.icon ? <Icon name={kd.icon} size={12} /> : <span style={{ fontSize: '8px', color: 'var(--text-muted, #999)' }}>◆</span>}
                </button>
                {iconPickerOpen.value === i && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, zIndex: 100,
                    background: 'var(--background-primary, #fff)',
                    border: '1px solid var(--background-modifier-border, #ccc)',
                    borderRadius: '4px', padding: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    minWidth: '140px',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
                      {CURATED_ICONS.map(iconName => (
                        <button
                          key={iconName}
                          onClick={() => {
                            const next = [...editKeyDates.value];
                            next[i] = { ...next[i], icon: iconName };
                            editKeyDates.value = next;
                            props.onChange(next);
                            iconPickerOpen.value = null;
                          }}
                          title={iconName}
                          style={{
                            width: '28px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: (kd.icon === iconName) ? '1px solid var(--interactive-accent, #7B61F8)' : '1px solid transparent',
                            borderRadius: '3px', background: 'transparent', cursor: 'pointer', padding: 0,
                          }}
                        >
                          <Icon name={iconName} size={14} />
                        </button>
                      ))}
                    </div>
                    {kd.icon && (
                      <button
                        onClick={() => {
                          const next = [...editKeyDates.value];
                          next[i] = { ...next[i], icon: undefined };
                          editKeyDates.value = next;
                          props.onChange(next);
                          iconPickerOpen.value = null;
                        }}
                        style={{
                          width: '100%', marginTop: '4px', padding: '2px', fontSize: '10px',
                          border: '1px solid var(--background-modifier-border, #ccc)', borderRadius: '3px',
                          background: 'var(--background-primary, #fff)', cursor: 'pointer',
                          color: 'var(--text-muted, #999)',
                        }}
                      >Clear icon</button>
                    )}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={kd.name}
                list="keydate-name-memory-list"
                onInput={(e) => {
                  const next = [...editKeyDates.value];
                  next[i] = { ...next[i], name: (e.target as HTMLInputElement).value };
                  editKeyDates.value = next;
                  props.onChange(next);
                }}
                placeholder="Name"
                style={{
                  flex: '1 1 0', minWidth: '30px', fontSize: '11px', padding: '3px 2px', borderRadius: '3px',
                  border: '1px solid var(--background-modifier-border, #ccc)',
                  background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                }}
              />
              <input
                type="date"
                value={kd.date}
                onInput={(e) => {
                  const next = [...editKeyDates.value];
                  next[i] = { ...next[i], date: (e.target as HTMLInputElement).value };
                  editKeyDates.value = next;
                  props.onChange(next);
                }}
                style={{
                  width: '120px', fontSize: '11px', padding: '3px 6px 3px 18px', borderRadius: '3px', flexShrink: 0,
                  border: '1px solid var(--background-modifier-border, #ccc)',
                  background: 'var(--background-primary, #fff)', color: 'var(--text-normal, #333)',
                }}
              />
              <button
                onClick={() => {
                  const next = editKeyDates.value.filter((_, idx) => idx !== i);
                  editKeyDates.value = next;
                  props.onChange(next);
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px',
                  color: 'var(--text-error, #e00)', padding: '0 2px', lineHeight: 1, flexShrink: 0,
                }}
                title="Remove key date"
              >x</button>
            </div>
          ))}
          <button
            onClick={() => {
              const next = [...editKeyDates.value, { name: '', date: '', color: '#E5C07B', icon: '' }];
              editKeyDates.value = next;
              props.onChange(next);
            }}
            style={{
              padding: '2px 8px', border: '1px dashed var(--background-modifier-border, #ccc)',
              borderRadius: '4px', background: 'transparent', cursor: 'pointer', fontSize: '11px',
              marginTop: '2px',
            }}
          >+ Custom Key Date</button>
        </div>
      ) : (
        <div>
          {props.keyDates.length > 0 ? (
            [...props.keyDates]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((kd, i) => (
              <div key={i} style={{ fontSize: '12px', padding: '2px 0', display: 'flex', gap: '6px', alignItems: 'center' }}>
                {/* Diamond with icon overlay — matches Gantt chart KeyDateMarker */}
                <span style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px', height: '16px',
                  flexShrink: 0,
                }}>
                  <span style={{
                    width: '12px', height: '12px',
                    borderRadius: '2px',
                    background: kd.color ?? 'var(--gantt-key-date-color, #E5C07B)',
                    transform: 'rotate(45deg)',
                  }} />
                  {kd.icon && (
                    <span style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}>
                      <Icon name={kd.icon} size={9} />
                    </span>
                  )}
                </span>
                <span style={{ color: 'var(--text-muted, #999)', minWidth: '80px' }}>{kd.date}</span>
                <span>{kd.name}</span>
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
