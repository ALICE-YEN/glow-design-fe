import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }} // 點擊背景關閉 Modal、阻止事件冒泡
    >
      <div
        className="bg-white p-6 rounded-card shadow-lg w-64 sm:w-96 cursor-default"
        onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-secondary text-2xl">
            &times;
          </button>
        </div>

        {/* Modal 內容區 */}
        <div className="mt-4">{children}</div>

        {/* 底部按鈕 */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-panel-background hover:bg-button-hover rounded-default mr-2"
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-contrast hover:bg-contrast-hover text-white rounded-default"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
