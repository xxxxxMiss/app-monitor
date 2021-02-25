import { Image } from 'canvas'
import { File } from '../../common/interface/common.interface'
export interface AddVip {
  data?: any
  img?: Image
  file?: File
  vipKey: string
}

export interface VipImg {
  key: string
  path: string
}