import { ApiProperty } from '@nestjs/swagger'
import { File } from '../../common/interface/common.interface'

export class AddVip {
  @ApiProperty({
    description: 'The image will be add vip',
    type: 'string',
    format: 'binary',
  })
  file: File

  @ApiProperty({
    example: 'vip1',
    default: 'The key of vip image provided by application',
  })
  vipKey?: string

  @ApiProperty({
    description: 'The custom vip image',
    required: false,
  })
  vipFile?: File

  @ApiProperty({
    enum: [0, 1],
    default: 0,
    description: 'Retured a round image or not: 1 is round',
    required: false,
  })
  round?: 0 | 1

  @ApiProperty({
    default: 50,
    description:
      'The radius of the circle take effect when the round flag is 1',
    required: false,
  })
  radius?: number

  @ApiProperty({
    default: 100,
    description: 'The size of the square',
    required: false,
  })
  size?: number

  @ApiProperty({
    default: 10,
    description: 'Square fillet size',
    required: false,
  })
  borderRadius?: number
}
