import { File } from '../../common/interface/common.interface'

export interface JoinImg {
  files: File[]
  category: 'row' | 'col' | 'grid'
}
