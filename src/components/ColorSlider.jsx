import { useCallback } from 'react'
import { useColorConversion } from '../utils/colorUtils'

const ColorSlider = ({ label, value, onChange }) => {
  const rgb = useColorConversion(value)

  const handleRgbChange = useCallback((channel, val) => {
    const newRgb = { ...rgb, [channel]: val }
    const hex = '#' + [newRgb.r, newRgb.g, newRgb.b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
    onChange(hex)
  }, [rgb, onChange])

  return (
    <div className="color-slider">
      <label>{label}</label>
      <div className="slider-group">
        <div className="slider-row">
          <span>R</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
          />
          <span>{rgb.r}</span>
        </div>
        <div className="slider-row">
          <span>G</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
          />
          <span>{rgb.g}</span>
        </div>
        <div className="slider-row">
          <span>B</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
          />
          <span>{rgb.b}</span>
        </div>
        <div className="color-preview" style={{ backgroundColor: value }}></div>
      </div>
    </div>
  )
}

export default ColorSlider
