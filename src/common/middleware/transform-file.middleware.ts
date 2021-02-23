import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as webgl from 'node-canvas-webgl'

@Injectable()
export class TransformFileMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['transformFileToImg'] = buf => {
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
    next()
  }
}
