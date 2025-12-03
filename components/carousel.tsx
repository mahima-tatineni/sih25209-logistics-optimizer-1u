"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CarouselProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
}

export function Carousel({ children, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % children.length)
    }, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, children.length])

  const next = () => setCurrent((prev) => (prev + 1) % children.length)
  const prev = () => setCurrent((p) => (p - 1 + children.length) % children.length)

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="min-w-full">
              {child}
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
        onClick={prev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
        onClick={next}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn("h-2 w-2 rounded-full transition-all", current === index ? "bg-accent w-6" : "bg-white/60")}
          />
        ))}
      </div>
    </div>
  )
}
