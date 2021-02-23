import { File } from '../../common/interface/common.interface'
import { Image } from 'canvas'

export interface JoinImg {
  files: File[]
  imgs?: Image[]
  category: 'row' | 'col' | 'grid'
}
