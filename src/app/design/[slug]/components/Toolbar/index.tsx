"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  faArrowLeft,
  faArrowRight,
  faSave,
  faEraser,
  faHand,
  faMousePointer,
  IconDefinition,
  faArrowsLeftRight,
} from "@fortawesome/free-solid-svg-icons";
// import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { getDesign } from "@/app/design/[slug]/utils/api";
import { useAppSelector, useAppDispatch } from "@/services/redux/hooks";
import { setAction } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
import UserProfileButton from "@/app/components/UserProfileButton";
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
  const pathname = usePathname();
  const designId = pathname.split("/").pop() as string;

  const currentAction = useAppSelector((state) => state.canvas.currentAction);

  const dispatch = useAppDispatch();

  const {
    data: design,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["design", designId],
    queryFn: () => getDesign(designId),
    enabled: !!designId, // 這個查詢不會自動執行，只有當 enabled 為 true 時，查詢才會被觸發
    refetchOnWindowFocus: false, // 當瀏覽器窗口重新獲得焦點時，是否自動重新抓取（refetch）最新的數據
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const TOOLBAR_BUTTONS: {
    middle: ToolbarButton[];
    right: ToolbarButton[];
  } = {
    middle: [
      {
        id: CanvasAction.SELECT_OBJECT,
        icon: faMousePointer,
        label: "Select Object",
        handleClick: () => dispatch(setAction(CanvasAction.SELECT_OBJECT)),
        isActive: (currentAction: CanvasAction) =>
          currentAction === CanvasAction.SELECT_OBJECT,
      },
      {
        id: CanvasAction.PAN_CANVAS,
        icon: faHand,
        label: "Pan Canvas",
        handleClick: () => dispatch(setAction(CanvasAction.PAN_CANVAS)),
        isActive: (currentAction: CanvasAction) =>
          currentAction === CanvasAction.PAN_CANVAS,
      },
      {
        id: CanvasAction.UNDO,
        icon: faArrowLeft,
        label: "Undo",
        handleClick: () => dispatch(setAction(CanvasAction.UNDO)),
        isDisabled: isUndoDisabled,
      },
      {
        id: CanvasAction.REDO,
        icon: faArrowRight,
        label: "Redo",
        handleClick: () => dispatch(setAction(CanvasAction.REDO)),
        isDisabled: isRedoDisabled,
      },
      {
        id: CanvasAction.ZOOM_TO_FIT,
        icon: faArrowsLeftRight,
        label: "Zoom to Fit",
        handleClick: () => dispatch(setAction(CanvasAction.ZOOM_TO_FIT)),
      },
      {
        id: CanvasAction.SAVE,
        icon: faSave,
        label: "Save",
        handleClick: () => dispatch(setAction(CanvasAction.SAVE)),
      },
      {
        id: CanvasAction.CLEAR,
        icon: faEraser,
        label: "Clear",
        handleClick: () => dispatch(setAction(CanvasAction.CLEAR)),
      },
    ],
    right: [
      // {
      //   id: "toggleTheme",
      //   icon: faMoon,
      //   label: "Toggle Theme",
      //   handleClick: () => console.log("Toggle Theme clicked"),
      // },
    ],
  };

  return (
    <header className="fixed top-0 left-1/2 translate-x-[-50%] h-16 min-w-[800px] flex items-center justify-between bg-panel-background shadow-xl px-6 py-2 rounded-lg">
      {/* 左側標誌 */}
      <Title designTitle={design.name} />

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
      <div className="flex items-center space-x-4 pr-2">
        {TOOLBAR_BUTTONS.right.map((button) => (
          <Button
            key={button.id}
            icon={button.icon}
            label={button.label}
            isActive={false}
            handleClick={button.handleClick}
          />
        ))}
        <UserProfileButton showDetailedHeader={true} isSmallButton={true} />
      </div>
    </header>
  );
}
