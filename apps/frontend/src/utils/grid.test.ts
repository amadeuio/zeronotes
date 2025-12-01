import { describe, expect, it } from 'vitest';
import {
  getGridColumnsFromWidth,
  getNoteIdFromPosition,
  getPositionFromNoteId,
  getSectionHeight,
  getTotalWidth,
} from './grid';

describe('getTotalWidth', () => {
  it('should calculate width for single column', () => {
    expect(getTotalWidth(1)).toBe(238);
  });

  it('should calculate width for multiple columns', () => {
    expect(getTotalWidth(2)).toBe(492);
    expect(getTotalWidth(3)).toBe(746);
    expect(getTotalWidth(5)).toBe(1254);
  });
});

describe('getGridColumnsFromWidth', () => {
  it('should return 1 for narrow containers', () => {
    expect(getGridColumnsFromWidth(100)).toBe(1);
    expect(getGridColumnsFromWidth(200)).toBe(1);
  });

  it('should calculate columns correctly for wider containers', () => {
    expect(getGridColumnsFromWidth(500)).toBe(2);
    expect(getGridColumnsFromWidth(800)).toBe(3);
    expect(getGridColumnsFromWidth(1200)).toBe(4);
    expect(getGridColumnsFromWidth(1500)).toBe(5);
  });

  it('should handle edge cases at boundaries', () => {
    // Just enough for 1 column: 238 + 16 = 254
    expect(getGridColumnsFromWidth(253)).toBe(1);
    expect(getGridColumnsFromWidth(254)).toBe(1);
    expect(getGridColumnsFromWidth(255)).toBe(1);

    // Just enough for 2 columns: 2 * 238 + 16 = 492
    expect(getGridColumnsFromWidth(491)).toBe(1);
    expect(getGridColumnsFromWidth(508)).toBe(2);
  });
});

describe('getSectionHeight', () => {
  it('should calculate height for single column', () => {
    const notesOrder = ['1', '2'];
    const noteHeights = { '1': 100, '2': 150 };
    const gridColumns = 1;

    expect(getSectionHeight(notesOrder, noteHeights, gridColumns)).toBe(266);
  });

  it('should calculate height for multiple gridColumns', () => {
    const notesOrder = ['1', '2', '3', '4', '5', '6', '7'];
    const noteHeights = { '1': 100, '2': 150, '3': 200, '4': 120, '5': 180, '6': 160, '7': 140 };
    const gridColumns = 3;

    expect(getSectionHeight(notesOrder, noteHeights, gridColumns)).toBe(392);
  });
});

describe('getPositionFromNoteId', () => {
  it('should calculate position correctly', () => {
    const notesOrder = ['1', '2', '3'];
    const noteHeights = { '1': 100, '2': 150, '3': 200 };
    const gridColumns = 2;

    expect(getPositionFromNoteId('1', notesOrder, noteHeights, gridColumns)).toEqual({
      x: 0,
      y: 0,
    });
    expect(getPositionFromNoteId('2', notesOrder, noteHeights, gridColumns)).toEqual({
      x: 254,
      y: 0,
    });
    expect(getPositionFromNoteId('3', notesOrder, noteHeights, gridColumns)).toEqual({
      x: 0,
      y: 116,
    });
  });

  it('should calculate position for non-linear notes order', () => {
    const notesOrder = ['1', '3', '2'];
    const noteHeights = { '1': 100, '2': 150, '3': 200 };
    const gridColumns = 2;

    expect(getPositionFromNoteId('3', notesOrder, noteHeights, gridColumns)).toEqual({
      x: 254,
      y: 0,
    });
  });
});

describe('getNoteIdFromPosition', () => {
  it('should find note at position', () => {
    const notesOrder = ['1', '2', '3', '4'];
    const noteHeights = { '1': 100, '2': 150, '3': 200, '4': 120 };
    const gridColumns = 2;

    expect(getNoteIdFromPosition(45, 50, notesOrder, noteHeights, gridColumns)).toBe('1');
    expect(getNoteIdFromPosition(254, 50, notesOrder, noteHeights, gridColumns)).toBe('2');
    expect(getNoteIdFromPosition(45, 160, notesOrder, noteHeights, gridColumns)).toBe('3');
    expect(getNoteIdFromPosition(300, 170, notesOrder, noteHeights, gridColumns)).toBe('4');
  });

  it('should return undefined for positions that do not match any note', () => {
    const notesOrder = ['1', '2', '3'];
    const noteHeights = { '1': 120, '2': 180, '3': 150 };
    const gridColumns = 2;

    expect(getNoteIdFromPosition(260, 200, notesOrder, noteHeights, gridColumns)).toBeUndefined();
    expect(getNoteIdFromPosition(-100, 50, notesOrder, noteHeights, gridColumns)).toBeUndefined();
    expect(
      getNoteIdFromPosition(10000, 5000, notesOrder, noteHeights, gridColumns),
    ).toBeUndefined();
  });

  it('should find note at position in non-linear notes order', () => {
    const notesOrder = ['1', '3', '2', '4'];
    const noteHeights = { '1': 100, '2': 150, '3': 200, '4': 120 };
    const gridColumns = 2;

    expect(getNoteIdFromPosition(45, 50, notesOrder, noteHeights, gridColumns)).toBe('1');
    expect(getNoteIdFromPosition(254, 50, notesOrder, noteHeights, gridColumns)).toBe('3');
    expect(getNoteIdFromPosition(45, 160, notesOrder, noteHeights, gridColumns)).toBe('2');
    expect(getNoteIdFromPosition(300, 220, notesOrder, noteHeights, gridColumns)).toBe('4');
  });
});
