import { ApiProperty } from '@nestjs/swagger'

export class FetchVips {
  @ApiProperty({
    example: 'vip1',
    description: 'The key of the default vip image',
  })
  key: string

  @ApiProperty({
    example: '/imgs/vip1.png',
    description: 'The path of the default img path',
  })
  path: string
}
