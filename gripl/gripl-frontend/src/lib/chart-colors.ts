/**
 * Chart color utilities that use CSS custom properties from the theme
 */

// Helper function to convert HSL CSS variable to hex color
const hslToHex = (hsl: string): string => {
  const [h, s, l] = hsl.split(' ').map(val => parseFloat(val.replace('%', '')));

  const lightness = l / 100;
  const saturation = s / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - chroma / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = chroma; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = chroma; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = chroma; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = chroma;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = chroma;
  } else if (300 <= h && h < 360) {
    r = chroma; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Get CSS custom property value
const getCssVariable = (variable: string): string => {
  if (typeof window === 'undefined') {
    // Server-side fallback colors
    const fallbacks: Record<string, string> = {
      '--chart-success': '142 76% 36%',
      '--chart-error': '0 84% 60%',
      '--chart-warning': '38 92% 50%',
      '--chart-info': '217 91% 60%',
      '--chart-metric-1': '262 83% 58%',
      '--chart-metric-2': '25 95% 53%',
      '--chart-metric-3': '142 76% 36%',
      '--chart-metric-4': '217 91% 60%',
    };
    return fallbacks[variable] || '0 0% 50%';
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value || '0 0% 50%';
};

export const getChartColors = () => {
  return {
    success: hslToHex(getCssVariable('--chart-success')),
    error: hslToHex(getCssVariable('--chart-error')),
    warning: hslToHex(getCssVariable('--chart-warning')),
    info: hslToHex(getCssVariable('--chart-info')),
    metric1: hslToHex(getCssVariable('--chart-metric-1')),
    metric2: hslToHex(getCssVariable('--chart-metric-2')),
    metric3: hslToHex(getCssVariable('--chart-metric-3')),
    metric4: hslToHex(getCssVariable('--chart-metric-4')),
    primary: hslToHex(getCssVariable('--primary')),
    destructive: hslToHex(getCssVariable('--destructive')),
  };
};

// Evaluation specific color mappings
export const getEvaluationColors = () => {
  const colors = getChartColors();
  return {
    passed: colors.success,
    failed: colors.error,
    error: colors.warning,
    accuracy: colors.metric4, // blue
    precision: colors.metric1, // purple
    recall: colors.metric2, // orange
    f1Score: colors.metric3, // green
    truePositive: colors.success,
    falsePositive: colors.error,
    falseNegative: colors.warning,
    trueNegative: colors.info,
  };
};
