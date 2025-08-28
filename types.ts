export type OHLCV = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type LineStyle = 'solid' | 'dashed'

export type BollingerInputs = {
  length: number
  multiplier: number
  offset: number
  source: 'close'
}

export type BollingerLineStyle = {
  visible: boolean
  color: string
  width: number
  style: LineStyle
}

export type BollingerStyle = {
  basis: BollingerLineStyle
  upper: BollingerLineStyle
  lower: BollingerLineStyle
  background: { visible: boolean; opacity: number; color: string }
}

export type BollingerSettings = {
  inputs: BollingerInputs
  style: BollingerStyle
}
