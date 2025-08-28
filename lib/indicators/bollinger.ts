import type { OHLCV, BollingerInputs } from '../../types'

export type BollingerOptions = BollingerInputs

export type BollingerPoint = { time: number; basis: number; upper: number; lower: number }

// Uses population standard deviation (divide by N)
export default function computeBollingerBands(data: OHLCV[], options: BollingerOptions): BollingerPoint[] {
  const { length, multiplier, offset, source } = options
  const result: BollingerPoint[] = new Array(data.length)

  const getSource = (d: OHLCV): number => {
    switch (source) {
      case 'close':
      default:
        return d.close
    }
  }

  // Precompute SMA incrementally for efficiency
  let rollingSum = 0
  const sourceValues: number[] = data.map(getSource)
  for (let i = 0; i < data.length; i++) {
    rollingSum += sourceValues[i]
    if (i >= length) {
      rollingSum -= sourceValues[i - length]
    }

    if (i + 1 >= length) {
      const mean = rollingSum / length
      // compute variance over window
      let varianceSum = 0
      for (let j = i + 1 - length; j <= i; j++) {
        const diff = sourceValues[j] - mean
        varianceSum += diff * diff
      }
      const variance = varianceSum / length
      const stdDev = Math.sqrt(variance)
      result[i] = {
        time: data[i].time,
        basis: mean,
        upper: mean + multiplier * stdDev,
        lower: mean - multiplier * stdDev,
      }
    } else {
      result[i] = { time: data[i].time, basis: NaN, upper: NaN, lower: NaN }
    }
  }

  // Apply offset shifting by bars: positive shifts forward (to later index)
  if (offset !== 0) {
    const shifted: BollingerPoint[] = new Array(data.length)
    for (let i = 0; i < data.length; i++) {
      const targetIndex = i + offset
      if (targetIndex >= 0 && targetIndex < data.length) {
        shifted[targetIndex] = { ...result[i], time: data[targetIndex].time }
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (!shifted[i]) shifted[i] = { time: data[i].time, basis: NaN, upper: NaN, lower: NaN }
    }
    return shifted
  }

  return result
}

