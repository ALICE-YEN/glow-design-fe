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
  ZOOM_TO_FIT = "zoomToFit",
  CHOOSE_IMG_BY_A4 = "chooseImgByA4",
  CHOOSE_IMG_BY_A3 = "chooseImgByA3",
  CHOOSE_IMG_BY_CUSTOMIZED = "chooseImgByCustomized",
  EXPORT_PNG = "exportPNG",
}

export enum ImgSize {
  A3 = "A3",
  A4 = "A4",
  CUSTOMIZED = "自定義",
}
