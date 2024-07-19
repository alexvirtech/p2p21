// components/Whiteboard.jsx
import { useEffect, useRef, useState, useContext } from "preact/hooks"
import { Context } from "../utils/context"
import { useControl } from "../hooks/useControl"

const Whiteboard = () => {
    const { state } = useContext(Context)
    const canvasRef = useRef(null)
    const { isControlled, passControl } = useControl()
    const [drawing, setDrawing] = useState(false)
    const [context, setContext] = useState(null)
    const [brushColor, setBrushColor] = useState("#000")
    const [brushSize, setBrushSize] = useState(4)
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
    const [pendingLines, setPendingLines] = useState([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext("2d")
            setContext(ctx)
        }
    }, [])

    useEffect(() => {
        if (context && pendingLines.length > 0) {
            pendingLines.forEach((line) => {
                drawLine(line.x0, line.y0, line.x1, line.y1, line.color, line.size, false)
            })
            setPendingLines([])
        }
    }, [context, pendingLines])

    useEffect(() => {
        if (state.conn) {
            state.conn.on("data", (data) => {
                console.log("Data received:", data)
                if (data.type === "WHITEBOARD") {
                    const { x0, y0, x1, y1, color, size } = data.payload
                    console.log("Drawing line:", x0, y0, x1, y1, color, size)
                    if (context) {
                        drawLine(x0, y0, x1, y1, color, size, false)
                    } else {
                        setPendingLines((prev) => [...prev, { x0, y0, x1, y1, color, size }])
                    }
                } else if (data.type === "CLEAR_WHITEBOARD") {
                    clearCanvas()
                }
            })
        }
    }, [state.conn, context])

    const drawLine = (x0, y0, x1, y1, color, size, emit) => {
        if (!context) {
            console.error("Context is not set")
            return
        }

        console.log("Drawing line in drawLine:", x0, y0, x1, y1, color, size)

        context.beginPath()
        context.moveTo(x0, y0)
        context.lineTo(x1, y1)
        context.strokeStyle = color
        context.lineWidth = size
        context.stroke()
        context.closePath()

        if (!emit) return
        if (state.conn) {
            state.conn.send({
                type: "WHITEBOARD",
                payload: { x0, y0, x1, y1, color, size },
            })
        }
    }

    const handleMouseDown = (e) => {
        if (!isControlled) return
        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setDrawing(true)
        setLastPos({ x, y })
    }

    const handleMouseMove = (e) => {
        if (!drawing || !isControlled) return
        const rect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        drawLine(lastPos.x, lastPos.y, x, y, brushColor, brushSize, true)
        setLastPos({ x, y })
    }

    const handleMouseUp = () => {
        if (!isControlled) return
        setDrawing(false)
    }

    const clearCanvas = () => {
        if (context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        }
    }

    const handleClear = () => {
        clearCanvas()
        if (state.conn) {
            state.conn.send({ type: "CLEAR_WHITEBOARD" })
        }
    }

    return (
        <div>
            <div class="flex justify-start gap-2 pb-2">
                <button onClick={() => setBrushColor("#000")}>Black</button>
                <button onClick={() => setBrushColor("#f00")}>Red</button>
                <button onClick={() => setBrushColor("#0f0")}>Green</button>
                <button onClick={() => setBrushColor("#00f")}>Blue</button>
                <input type="range" min="1" max="10" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
                <button onClick={handleClear}>Clear</button>
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{ border: "1px dashed silver"}}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseOut={handleMouseUp}
            />
           {/*  {isControlled && <button onClick={passControl}>Pass Control</button>} */}
        </div>
    )
}

export default Whiteboard
