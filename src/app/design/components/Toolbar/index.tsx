"use client";

import {
  faArrowLeft,
  faArrowRight,
  faSave,
  faEraser,
  faHand,
  faMousePointer,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { faMoon, faUser } from "@fortawesome/free-regular-svg-icons";
import { useAppDispatch } from "@/hooks/redux";
import { setAction } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
import Button from "./Button";
import Title from "./Title";

interface ToolbarButtonConfig {
  icon: IconDefinition;
  label: string;
  handleClick: () => void;
}

export default function Toolbar() {
  const dispatch = useAppDispatch();

  const handleSelectObjectClick = () => {
    dispatch(setAction(CanvasAction.SELECT_OBJECT));
  };

  const handlePanCanvasClick = () => {
    dispatch(setAction(CanvasAction.PAN_CANVAS));
  };

  const handleUndoClick = () => {
    dispatch(setAction(CanvasAction.UNDO));
  };

  const handleSaveClick = () => {
    dispatch(setAction(CanvasAction.SAVE));
  };

  const handleClearClick = () => {
    dispatch(setAction(CanvasAction.CLEAR));
  };
  const TOOLBAR_BUTTONS: {
    middle: ToolbarButtonConfig[];
    right: ToolbarButtonConfig[];
  } = {
    middle: [
      {
        icon: faMousePointer,
        label: "Select Object",
        handleClick: handleSelectObjectClick,
      },
      {
        icon: faHand,
        label: "Pan Canvas",
        handleClick: handlePanCanvasClick,
      },
      {
        icon: faArrowLeft,
        label: "Undo",
        handleClick: handleUndoClick,
      },
      {
        icon: faArrowRight,
        label: "Redo",
        handleClick: () => console.log("Redo clicked"),
      },
      {
        icon: faSave,
        label: "Save",
        handleClick: handleSaveClick,
      },
      {
        icon: faEraser,
        label: "Clear",
        handleClick: handleClearClick,
      },
    ],
    right: [
      {
        icon: faMoon,
        label: "Toggle Theme",
        handleClick: () => console.log("Toggle Theme clicked"),
      },
      {
        icon: faUser,
        label: "User Profile",
        handleClick: () => console.log("User Profile clicked"),
      },
    ],
  };

  return (
    <header className="fixed top-0 left-1/2 translate-x-[-50%] h-16 min-w-[800px] flex items-center justify-between bg-panel-background shadow-xl px-6 py-2 rounded-lg">
      {/* 左側標誌 */}
      <Title
        designTitle="嚴宅"
        updateTitle={(newTitle) => console.log("修改名字", newTitle)}
      />

      {/* 中間工具按鈕 */}
      <div className="flex space-x-4">
        {TOOLBAR_BUTTONS.middle.map((button, index) => (
          <Button
            key={index}
            icon={button.icon}
            label={button.label}
            handleClick={button.handleClick}
          />
        ))}
      </div>

      {/* 右側按鈕 */}
      <div className="flex space-x-4">
        {TOOLBAR_BUTTONS.right.map((button, index) => (
          <Button
            key={index}
            icon={button.icon}
            label={button.label}
            handleClick={button.handleClick}
          />
        ))}
      </div>
    </header>
  );
}
