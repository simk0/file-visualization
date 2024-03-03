import React from "react";
import "./App.css";
import { Button, InputNumber } from "antd";

const BinaryArrayDisplay: React.FC<{
  binaryArray: boolean[];
  width: number;
  height: number;
}> = ({ binaryArray, width, height }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [currentSquare, setCurrentSquare] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const columns = Math.ceil(Math.sqrt(binaryArray.length));
        const rows = Math.ceil(binaryArray.length / columns);

        const squareWidth = width / columns;
        const squareHeight = height / rows;

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "#333"; // Dark grey color for background
        ctx.fillRect(0, 0, width, height); // Fill the canvas with background color

        binaryArray.slice(0, columns * rows).forEach((value, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);

          ctx.fillStyle = value ? "black" : "white";
          ctx.fillRect(
            col * squareWidth,
            row * squareHeight,
            squareWidth,
            squareHeight
          );

          if (index === currentSquare) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.strokeRect(
              col * squareWidth,
              row * squareHeight,
              squareWidth,
              squareHeight
            );
          }
        });

        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [binaryArray, width, height, currentSquare]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={(e) => {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const columns = Math.ceil(Math.sqrt(binaryArray.length));
          const row = Math.floor(
            y / (height / Math.ceil(binaryArray.length / columns))
          );
          const col = Math.floor(x / (width / columns));
          const index = row * columns + col;
          if (index >= 0 && index < binaryArray.length) {
            setCurrentSquare(index);
          } else {
            setCurrentSquare(null);
          }
        }
      }}
      onMouseOut={() => setCurrentSquare(null)}
    />
  );
};

const App: React.FC = () => {
  const [binaryArray, setBinaryArray] = React.useState<boolean[]>([]);
  const [width, setWidth] = React.useState<number>(500); // Initial width
  const [height, setHeight] = React.useState<number>(500); // Initial height
  const [fileSize, setFileSize] = React.useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryString = e.target?.result as string;
        const binaryArray = binaryString.split("").map((bit) => bit === "1");
        setBinaryArray(binaryArray);
        console.log("File loaded successfully. Supported format.");
      };
      reader.onerror = (e) => {
        console.error("Error loading file. Unsupported format.");
      };
      reader.readAsBinaryString(file);
    }
  };

  const resetValues = () => {
    setWidth(500);
    setHeight(500);
  };

  return (
    <div className="App">
      <h1>File Visualization</h1>
      <input className="file-input" type="file" onChange={handleFileChange} />
      {fileSize && <p>File size: {fileSize}</p>}
      <div className="input-fields">
        <div className="input-row">
          <label>Width:</label>
          <InputNumber
            min={1}
            max={3000}
            value={width}
            onChange={(value) =>
              setWidth(value ? parseInt(value.toString()) : 1)
            }
          />
        </div>
        <div className="input-row">
          <label>Height:</label>
          <InputNumber
            min={1}
            max={3000}
            value={height}
            onChange={(value) =>
              setHeight(value ? parseInt(value.toString()) : 1)
            }
          />
        </div>
      </div>
      <Button type="primary" onClick={resetValues}>
        Reset Sizes to Default
      </Button>
      <br />

      <BinaryArrayDisplay
        binaryArray={binaryArray}
        width={width}
        height={height}
      />
    </div>
  );
};

export default App;
