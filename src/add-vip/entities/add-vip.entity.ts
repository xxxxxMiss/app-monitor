import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { File } from '../../common/interface/common.interface'
import { IsNumber, IsString } from 'class-validator'

export class AddVipEntity {
  @ApiProperty({
    description: 'The image will be add vip',
    type: 'string',
    format: 'binary',
  })
  file: File

  @ApiPropertyOptional({
    example: 'vip1.png',
    default: 'The key of vip image provided by application',
  })
  @IsString()
  vipKey?: string

  @ApiPropertyOptional({
    description: 'The custom vip image',
    type: 'string',
    format: 'binary',
  })
  vipFile?: File

  @ApiPropertyOptional({
    enum: [0, 1],
    default: 0,
    description: 'Retured a round image or not: 1 is round',
  })
  @IsNumber()
  round?: 0 | 1 = 0

  @ApiPropertyOptional({
    default: 50,
    description:
      'The radius of the circle take effect when the round flag is 1',
  })
  radius?: number = 50

  @ApiPropertyOptional({
    default: 100,
    description: 'The size of the square',
  })
  @IsNumber()
  size?: number = 100

  @ApiPropertyOptional({
    default: 10,
    description: 'Square fillet size',
  })
  @IsNumber()
  borderRadius?: number = 10

  @ApiPropertyOptional({
    default: 0,
    enum: ['base64', 'pngStream', 'jpegStream', 'pdfStream'],
    description: 'Retured type of the img',
  })
  @IsString()
  imgType: string = 'base64'
}
