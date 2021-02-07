export interface AddWatermark {
  file: Buffer
  coordx: number | string
  coordy: number | string
  fontSize?: number | string
  fillColor?: string
  opacity?: string | number
  rotate?: string | number
  repeat?: 0 | 1 | true | false
  text: string
}
