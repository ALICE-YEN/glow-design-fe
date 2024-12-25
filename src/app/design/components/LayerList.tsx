// 管理和顯示 Fabric.js 畫布上的圖層及其選擇狀態

import { useState, useEffect } from "react";
import { Canvas, Object, TEvent } from "fabric";

export default function LayerList({ canvas }: { canvas: Canvas }) {
  const [layers, setLayers] = useState<
    Array<{ id: string; zIndex: number; type: string; opacity: number }>
  >([]);
  const [selectedLayer, setSelectedLayer] = useState(null);

  const toggleLayerVisibility = () => {
    if (!selectedLayer) return;

    const object = canvas
      .getObjects()
      .find((obj) => obj.id === selectedLayer.id);
    if (!object) return;

    // 切換不透明度，並在尚未存自定義 initialOpacity 時存
    if (object.initialOpacity === undefined) {
      object.initialOpacity = object.opacity; // Store initial opacity
    }

    // 如果物件當前是可見的（不透明度大於0），將其設置為不可見（不透明度設置為0）
    // 如果物件當前是不可見的（不透明度等於0），則恢復到之前存儲的初始不透明度，使其再次可見
    object.opacity = object.opacity === 0 ? object.initialOpacity : 0;
    canvas.renderAll();

    updateLayers();

    setSelectedLayer({ ...selectedLayer, opacity: object.opacity });
  };

  //  Fabric.js 6 and React Tutorial | Moving Layers Up & Down with zIndex in Canvas - Part 8，功能沒有正常表現，暫時無法排除，先擱置
  //   const moveSelectedLayer = (direction) => {
  //     console.log("檢查 selectedLayer", selectedLayer);
  //     if (!selectedLayer) return;

  //     const objects = canvas.getObjects();
  //     // 找到當前選中的物件
  //     const object = objects.find((obj) => obj.id === selectedLayer);
  //     console.log("檢查 object", object);

  //     if (object) {
  //       const currentIndex = objects.indexOf(object);
  //       console.log("檢查 currentIndex", currentIndex);

  //       // 如果方向是向上，並且不是最後一個物件，則與上一層交換位置
  //       if (direction === "up" && currentIndex < objects.length - 1) {
  //         const temp = objects[currentIndex];
  //         objects[currentIndex] = objects[currentIndex + 1];
  //         objects[currentIndex + 1] = temp;
  //       } else if (direction === "down" && currentIndex > 0) {
  //         // 如果方向是向下，並且不是第一個物件，則與下一層交換位置
  //         const temp = objects[currentIndex];
  //         objects[currentIndex] = objects[currentIndex - 1];
  //         objects[currentIndex - 1] = temp;
  //       }

  //       const backgroundColor = canvas.backgroundColor;

  //       canvas.clear();

  //       // 重新添加更新後的物件到畫布
  //       objects.forEach((obj) => canvas.add(obj));

  //       canvas.backgroundColor = backgroundColor;

  //       canvas.renderAll();

  //       // 更新每個物件的 zIndex
  //       objects.forEach((obj, index) => {
  //         obj.zIndex = index;
  //       });

  //       // 重新設置活動對象
  //       canvas.setActiveObject(object);

  //       canvas.renderAll();

  //       updateLayers();
  //     }
  //   };

  const addIdToObject = (object: Object) => {
    if (!object.id) {
      const timestamp = new Date().getTime();
      object.id = `${object.type}_${timestamp}`;
    }
  };

  // 在 Canvas 類的原型上添加一個方法，用於更新對象的 zIndex
  Canvas.prototype.updateZIndices = function (): void {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      // 為每個對象調用 addIdToObject 函數，確保每個對象都有 ID
      addIdToObject(obj);
      // 設置每個對象的 zIndex 為其在數組中的索引
      obj.zIndex = index;
    });
  };

  // 定義一個函數，用於更新 layers 狀態
  const updateLayers = (): void => {
    if (canvas) {
      canvas.updateZIndices();
      const objects = canvas
        .getObjects()
        .filter(
          (obj: IObject) =>
            !(
              obj.id.startsWith("vertical-") ||
              obj.id.startsWith("horizontal-") ||
              obj?.data === "grid"
            )
        )
        .map((obj: IObject) => ({
          id: obj.id,
          zIndex: obj.zIndex,
          type: obj.type,
          opacity: obj.opacity,
        }));

      // 設置 layers 狀態為這個數組的逆序，因為通常我們希望最後添加的對象顯示在最前面
      setLayers([...objects].reverse());
    }
  };

  const handleObjectSelected = (e: TEvent): void => {
    const selectedObject = e.selected ? e.selected[0] : null;

    if (selectedObject) {
      setSelectedLayer({
        id: selectedObject.id,
        opacity: selectedObject.opacity,
      });
    } else {
      setSelectedLayer(null);
    }
  };

  const selectLayerInCanvas = (layerId: string): void => {
    const object = canvas
      .getObjects()
      .find((obj: Object) => obj.id === layerId);
    if (object) {
      // 在 canvas 上設置該對象為活動對象。
      canvas.setActiveObject(object);
      canvas.renderAll();

      setSelectedLayer({
        id: object.id,
        opacity: object.opacity,
      });
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", updateLayers);
      canvas.on("object:removed", updateLayers);
      canvas.on("object:modified", updateLayers);

      canvas.on("selection:created", handleObjectSelected);
      canvas.on("selection:updated", handleObjectSelected);
      canvas.on("selection:cleared", () => setSelectedLayer(null));

      updateLayers();

      return () => {
        canvas.off("object:added", updateLayers);
        canvas.off("object:removed", updateLayers);
        canvas.off("object:modified", updateLayers);

        canvas.off("selection:created", handleObjectSelected);
        canvas.off("selection:updated", handleObjectSelected);
        canvas.off("selection:cleared", () => setSelectedLayer(null));
      };
    }
  }, [canvas]);

  return (
    <>
      {/* <button
        onClick={() => moveSelectedLayer("up")}
        style={{ marginRight: "10px" }}
      >
        UP
      </button>
      <button
        onClick={() => moveSelectedLayer("down")}
        style={{ marginRight: "10px" }}
      >
        DOWN
      </button> */}
      <button onClick={toggleLayerVisibility} style={{ marginRight: "10px" }}>
        TOGGLE HIDE
      </button>
      <ul>
        {layers.map((layer) => (
          <li key={layer.id} onClick={() => selectLayerInCanvas(layer.id)}>
            {layer.type}({layer.zIndex})
          </li>
        ))}
      </ul>
    </>
  );
}
