// @ts-nocheck
import { Injectable } from '@nestjs/common'
import { AddWatermark } from './interfaces/watermark.interface'
import { polyfill } from 'spritejs/lib/platform/node-canvas'
import { Scene, Sprite, Label, ENV } from 'spritejs'
import { HttpResponse } from '../common/interface/common.interface'
import { loadImage } from 'canvas'

polyfill({ ENV })

@Injectable()
export class WatermarkService {
  async addWatermark(data: AddWatermark) {
    const img = await loadImage(data.file.buffer)
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
    const { coordx, coordy, repeat, text, fontSize, ...attrs } = data
    if (repeat === 'true') {
      let xGap = img.naturalWidth - 100
      let yGap = img.naturalHeight - 100
      let repeatCount = 1
      while (xGap > 0) {
        const repeatText = `${text}   `.repeat(repeatCount)
        const label = await new Label(repeatText)
        await label.attr({
          ...attrs,
          x: xGap,
          fontSize,
        })
        fglayer.append(label)
        xGap -= 200
        repeatCount += 50
      }
      repeatCount = 1
      while (yGap > 0) {
        const repeatText = `${text}   `.repeat(repeatCount)
        const label = await new Label(repeatText)
        await label.attr({
          ...attrs,
          y: yGap,
          x: 0,
          fontSize,
        })
        fglayer.append(label)
        yGap -= 200
        repeatCount += 50
      }
    } else {
      const label = new Label(text)
      await label.attr({
        ...attrs,
        pos: [coordx, coordy],
        fontSize,
      })
      fglayer.append(label)
    }

    const canvas = await scene.snapshot()
    const result: HttpResponse = {
      code: 0,
      data: canvas.toDataURL(),
    }
    return result
  }
}
