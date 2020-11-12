const Color = require('color')
const _ = require('lodash')
const plugin = require('tailwindcss/plugin')

const COLORS = {
    "transparent": "transparent",
    "current": "currentColor",
    "black": "#000",
    "white": "#fff",
    "gray": {
        "100": "#f7fafc",
        "200": "#edf2f7",
        "300": "#e2e8f0",
        "400": "#cbd5e0",
        "500": "#a0aec0",
        "600": "#718096",
        "700": "#4a5568",
        "800": "#2d3748",
        "900": "#1a202c"
    },
    "red": {
        "100": "#fff5f5",
        "200": "#fed7d7",
        "300": "#feb2b2",
        "400": "#fc8181",
        "500": "#f56565",
        "600": "#e53e3e",
        "700": "#c53030",
        "800": "#9b2c2c",
        "900": "#742a2a"
    },
    "orange": {
        "100": "#fffaf0",
        "200": "#feebc8",
        "300": "#fbd38d",
        "400": "#f6ad55",
        "500": "#ed8936",
        "600": "#dd6b20",
        "700": "#c05621",
        "800": "#9c4221",
        "900": "#7b341e"
    },
    "yellow": {
        "100": "#fffff0",
        "200": "#fefcbf",
        "300": "#faf089",
        "400": "#f6e05e",
        "500": "#ecc94b",
        "600": "#d69e2e",
        "700": "#b7791f",
        "800": "#975a16",
        "900": "#744210"
    },
    "green": {
        "100": "#f0fff4",
        "200": "#c6f6d5",
        "300": "#9ae6b4",
        "400": "#68d391",
        "500": "#48bb78",
        "600": "#38a169",
        "700": "#2f855a",
        "800": "#276749",
        "900": "#22543d"
    },
    "teal": {
        "100": "#e6fffa",
        "200": "#b2f5ea",
        "300": "#81e6d9",
        "400": "#4fd1c5",
        "500": "#38b2ac",
        "600": "#319795",
        "700": "#2c7a7b",
        "800": "#285e61",
        "900": "#234e52"
    },
    "blue": {
        "100": "#ebf8ff",
        "200": "#bee3f8",
        "300": "#90cdf4",
        "400": "#63b3ed",
        "500": "#4299e1",
        "600": "#3182ce",
        "700": "#2b6cb0",
        "800": "#2c5282",
        "900": "#2a4365"
    },
    "indigo": {
        "100": "#ebf4ff",
        "200": "#c3dafe",
        "300": "#a3bffa",
        "400": "#7f9cf5",
        "500": "#667eea",
        "600": "#5a67d8",
        "700": "#4c51bf",
        "800": "#434190",
        "900": "#3c366b"
    },
    "purple": {
        "100": "#faf5ff",
        "200": "#e9d8fd",
        "300": "#d6bcfa",
        "400": "#b794f4",
        "500": "#9f7aea",
        "600": "#805ad5",
        "700": "#6b46c1",
        "800": "#553c9a",
        "900": "#44337a"
    },
    "pink": {
        "100": "#fff5f7",
        "200": "#fed7e2",
        "300": "#fbb6ce",
        "400": "#f687b3",
        "500": "#ed64a6",
        "600": "#d53f8c",
        "700": "#b83280",
        "800": "#97266d",
        "900": "#702459"
    }
}

const invalidKeywords = [
  'currentcolor',
  'transparent',
  'unset',
  'initial',
  'inherit',
]

const neumorphismSize = {
  xs: '0.05em',
  sm: '0.1em',
  default: '0.2em',
  lg: '0.4em',
  xl: '0.8em',
}

// const flattenColorPalette = function (colors) {
//   const result = _(colors)
//     .flatMap((color, name) => {
//       if (!_.isObject(color)) {
//         return [[name, color]]
//       }

//       return _.map(color, (value, key) => {
//         const suffix = key === 'default' ? '' : `-${key}`
//         return [`${name}${suffix}`, value]
//       })
//     })
//     .fromPairs()
//     .value()

//   return result
// }

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

const generatePairs = (colors, shadeBase) => {
  const result = []
  
  for (const [color, hexColor] of Object.entries(colors)) {
    if (invalidKeywords.includes(color.toLowerCase())) continue
    
    const shades = generateShades(hexColor)
    
    for (const [sizeKey, size] of Object.entries(neumorphismSize)) {
      result.push([
        sizeKey.toLowerCase() === 'default'
        ? `.${(`nm-flat-${color}`)}`
        : `.${(`nm-flat-${color}-${sizeKey}`)}`,
        {
          background: shades[shadeBase],
          boxShadow: `${size} ${size} calc(${size} * 2) ${shades.shadowColor}, calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`,
        }
      ])
    }
  }
  return result
}

const nmFlatPairs = generatePairs(flattenColorPalette(COLORS), 'baseColor')

console.log(nmFlatPairs)
// _.forEach(
//   flattenColorPalette(theme('neumorphismColor', theme('backgroundColor'))),
//   (color, colorKey) => {
//     if (invalidKeywords.includes(color.toLowerCase())) return []
//     console.log(color, colorKey)
//     let shades = generateShades(color)
//     if (!shades) {
//       console.log(
//         `tailwind-neumorphism: Something went wrong generating shades of '${colorKey}' (${color}). Skipping.`
//       )
//       return false
//     }

//     _.forEach(theme('neumorphismSize'), (size, sizeKey) => {
//       nmFlatPairs.push([
//         sizeKey.toLowerCase() === 'default'
//           ? `.${e(`nm-flat-${colorKey}`)}`
//           : `.${e(`nm-flat-${colorKey}-${sizeKey}`)}`,
//         {
//           background: shades.baseColor,
//           boxShadow: `${size} ${size} calc(${size} * 2) ${shades.shadowColor}, calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`,
//         },
//       ])
//     })
//   }
// )

