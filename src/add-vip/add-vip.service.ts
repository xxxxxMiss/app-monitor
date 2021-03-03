import { Injectable } from '@nestjs/common'
import { polyfill } from 'spritejs/lib/platform/node-canvas'
import { Scene, Sprite, Arc, ENV } from 'spritejs'
import { HttpResponse } from '../common/interface/common.interface'
import { VipImg } from './interfaces/add-vip.interface'
import { AddVipEntity } from './entities/add-vip.entity'
import { Canvas, loadImage } from 'canvas'
import * as path from 'path'
import { promises as fs } from 'fs'
import { Readable } from 'stream'

polyfill({ ENV })

@Injectable()
export class AddVipService {
  async addVip(data: AddVipEntity): Promise<HttpResponse | Readable> {
    const {
      size = 100,
      round = 0,
      radius = 50,
      borderRadius = 10,
      imgType = 'base64',
    } = data
    const vipImgPath = path.join(process.cwd(), 'client', 'imgs', data.vipKey)
    const vipImg = await loadImage(vipImgPath)
    const img = await loadImage(data.file.buffer)
    const num = round ? radius * 2 : size
    const scene = new Scene({
      width: num,
      height: num,
    })
    const bglayer = scene.layer('bglayer')

    let bgPath = null
    if (round) {
      bgPath = new Arc({
        normalize: true,
        radius,
        pos: [radius, radius],
        startAngle: 0,
        endAngle: 360,
        texture: img,
      })
    } else {
      // bgPath = new Path({
      //   d: `M0,10A10,10,0,0,1,10,0L90,0A10,10,0,0,1,100,10L100,90A10,10,0,0,1,90,100L10,100A10,10,0,0,1,0,90Z`,
      //   texture: img,
      // })
      bgPath = new Sprite({
        size: [size, size],
        borderRadius,
        texture: img,
      })
    }
    const vipSprite = new Sprite({
      texture: vipImg,
      x: num,
      y: num,
      anchor: [1, 1],
      scale: 0.5,
    })
    bglayer.append(bgPath)
    bglayer.append(vipSprite)
    // @ts-ignore
    const canvas: Canvas = await scene.snapshot()
    let result: any
    if (imgType === 'base64') {
      result = {
        code: 0,
        data: canvas.toDataURL(),
      }
    } else if (imgType === 'pngStream') {
      result = canvas.createPNGStream()
      result.mimeType = 'image/png'
    } else if (imgType === 'jpegStream') {
      result = canvas.createJPEGStream()
      result.mimeType = 'image/jpeg'
    } else if (imgType === 'pdfStream') {
      result = canvas.createPDFStream()
      result.mimeType = 'application/pdf'
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
