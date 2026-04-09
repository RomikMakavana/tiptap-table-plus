import { Node } from "@tiptap/pm/model";
import { Editor } from "@tiptap/core";
export class TablePlusNodeView {
  node: Node;
  getPos: () => number | undefined;
  editor: Editor;
  dom: HTMLElement;
  contentDOM: HTMLElement;
  maxCellCount: number;
  cellPercentage: number[];
  columnSize: string;
  slider: HTMLElement;
  handles: HTMLElement[];
  options: any;
  constructor(
    node: Node,
    getPos: () => number | undefined,
    editor: Editor,
    options: any
  ) {
    this.node = node;
    this.columnSize = node.attrs.columnSize;
    this.getPos = getPos;
    this.editor = editor;
    this.options = options;
    this.dom = document.createElement("div");
    this.dom.style.position = "relative";

    this.maxCellCount = 0;
    this.cellPercentage = [];
    this.handles = [];
    this.slider = document.createElement("div");
    this.slider.contentEditable = "false";
    this.slider.style.width = "100%";
    this.slider.style.position = "relative";
    this.dom.appendChild(this.slider);

    this.updateNode(node);

    this.contentDOM = document.createElement("table");
    this.contentDOM.classList.add("table-plus");
    this.contentDOM.style.flex = "1"; // allow child nodes to expand if needed
    this.dom.appendChild(this.contentDOM);
  }

  addHandles() {

    const dragHandle = (handle: HTMLElement) => {
      let startX = 0;
      let handleIndex = parseInt(handle.dataset.index ?? "0");

      const onMouseMove = (e: MouseEvent) => {
        let rect = this.slider.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = x < this.options.minColumnSize ? this.options.minColumnSize : x;
        let percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);

        if (handleIndex > 0) {
          let previousPixel = (parseFloat(this.handles[handleIndex - 1].style.left) * x / percent) + this.options.minColumnSize;
          if(x < previousPixel) {
            percent = Math.min(Math.max((previousPixel / rect.width) * 100, 0), 100);
          }
          percent = Math.max(
            percent,
            parseFloat(this.handles[handleIndex - 1].style.left)
          );
        }
        if (handleIndex < this.handles.length - 1) {
          let nextPixel = (parseFloat(this.handles[handleIndex + 1].style.left) * x / percent) - this.options.minColumnSize;
          if(x > nextPixel) {
            percent = Math.min(Math.max((nextPixel / rect.width) * 100, 0), 100);
          }
          
          percent = Math.min(
            percent,
            parseFloat(this.handles[handleIndex + 1].style.left)
          );
        }

        handle.style.left = percent + "%";
        
        this.updateValues(this.getColumnSizes(this.handles), false);
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        this.updateValues(this.getColumnSizes(this.handles), true);
      };

      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        startX = e.clientX;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    };

    let lastValue = 0;
    for (let index = 0; index < this.cellPercentage.length; index++) {
      lastValue = lastValue + this.cellPercentage[index];
      if (index >= this.handles.length) {
        const handle = document.createElement("div");
        handle.className = "handle";
        handle.style.position = "absolute";
        handle.style.top = "50%";
        handle.style.width = "12px";
        handle.style.height = "12px";
        handle.style.zIndex = "auto";
        handle.style.borderRadius = "50%";
        handle.style.transform = "translate(-50%, -50%)";
        handle.style.cursor = "ew-resize";
        Object.assign(handle.style, {
          ...this.options.resizeHandleStyle,
        });
        handle.dataset.index = index.toString();
        handle.style.left = `${lastValue}%`;
        this.slider.appendChild(handle);
        this.handles.push(handle);
        dragHandle(handle);
      }
    }
  }

  removeHandles() {
    if(this.handles.length > this.cellPercentage.length) {
      const handle = this.handles[this.handles.length - 1];
      if (!handle) return;

      this.slider.removeChild(handle);

      this.handles.splice(this.handles.length - 1, 1);

      this.handles.forEach((h, i) => {
          h.dataset.index = i.toString();
      });
    }
  }

  updateHandlePositions() {
    let lastValue = 0;
    for (let index = 0; index < this.cellPercentage.length; index++) {
      lastValue = lastValue + this.cellPercentage[index];
      this.handles[index].style.left = `${lastValue}%`;
    }
  }

  updateHandles() {
    if (this.handles.length < this.cellPercentage.length) {
      this.addHandles();
    }

    if (this.handles.length > this.cellPercentage.length) {
      this.removeHandles();
    }

    this.updateHandlePositions();
  }

  updateNode(node: Node) {
    this.columnSize = node.attrs.columnSize;
    let _maxCellCount = 0;
    node.forEach((child) => {
      if (child.type.name === "tableRowGroup") {
        child.forEach((row) => {
          if (row.type.name === "tableRow") {
            if (row.childCount > _maxCellCount) {
              _maxCellCount = row.childCount;
            }
          }
        });
      } else if (child.type.name === "tableRow") {
        if (child.childCount > _maxCellCount) {
          _maxCellCount = child.childCount;
        }
      }
    });
    this.maxCellCount = _maxCellCount;

    function getColumnSizeList(columnSize: string) {
      const arr: string[] = columnSize.split(",").map((str) => str.trim());

      const numbers: number[] = arr.every(
        (item) => item !== "" && !isNaN(Number(item))
      )
        ? arr.map(Number)
        : [];
      return numbers;
    }

    this.dom.style.setProperty("--cell-count", this.maxCellCount.toString());

    this.cellPercentage = Array(this.maxCellCount).fill(
      Math.floor(100 / this.maxCellCount)
    );
    const columnSize = getColumnSizeList(this.columnSize);
    if(columnSize.length == this.maxCellCount) {
      this.cellPercentage = columnSize;
    }

    this.dom.style.setProperty(
      "--cell-percentage",
      this.cellPercentage.map((a) => `${a}%`).join(" ")
    );
    this.updateHandles();
  }

  getColumnSizes(handles: HTMLElement[]) {
    const values = handles.map(
      (h) => Math.round(parseFloat(h.style.left) * 100) / 100
    );
    let counted = 0;
    let _values = [];
    for (let i = 0; i < values.length; i++) {
      _values.push(Math.round((values[i] - counted) * 100) / 100);
      counted = values[i];
    }
    return _values;
  }

  updateValues(_values: number[], updateNode: boolean = false) {
    this.dom.style.setProperty(
      "--cell-percentage",
      _values.map((a) => `${a}%`).join(" ")
    );
    if (updateNode) {
      this.editor.commands.command(({ tr }) => {
        const pos = this.getPos();

        if (typeof pos !== "number") {
          return false;
        }

        tr.setNodeMarkup(pos, undefined, {
          ...this.node.attrs,
          columnSize: _values.map((a) => a.toString()).join(","),
        });

        return true;
      });
    }
  }

  getContentDOM() {
    return this.contentDOM;
  }

  update(node: Node) {
    if (node.type.name === this.node.type.name) {
      this.updateNode(node);
    }
    this.node = node;
    return true;
  }

  ignoreMutation() {
    return true;
  }
}
