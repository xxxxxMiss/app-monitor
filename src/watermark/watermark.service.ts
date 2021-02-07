// @ts-nocheck
import { Injectable } from '@nestjs/common'
import { AddWatermark } from './interfaces/watermark.interface'
import { polyfill } from 'spritejs/lib/platform/node-canvas'
import { Scene, Sprite, Label, ENV } from 'spritejs'
import * as webgl from 'node-canvas-webgl'
import { HttpResponse } from '../common/interface/HttpResponse.interface'

polyfill({ ENV })

@Injectable()
export class WatermarkService {
  async addWatermark(data: AddWatermark) {
    const getImage = buf => {
      return new Promise((resolve, reject) => {
        const img = new webgl.Image()
        img.onload = () => {
          resolve(img)
        }
        img.onerror = error => {
          reject(error)
        }
        img.src = buf
      })
    }
    const img = await getImage(data.file.buffer)
    const scene = new Scene({
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
    const fglayer = scene.layer('fglayer')
    const sprite = new Sprite()
    sprite.attr({
      texture: img,
    })
    fglayer.append(sprite)
    const label = await new Label()
    const { coordx, coordy, ...attrs } = data
    await label.attr({
      pos: [coordx, coordy],
      ...attrs,
    })
    fglayer.append(label)
    const canvas = await scene.snapshot()
    const result: HttpResponse = {
      code: 0,
      data: canvas.toDataURL(),
    }
    return result
  }
}
