// @ts-nocheck
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'
import { Image } from 'canvas'
import * as webgl from 'node-canvas-webgl'

@Injectable()
export class Buffer2ImgPipe implements PipeTransform<Buffer, Image> {
  async transform(value: Buffer, metadata: ArgumentMetadata) {
    return new Promise((resolve, reject) => {
      const img = new webgl.Image()
      img.onload = () => {
        resolve(img)
      }
      img.onerror = error => {
        reject(error)
      }
      img.src = value
    })
  }
}
