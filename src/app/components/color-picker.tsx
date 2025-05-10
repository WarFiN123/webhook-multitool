"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Discord colors
  const discordColors = [
    "#5865F2", // Blurple
    "#57F287", // Green
    "#FEE75C", // Yellow
    "#EB459E", // Fuchsia
    "#ED4245", // Red
    "#000000", // Black
    "#FFFFFF", // White
    "#1E1F22", // Dark
    "#2B2D31", // Dark but not as dark
    "#313338", // Even less dark
    "#F2F3F5", // Light
    "#E3E5E8", // Less light
  ]

  useEffect(() => {
    setInputValue(color)
  }, [color])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        drawColorGradient()
      }, 50)
    }
  }, [isOpen])

  const drawColorGradient = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw color gradient (horizontal - hue)
    const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradientH.addColorStop(0, "#FF0000")
    gradientH.addColorStop(1 / 6, "#FFFF00")
    gradientH.addColorStop(2 / 6, "#00FF00")
    gradientH.addColorStop(3 / 6, "#00FFFF")
    gradientH.addColorStop(4 / 6, "#0000FF")
    gradientH.addColorStop(5 / 6, "#FF00FF")
    gradientH.addColorStop(1, "#FF0000")

    ctx.fillStyle = gradientH
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw white to black gradient overlay (vertical - saturation/value)
    const gradientV = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradientV.addColorStop(0, "rgba(255, 255, 255, 1)")
    gradientV.addColorStop(0.5, "rgba(255, 255, 255, 0)")
    gradientV.addColorStop(0.5, "rgba(0, 0, 0, 0)")
    gradientV.addColorStop(1, "rgba(0, 0, 0, 1)")

    ctx.fillStyle = gradientV
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.min(Math.max(0, e.clientX - rect.left), canvas.width - 1)
    const y = Math.min(Math.max(0, e.clientY - rect.top), canvas.height - 1)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(x, y, 1, 1).data
    const color = `#${[imageData[0], imageData[1], imageData[2]].map((x) => x.toString(16).padStart(2, "0")).join("")}`

    onChange(color)
    setInputValue(color)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)

    // Validate if it's a proper hex color
    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
      onChange(e.target.value)
    }
  }

  return (
    <div className="flex gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-10 h-10 p-0 border-2" style={{ backgroundColor: color }}>
            <span className="sr-only">Pick a color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div className="relative w-full h-40 rounded-md overflow-hidden border border-input">
              <canvas
                ref={canvasRef}
                width={200}
                height={200}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onClick={handleCanvasClick}
              />
            </div>

            <div className="grid grid-cols-6 gap-2">
              {discordColors.map((discordColor, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-8 h-8 p-0 rounded-md border"
                  style={{ backgroundColor: discordColor }}
                  onClick={() => {
                    onChange(discordColor)
                    setInputValue(discordColor)
                  }}
                >
                  <span className="sr-only">Select color {discordColor}</span>
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Input value={inputValue} onChange={handleInputChange} className="font-mono" maxLength={7} />
    </div>
  )
}
