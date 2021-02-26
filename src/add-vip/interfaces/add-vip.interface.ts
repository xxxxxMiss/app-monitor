import { Image } from 'canvas'
import { File } from '../../common/interface/common.interface'
export interface AddVip {
  data?: any
  file: File
  vipKey?: string
  vipFile?: File
  round?: 0 | 1
  radius?: number
  size?: number
  borderRadius: number
}

export interface VipImg {
  key: string
  path: string
}
