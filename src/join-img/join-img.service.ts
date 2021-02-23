import { Injectable } from '@nestjs/common'
import { JoinImg } from './interfaces/join-img.interface'
import { polyfill } from 'spritejs/lib/platform/node-canvas'
import { Scene, Sprite, ENV } from 'spritejs'
import { HttpResponse } from '../common/interface/common.interface'
import { Canvas } from 'canvas'

polyfill({ ENV })

@Injectable()
export class JoinImgService {
  async join(data: JoinImg) {
    const { imgs, category } = data
    let scene = null
    if (category === 'row') {
      const totalWidth = imgs.reduce((sum, img) => {
        sum += img.naturalWidth
        return sum
      }, 0)
      const maxHeight = imgs.reduce((max, img) => {
        return Math.max(max, img.naturalHeight)
      }, 0)
      scene = new Scene({
        width: totalWidth,
        height: maxHeight,
      })
      const layer = scene.layer('layer')
      let x = 0
      imgs.forEach(img => {
        const sprite = new Sprite({
          texture: img,
          x,
        })
        x += img.naturalWidth
        layer.append(sprite)
      })
    }
    if (category === 'col') {
      const totalHeight = imgs.reduce((sum, img) => {
        sum += img.naturalHeight
        return sum
      }, 0)
      const maxWidth = imgs.reduce((max, img) => {
        return Math.max(max, img.naturalWidth)
      }, 0)
      scene = new Scene({
        width: maxWidth,
        height: totalHeight,
      })
      const layer = scene.layer('layer')
      let y = 0
      imgs.forEach(img => {
        const sprite = new Sprite({
          texture: img,
          x: 0,
          y,
        })
        y += img.naturalHeight
        layer.append(sprite)
      })
    }
    // @ts-ignore
    const canvas: Canvas = await scene.snapshot()
    const result: HttpResponse = {
      code: 0,
      data: canvas.toDataURL(),
    }
    return result
  }
}
