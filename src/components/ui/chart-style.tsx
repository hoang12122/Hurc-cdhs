"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  THEMES,
  type ChartConfig,
  sanitizeColor,
  sanitizeCssIdentifier,
} from "./chart-shared"

export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const styleRef = React.useRef<HTMLStyleElement>(null)
  const safeId = React.useMemo(() => sanitizeCssIdentifier(id), [id])

  const cssText = React.useMemo(() => {
    const colorConfig = Object.entries(config).filter(
      ([, itemConfig]) => itemConfig.theme || itemConfig.color
    )

    if (!colorConfig.length || !safeId) return ""

    return Object.entries(THEMES)
      .map(([theme, prefix]) => {
        const declarations = colorConfig
          .map(([key, itemConfig]) => {
            const rawColor =
              itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
              itemConfig.color
            const color = sanitizeColor(rawColor)
            const safeKey = sanitizeCssIdentifier(key)

            if (!color || !safeKey) return null
            return `  --color-${safeKey}: ${color};`
          })
          .filter(Boolean)
          .join("\n")

        return declarations
          ? `${prefix} [data-chart="${safeId}"] {\n${declarations}\n}`
          : ""
      })
      .filter(Boolean)
      .join("\n")
  }, [config, safeId])

  React.useEffect(() => {
    if (styleRef.current) styleRef.current.textContent = cssText
  }, [cssText])

  return cssText ? <style ref={styleRef} /> : null
}

export function IndicatorNode({
  indicator,
  indicatorColor,
  nestLabel,
}: {
  indicator: "line" | "dot" | "dashed"
  indicatorColor?: string
  nestLabel: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const color = sanitizeColor(indicatorColor)
    if (ref.current && color) {
      ref.current.style.setProperty("--color-bg", color)
      ref.current.style.setProperty("--color-border", color)
    }
  }, [indicatorColor])

  return (
    <div
      ref={ref}
      className={cn(
        "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
        {
          "h-2.5 w-2.5": indicator === "dot",
          "w-1": indicator === "line",
          "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
          "my-0.5": nestLabel && indicator === "dashed",
        }
      )}
    />
  )
}

export function LegendColorBox({ color }: { color: string | undefined }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const safeColor = sanitizeColor(color)
    if (ref.current && safeColor) ref.current.style.backgroundColor = safeColor
  }, [color])

  return <div ref={ref} className="h-2 w-2 shrink-0 rounded-[2px]" />
}
