import { CombBoxConfig, BoundingBox } from '../types/annotation';

export interface RenderedCharCell {
  char: string;
  x: number;
  y: number;
  width: number;
  height: number;
  groupIndex: number;
  cellIndexInGroup: number;
  isDelimiter?: boolean;
}

/**
 * Computes individual character cell placements for a comb/segmented box.
 * Handles group spacing (e.g. 3-2-4 for SSN, 2-7 for EIN), delimiters, auto-padding, and alignments.
 */
export function calculateCombCells(
  text: string,
  bounds: BoundingBox,
  config: CombBoxConfig
): RenderedCharCell[] {
  const {
    cellCount,
    cellWidth,
    cellGap = 0,
    groups,
    groupGaps = [],
    delimiter,
    autoPad = 'none',
    padChar = ' ',
  } = config;

  let cleaned = text.replace(/[\s-]/g, '');

  if (autoPad === 'left' && cleaned.length < cellCount) {
    cleaned = cleaned.padStart(cellCount, padChar);
  } else if (autoPad === 'right' && cleaned.length < cellCount) {
    cleaned = cleaned.padEnd(cellCount, padChar);
  }

  const cells: RenderedCharCell[] = [];
  let currentX = bounds.x;
  let charIdx = 0;

  if (groups && groups.length > 0) {
    let globalCellIdx = 0;

    for (let gIdx = 0; gIdx < groups.length; gIdx++) {
      const groupSize = groups[gIdx];

      for (let cIdx = 0; cIdx < groupSize && globalCellIdx < cellCount; cIdx++) {
        const char = charIdx < cleaned.length ? cleaned[charIdx] : '';
        cells.push({
          char,
          x: currentX,
          y: bounds.y,
          width: cellWidth,
          height: bounds.height,
          groupIndex: gIdx,
          cellIndexInGroup: cIdx,
        });

        currentX += cellWidth + cellGap;
        charIdx++;
        globalCellIdx++;
      }

      // Add group gap if between groups
      if (gIdx < groups.length - 1) {
        const gap = (groupGaps && groupGaps[gIdx] !== undefined) ? groupGaps[gIdx] : cellGap + 6;
        
        if (delimiter) {
          cells.push({
            char: delimiter,
            x: currentX,
            y: bounds.y,
            width: gap,
            height: bounds.height,
            groupIndex: gIdx,
            cellIndexInGroup: -1,
            isDelimiter: true,
          });
        }
        currentX += gap;
      }
    }
  } else {
    // Uniform comb spacing
    for (let i = 0; i < cellCount; i++) {
      const char = i < cleaned.length ? cleaned[i] : '';
      cells.push({
        char,
        x: currentX,
        y: bounds.y,
        width: cellWidth,
        height: bounds.height,
        groupIndex: 0,
        cellIndexInGroup: i,
      });
      currentX += cellWidth + cellGap;
    }
  }

  return cells;
}
