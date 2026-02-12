import { useMemo } from 'react'

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

export const isRedDominant = (hexColor) => {
  const rgb = hexToRgb(hexColor)
  return rgb.r > rgb.g * 1.5 && rgb.r > rgb.b * 1.5
}

export const useColorConversion = (hex) => {
  return useMemo(() => hexToRgb(hex), [hex])
}
