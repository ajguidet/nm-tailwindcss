const Color = require('color')
const plugin = require('tailwindcss/plugin')

const INVALID_KEYWORDS = [
  'currentcolor',
  'transparent',
  'unset',
  'initial',
  'inherit',
]

const fromPairs = (pairs = []) => pairs.reduce((acc, [key, value]) => (acc[key] = value, acc), {})

const flattenColorPalette = (colors = COLORS) => {
  const result = {}

  for (const [color, values] of Object.entries(colors)) {
    if (typeof values !== 'object') {
      result[color] = values
      continue
    }

    for (const [size, hexColor] of Object.entries(values)) {
      const suffix = size === 'default' ? '' : `-${size}`
      result[`${color}${suffix}`] = hexColor
    }
  }

  return result
}

const generateShades = (color) => {
  try {
    return {
      baseColor: Color(color).hex(),
      shadowColor: Color(color).isDark()
        ? Color(color).darken(0.3).hex()
        : Color(color).darken(0.25).hex(),
      highlightColor: Color(color).isLight()
        ? Color(color).lighten(0.2).hex()
        : Color(color).lighten(0.25).hex(),
      shadowGradient: Color(color).isDark()
        ? Color(color).darken(0.2).hex()
        : Color(color).darken(0.15).hex(),
      highlightGradient: Color(color).isLight()
        ? Color(color).lighten(0.1).hex()
        : Color(color).lighten(0.05).hex(),
    }
  } catch {
    return false
  }
}

const generatePairs = (nmKey, colors, nmSize, nmBackground, nmBoxShadow) => {
  const result = []
  
  for (const [color, hexColor] of Object.entries(colors)) {
    if (INVALID_KEYWORDS.includes(color.toLowerCase())) continue

    const shades = generateShades(hexColor)

    for (const [sizeKey, size] of Object.entries(nmSize)) {
      result.push([
        sizeKey.toLowerCase() === 'default'
        ? `.${(`nm-${nmKey}-${color}`)}`
        : `.${(`nm-${nmKey}-${color}-${sizeKey}`)}`,
        {
          background: nmKey in nmBackground && nmBackground[nmKey](shades),
          boxShadow: nmKey in nmBoxShadow && nmBoxShadow[nmKey](shades, size)
        }
      ])
    }
  }
  return result
}


module.exports = plugin(
  function ({ addUtilities, theme, variants }) {
    const backgroundColors = theme('nmColor', theme('backgroundColor'))
    const nmSize = theme('nmSize')
    const nmBoxShadow = theme('nmBoxShadow')
    const nmBackground = theme('nmBackground')
    const flattenColors = flattenColorPalette(backgroundColors);

    ['flat', 'concave', 'inset', 'convex'].forEach(nmKey => {
      addUtilities(
        fromPairs(generatePairs(nmKey, flattenColors, nmSize, nmBackground, nmBoxShadow)),
        variants(`nm${nmKey.charAt(0).toUpperCase() + nmKey.slice(1)}`, ['responsive', 'hover', 'focus'])
      )
    })
  },
  {
    theme: {
      nmSize: {
        xs: '0.05em',
        sm: '0.1em',
        default: '0.2em',
        lg: '0.4em',
        xl: '0.8em',
      },
      nmBoxShadow: {
        flat: (shades, size) => `${size} ${size} calc(${size} * 2) ${shades.shadowColor}, calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`,
        concave: (shades, size) => `${size} ${size} calc(${size} * 2) ${shades.shadowColor}, calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`,
        convex: (shades, size) => `${size} ${size} calc(${size} * 2) ${shades.shadowColor}, calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`,
        inset: (shades, size) => `inset ${size} ${size} calc(${size} * 2) ${shades.shadowColor}, inset calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`  
      },
      nmBackground: {
        flat: shades => shades.baseColor,
        concave: shades => `linear-gradient(145deg, ${shades.shadowGradient}, ${shades.highlightGradient})`,
        convex: shades => `linear-gradient(145deg, ${shades.highlightGradient}, ${shades.shadowGradient})`,
        inset: shades => shades.baseColor,
      }
    },
  }
)