module.exports = plugin(
  function ({ addUtilities, e, theme, variants }) {
    const backgroundColors = theme('nmColor', theme('backgroundColor'))

      console.log(backgroundColors)

      console.log(flattenColorPalette(backgroundColors))
      const flatterColors = flattenColorPalette(backgroundColors)

    // const nmFlatPairs = []
    // _.forEach(
    //   flattenColorPalette(theme('neumorphismColor', theme('backgroundColor'))),
    //   (color, colorKey) => {
    //     if (invalidKeywords.includes(color.toLowerCase())) return []
    //     let shades = generateShades(color)
    //     if (!shades) {
    //       console.log(
    //         `tailwind-neumorphism: Something went wrong generating shades of '${colorKey}' (${color}). Skipping.`
    //       )
    //       return false
    //     }

    //     _.forEach(theme('neumorphismSize'), (size, sizeKey) => {
    //       nmFlatPairs.push([
    //         sizeKey.toLowerCase() === 'default'
    //           ? `.${e(`nm-flat-${colorKey}`)}`
    //           : `.${e(`nm-flat-${colorKey}-${sizeKey}`)}`,
    //         {
    //           background: shades.baseColor,
    //           boxShadow: `${size} ${size} calc(${size} * 2) ${shades.shadowColor}, calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`,
    //         },
    //       ])
    //     })
    //   }
    // )

    // addUtilities(
    //   _.fromPairs(nmFlatPairs),
    //   variants('neumorphismFlat', ['responsive', 'hover', 'focus'])
    // )

    // const nmConcavePairs = []
    // _.forEach(
    //   flattenColorPalette(theme('neumorphismColor', theme('backgroundColor'))),
    //   (color, colorKey) => {
    //     if (invalidKeywords.includes(color.toLowerCase())) return []
    //     let shades = generateShades(color)
    //     if (!shades) {
    //       console.log(
    //         `tailwind-neumorphism: Something went wrong generating shades of '${colorKey}' (${color}). Skipping.`
    //       )
    //       return false
    //     }

    //     _.forEach(theme('neumorphismSize'), (size, sizeKey) => {
    //       nmConcavePairs.push([
    //         sizeKey.toLowerCase() === 'default'
    //           ? `.${e(`nm-concave-${colorKey}`)}`
    //           : `.${e(`nm-concave-${colorKey}-${sizeKey}`)}`,
    //         {
    //           background: `linear-gradient(145deg, ${shades.shadowGradient}, ${shades.highlightGradient})`,
    //           boxShadow: `${size} ${size} calc(${size} * 2) ${shades.shadowColor}, calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`,
    //         },
    //       ])
    //     })
    //   }
    // )

    // addUtilities(
    //   _.fromPairs(nmConcavePairs),
    //   variants('neumorphismConcave', ['responsive', 'hover', 'focus'])
    // )

    // const nmConvexPairs = []
    // _.forEach(
    //   flattenColorPalette(theme('neumorphismColor', theme('backgroundColor'))),
    //   (color, colorKey) => {
    //     if (invalidKeywords.includes(color.toLowerCase())) return []
    //     let shades = generateShades(color)
    //     if (!shades) {
    //       console.log(
    //         `tailwind-neumorphism: Something went wrong generating shades of '${colorKey}' (${color}). Skipping.`
    //       )
    //       return false
    //     }

    //     _.forEach(theme('neumorphismSize'), (size, sizeKey) => {
    //       nmConvexPairs.push([
    //         sizeKey.toLowerCase() === 'default'
    //           ? `.${e(`nm-convex-${colorKey}`)}`
    //           : `.${e(`nm-convex-${colorKey}-${sizeKey}`)}`,
    //         {
    //           background: `linear-gradient(145deg, ${shades.highlightGradient}, ${shades.shadowGradient})`,
    //           boxShadow: `${size} ${size} calc(${size} * 2) ${shades.shadowColor}, calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`,
    //         },
    //       ])
    //     })
    //   }
    // )

    // addUtilities(
    //   _.fromPairs(nmConvexPairs),
    //   variants('neumorphismConvex', ['responsive', 'hover', 'focus'])
    // )

    // const nmInsetPairs = []
    // _.forEach(
    //   flattenColorPalette(theme('neumorphismColor', theme('backgroundColor'))),
    //   (color, colorKey) => {
    //     if (invalidKeywords.includes(color.toLowerCase())) return []
    //     let shades = generateShades(color)
    //     if (!shades) {
    //       console.log(
    //         `tailwind-neumorphism: Something went wrong generating shades of '${colorKey}' (${color}). Skipping.`
    //       )
    //       return false
    //     }

    //     _.forEach(theme('neumorphismSize'), (size, sizeKey) => {
    //       nmInsetPairs.push([
    //         sizeKey.toLowerCase() === 'default'
    //           ? `.${e(`nm-inset-${colorKey}`)}`
    //           : `.${e(`nm-inset-${colorKey}-${sizeKey}`)}`,
    //         {
    //           background: shades.baseColor,
    //           boxShadow: `inset ${size} ${size} calc(${size} * 2) ${shades.shadowColor}, inset calc(${size} * -1) calc(${size} * -1) calc(${size} * 2) ${shades.highlightColor}`,
    //         },
    //       ])
    //     })
    //   }
    // )

    // addUtilities(
    //   _.fromPairs(nmInsetPairs),
    //   variants('neumorphismInset', ['responsive', 'hover', 'focus'])
    // )
  },
  {
    theme: {
      neumorphismSize: {
        xs: '0.05em',
        sm: '0.1em',
        default: '0.2em',
        lg: '0.4em',
        xl: '0.8em',
      },
    },
  }
)