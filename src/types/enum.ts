export enum CanvasAction {
  NONE = "none",
  DRAW_WALL = "drawWall",
  EXIT_DRAW_WALL = "exitDrawWall",
  PLACE_DOOR = "placeDoor",
  PLACE_WINDOW = "placeWindow",
  PLACE_FLOORING = "placeFlooring",
  PLACE_FURNITURE = "placeFurniture",
  PAN_CANVAS = "panCanvas",
  SELECT_OBJECT = "selectObject",
  CLEAR = "clear",
  UNDO = "undo",
  REDO = "redo",
  SAVE = "save",
  EXPORT_PNG = "exportPNG",
}

export enum ImgSize {
  A3 = "A3",
  A4 = "A4",
  CUSTOMIZED = "自定義",
}
