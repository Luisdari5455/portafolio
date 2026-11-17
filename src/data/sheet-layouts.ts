// Page skeletons shared by the hero 3D scene and the project thumbnails.
// Coordinates are 0..1 measured from the sheet's top-left corner: [x0, y0, x1, y1].
export interface SheetLayout { lines: number[][]; boxes: number[][]; }

export const SHEET_RATIO = 3.2 / 2.2;

export const sheetLayouts: SheetLayout[] = [
  // Landing page
  { lines: [[0, .14, 1, .14], [.08, .34, .5, .34], [.08, .44, .42, .44], [.08, .6, .36, .6]], boxes: [[.58, .28, .92, .84]] },
  // Card grid
  { lines: [[0, .14, 1, .14], [.08, .74, .6, .74], [.08, .84, .44, .84]], boxes: [[.08, .28, .34, .6], [.37, .28, .63, .6], [.66, .28, .92, .6]] },
  // App with sidebar
  { lines: [[.22, 0, .22, 1], [.06, .18, .16, .18], [.06, .3, .16, .3], [.06, .42, .16, .42]], boxes: [[.3, .14, .92, .3], [.3, .38, .92, .54], [.3, .62, .92, .78]] },
  // Article
  { lines: [[0, .14, 1, .14], [.08, .68, .8, .68], [.08, .78, .7, .78], [.08, .88, .5, .88]], boxes: [[.08, .26, .92, .56]] },
];
