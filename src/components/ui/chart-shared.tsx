"use client"

import * as React from "react"

export const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

export const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const SAFE_COLOR_PATTERNS = [
  /^#[0-9a-fA-F]{3,8}$/,
  /^(?:rgb|rgba|hsl|hsla)\(\s*[0-9.%+\-,\s]+\)$/,
  /^var\(--[A-Za-z0-9_-]+\)$/,
  /^[A-Za-z]+$/,
]

export function sanitizeCssIdentifier(value: string) {
  return value.replace(/[^A-Za-z0-9_-]/g, "")
}

export function sanitizeColor(color: string | undefined) {
  if (!color) return undefined
  const value = color.trim()
  return SAFE_COLOR_PATTERNS.some((pattern) => pattern.test(value))
    ? value
    : undefined
}

export function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}
