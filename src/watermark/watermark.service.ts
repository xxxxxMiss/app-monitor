// @ts-nocheck
import { Injectable } from '@nestjs/common'
import { AddWatermark } from './interfaces/watermark.interface'
import { polyfill } from 'spritejs/lib/platform/node-canvas'
import { Scene, Sprite, Label, ENV } from 'spritejs'

polyfill({ ENV })

@Injectable()
export class WatermarkService {
  async addWatermark(data: AddWatermark) {
    const scene = new Scene({
      width: 512,
      height: 512,
    })
    const fglayer = scene.layer('fglayer')
    const sprite = new Sprite()
    sprite.attr({
      pos: [256, 256],
      size: [100, 100],
      anchor: 0.5,
      bgcolor: 'red',
      texture: data.file,
    })
    fglayer.append(sprite)
    const label = new Label('hello world')
    label.attr({
      fillColor: '#077',
    })
    fglayer.append(label)
    const canvas = scene.snapshot()
    // @ts-ignore
    return canvas.toDataURL()
  }
}
