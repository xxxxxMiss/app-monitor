import {
  IsString,
  IsNumber,
  IsBoolean,
  IsAlphanumeric,
  IsNumberString,
} from 'class-validator'
export class AddWatermarkDto {
  @IsAlphanumeric()
  coordx: number | string
  @IsAlphanumeric()
  coordy: number | string
  @IsAlphanumeric()
  fontSize?: number | string
  @IsString()
  fillColor?: string
  @IsNumberString()
  opacity?: string | number
  @IsAlphanumeric()
  rotate?: string | number
  @IsAlphanumeric()
  repeat?: 0 | 1 | true | false
  @IsString()
  text: string
}
