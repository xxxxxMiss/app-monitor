import { Injectable } from '@nestjs/common'
import { polyfill } from 'spritejs/lib/platform/node-canvas'
import { Scene, Sprite, Path, Arc, ENV } from 'spritejs'
import { HttpResponse } from '../common/interface/common.interface'
import { AddVip } from './interfaces/add-vip.interface'
import { Canvas, loadImage } from 'canvas'
import * as path from 'path'

polyfill({ ENV })

@Injectable()
export class AddVipService {
  async addVip(data: AddVip) {
    const vipImgPath = path.join(process.cwd(), 'public', 'imgs', 'vip2.png')
    const vipImg = await loadImage(vipImgPath)
    let { naturalHeight: vh, naturalWidth: vw } = vipImg
    vh = vh * 0.5
    vw = vw * 0.5
    const img = await loadImage(data.file.buffer)
    const { naturalHeight: bh, naturalWidth: bw } = img
    const scene = new Scene({
      width: img.naturalWidth + vw / 4,
      height: img.naturalHeight + vh / 4,
    })
    const bglayer = scene.layer('bglayer')
    // const bgSprite = new Sprite({
    //   texture: img,
    // })
    // const bgPath = new Path({
    //   d:
    //     'M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2 c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z',
    //   normalize: true,
    //   scale: 3,
    //   pos: [100, 30],
    //   fillColor: 'red',
    //   texture: img,
    //   textureRect: [0, 0, 48, 30],
    //   // rotate: 15,
    // })
    const bgPath = new Arc({
      normalize: true,
      radius: 50,
      pos: [bw / 2, bh / 2],
      startAngle: 0,
      endAngle: 360,
      texture: img,
    })
    const vipSprite = new Sprite({
      texture: vipImg,
      x: img.naturalWidth - vw,
      y: img.naturalHeight - vh,
      scale: 0.5,
    })
    bglayer.append(bgPath)
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
