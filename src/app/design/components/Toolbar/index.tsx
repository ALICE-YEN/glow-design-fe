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
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setAction } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
import Button from "./Button";
import Title from "./Title";

interface ToolbarProps {
  isUndoDisabled: boolean;
  isRedoDisabled: boolean;
}

interface ToolbarButton {
  id: string;
  icon: IconDefinition;
  label: string;
  handleClick: () => void;
  isActive?: (currentAction: CanvasAction) => boolean;
  isDisabled?: boolean;
}

export default function Toolbar({
  isUndoDisabled,
  isRedoDisabled,
}: ToolbarProps) {
  const currentAction = useAppSelector((state) => state.canvas.currentAction);

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

  const handleRedoClick = () => {
    dispatch(setAction(CanvasAction.REDO));
  };

  const handleSaveClick = () => {
    dispatch(setAction(CanvasAction.SAVE));
  };

  const handleClearClick = () => {
    dispatch(setAction(CanvasAction.CLEAR));
  };
  const TOOLBAR_BUTTONS: {
    middle: ToolbarButton[];
    right: ToolbarButton[];
  } = {
    middle: [
      {
        id: CanvasAction.SELECT_OBJECT,
        icon: faMousePointer,
        label: "Select Object",
        handleClick: handleSelectObjectClick,
        isActive: (currentAction: CanvasAction) =>
          currentAction === CanvasAction.SELECT_OBJECT,
      },
      {
        id: CanvasAction.PAN_CANVAS,
        icon: faHand,
        label: "Pan Canvas",
        handleClick: handlePanCanvasClick,
        isActive: (currentAction: CanvasAction) =>
          currentAction === CanvasAction.PAN_CANVAS,
      },
      {
        id: CanvasAction.UNDO,
        icon: faArrowLeft,
        label: "Undo",
        handleClick: handleUndoClick,
        isDisabled: isUndoDisabled,
      },
      {
        id: CanvasAction.REDO,
        icon: faArrowRight,
        label: "Redo",
        handleClick: handleRedoClick,
        isDisabled: isRedoDisabled,
      },
      {
        id: CanvasAction.SAVE,
        icon: faSave,
        label: "Save",
        handleClick: handleSaveClick,
      },
      {
        id: CanvasAction.CLEAR,
        icon: faEraser,
        label: "Clear",
        handleClick: handleClearClick,
      },
    ],
    right: [
      {
        id: "toggleTheme",
        icon: faMoon,
        label: "Toggle Theme",
        handleClick: () => console.log("Toggle Theme clicked"),
      },
      {
        id: "userProfile",
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
        {TOOLBAR_BUTTONS.middle.map((button) => (
          <Button
            key={button.id}
            icon={button.icon}
            label={button.label}
            isActive={button.isActive ? button.isActive(currentAction) : false}
            isDisabled={button.isDisabled ?? false}
            handleClick={button.handleClick}
          />
        ))}
      </div>

      {/* 右側按鈕 */}
      <div className="flex space-x-4">
        {TOOLBAR_BUTTONS.right.map((button) => (
          <Button
            key={button.id}
            icon={button.icon}
            label={button.label}
            isActive={false}
            handleClick={button.handleClick}
          />
        ))}
      </div>
    </header>
  );
}
