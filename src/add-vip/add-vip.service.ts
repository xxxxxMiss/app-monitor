import { Injectable } from '@nestjs/common'
import { polyfill } from 'spritejs/lib/platform/node-canvas'
import { Scene, Sprite, Path, Arc, ENV } from 'spritejs'
import { HttpResponse } from '../common/interface/common.interface'
import { AddVip, VipImg } from './interfaces/add-vip.interface'
import { Canvas, loadImage } from 'canvas'
import * as path from 'path'
import { promises as fs } from 'fs'

polyfill({ ENV })

@Injectable()
export class AddVipService {
  async addVip(data: AddVip) {
    const vipImgPath = path.join(process.cwd(), 'client', 'imgs', data.vipKey)
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
  async fetchVipImgs(): Promise<HttpResponse> {
    const vips = await fs.readdir(path.join(process.cwd(), 'client', 'imgs'))
    const vipPaths: VipImg[] = vips.map(vip => {
      return {
        key: vip,
        path: path.join('/imgs', vip),
      }
    })
    return {
      code: 0,
      data: vipPaths,
    }
  }
}
