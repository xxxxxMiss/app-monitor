import { Injectable } from '@nestjs/common'
import { polyfill } from 'spritejs/lib/platform/node-canvas'
import { Scene, Sprite, ENV } from 'spritejs'
import { HttpResponse } from '../common/interface/common.interface'
import { AddVip } from './interfaces/add-vip.interface'
import { Canvas, loadImage } from 'canvas'
import * as path from 'path'

polyfill({ ENV })

@Injectable()
export class AddVipService {
  async addVip(data: AddVip) {
    const vipImgPath = path.join(process.cwd(), 'public', 'imgs', 'vip.jpg')
    const { img } = data
    const scene = new Scene({
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
    const bglayer = scene.layer('bglayer')
    const bgSprite = new Sprite({
      texture: img,
    })
    const vipImg = await loadImage(vipImgPath)
    const vipSprite = new Sprite({
      texture: vipImg,
      x: img.naturalWidth - vipImg.naturalWidth - 50,
      y: img.naturalHeight - vipImg.naturalHeight - 50,
    })
    bglayer.append(bgSprite)
    bglayer.append(vipSprite)
    // @ts-ignore
    const canvas: Canvas = await scene.snapshot()
    const result: HttpResponse = {
      code: 0,
      data: canvas.toDataURL(),
    }
    return result
  }
}
