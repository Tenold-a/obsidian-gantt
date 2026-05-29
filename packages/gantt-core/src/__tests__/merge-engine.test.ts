import { describe, it, expect } from 'vitest';
import {
  mergeFields,
  mergeTasks,
  detectConflicts,
  applyFieldReset,
  mergeAll,
} from '../merge-engine';
import type { Task, EditsOverlay, CacheFile } from '../index';

const sampleTask: Task = {
  id: 'T-1',
  title: 'Refactor API',
  startDate: '2026-06-01',
  endDate: '2026-06-15',
  progress: 0.3,
  personId: 'zhangsan',
  projectId: 'proj-a',
};

describe('mergeFields', () => {
  it('returns all fields as upstream when no overrides exist', () => {
    const result = mergeFields(sampleTask, undefined, 'conn-1');
    expect(result.title).toEqual({ value: 'Refactor API', source: 'upstream' });
    expect(result.startDate).toEqual({ value: '2026-06-01', source: 'upstream' });
    expect(result.personId).toEqual({ value: 'zhangsan', source: 'upstream' });
  });

  it('marks overridden fields as manual', () => {
    const result = mergeFields(sampleTask, { startDate: '2026-06-10' }, 'conn-1');
    expect(result.startDate).toEqual({ value: '2026-06-10', source: 'manual' });
    expect(result.endDate).toEqual({ value: '2026-06-15', source: 'upstream' });
  });

  it('handles missing optional fields', () => {
    const minimal: Task = { id: 'T-2', title: 'Minimal' };
    const result = mergeFields(minimal, undefined, 'conn-1');
    expect(result.startDate.value).toBeNull();
    expect(result.startDate.source).toBe('upstream');
    expect(result.personId.value).toBeNull();
  });
});

describe('mergeTasks', () => {
  const tasks: Task[] = [
    { id: 'T-1', title: 'Task 1', startDate: '2026-06-01', projectId: 'p1' },
    { id: 'T-2', title: 'Task 2', startDate: '2026-06-10', projectId: 'p1' },
    { id: 'T-3', title: 'Task 3', personId: 'person-a' },
  ];

  const edits: EditsOverlay = {
    viewId: 'test-view',
    overrides: {
      'T-1': { startDate: '2026-06-05' },
      'T-4': { title: 'Deleted task' }, // upstream deleted
    },
    order: [],
    hidden: ['T-3'],
    localTasks: [
      { id: 'local-1', title: 'Local Task', startDate: '2026-06-20' },
    ],
  };

  it('merges cached tasks with overrides', () => {
    const result = mergeTasks(tasks, edits, 'conn-1');
    const t1 = result.find(t => t.id === 'T-1')!;
    expect(t1.startDate).toEqual({ value: '2026-06-05', source: 'manual' });
    const t2 = result.find(t => t.id === 'T-2')!;
    expect(t2.startDate).toEqual({ value: '2026-06-10', source: 'upstream' });
  });

  it('filters hidden tasks', () => {
    const result = mergeTasks(tasks, edits, 'conn-1');
    expect(result.find(t => t.id === 'T-3')).toBeUndefined();
  });

  it('preserves upstream-deleted tasks with manual overrides', () => {
    const result = mergeTasks(tasks, edits, 'conn-1');
    const t4 = result.find(t => t.id === 'T-4')!;
    expect(t4.upstreamDeleted).toBe(true);
    expect(t4.title).toEqual({ value: 'Deleted task', source: 'manual' });
  });

  it('includes local tasks', () => {
    const result = mergeTasks(tasks, edits, 'conn-1');
    const local = result.find(t => t.id === 'local-1')!;
    expect(local.startDate.source).toBe('manual');
    expect(local.connectorId).toBeNull();
  });
});

describe('detectConflicts', () => {
  it('detects when upstream changes a manually-edited field', () => {
    const tasks: Task[] = [
      { id: 'T-1', title: 'Task', startDate: '2026-07-01' },
    ];
    const edits: EditsOverlay = {
      viewId: 'v1',
      overrides: { 'T-1': { startDate: '2026-06-01' } },
      order: [],
      hidden: [],
      localTasks: [],
    };
    const conflicts = detectConflicts(tasks, edits);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({
      taskId: 'T-1',
      field: 'startDate',
      upstreamValue: '2026-07-01',
      manualValue: '2026-06-01',
    });
  });

  it('returns empty when no manual overrides exist', () => {
    const tasks: Task[] = [{ id: 'T-1', title: 'Task' }];
    const edits: EditsOverlay = {
      viewId: 'v1', overrides: {}, order: [], hidden: [], localTasks: [],
    };
    expect(detectConflicts(tasks, edits)).toHaveLength(0);
  });

  it('returns empty when upstream matches manual value', () => {
    const tasks: Task[] = [
      { id: 'T-1', title: 'Task', startDate: '2026-06-01' },
    ];
    const edits: EditsOverlay = {
      viewId: 'v1',
      overrides: { 'T-1': { startDate: '2026-06-01' } },
      order: [],
      hidden: [],
      localTasks: [],
    };
    expect(detectConflicts(tasks, edits)).toHaveLength(0);
  });
});

describe('applyFieldReset', () => {
  it('removes a field override', () => {
    const edits: EditsOverlay = {
      viewId: 'v1',
      overrides: { 'T-1': { startDate: '2026-06-01', endDate: '2026-06-10' } },
      order: [],
      hidden: [],
      localTasks: [],
    };
    const updated = applyFieldReset(edits, 'T-1', 'startDate')!;
    expect(updated.overrides['T-1']).toEqual({ endDate: '2026-06-10' });
  });

  it('removes task override entry when last field is reset', () => {
    const edits: EditsOverlay = {
      viewId: 'v1',
      overrides: { 'T-1': { startDate: '2026-06-01' } },
      order: [],
      hidden: [],
      localTasks: [],
    };
    const updated = applyFieldReset(edits, 'T-1', 'startDate')!;
    expect(updated.overrides['T-1']).toBeUndefined();
  });

  it('returns null when no override exists', () => {
    const edits: EditsOverlay = {
      viewId: 'v1',
      overrides: {},
      order: [],
      hidden: [],
      localTasks: [],
    };
    expect(applyFieldReset(edits, 'T-1', 'startDate')).toBeNull();
  });
});

describe('mergeAll', () => {
  it('merges multiple caches into one task list', () => {
    const cache1: CacheFile = {
      connectorId: 'c1',
      lastFetch: '2026-01-01T00:00:00Z',
      lastError: null,
      tasks: [{ id: 'T-1', title: 'From c1' }],
      persons: [],
      projects: [],
    };
    const cache2: CacheFile = {
      connectorId: 'c2',
      lastFetch: '2026-01-01T00:00:00Z',
      lastError: null,
      tasks: [{ id: 'T-2', title: 'From c2' }],
      persons: [],
      projects: [],
    };
    const edits: EditsOverlay = {
      viewId: 'v1', overrides: {}, order: [], hidden: [], localTasks: [],
    };
    const result = mergeAll([cache1, cache2], edits);
    expect(result).toHaveLength(2);
    expect(result[0].connectorId).toBe('c1');
    expect(result[1].connectorId).toBe('c2');
  });
});
