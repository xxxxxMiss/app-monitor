import { PDFOptions } from 'puppeteer'
import { File } from '../../common/interface/common.interface'

export interface IPDFOptions extends PDFOptions {
  text?: string
  filename?: string
  file?: File
}
