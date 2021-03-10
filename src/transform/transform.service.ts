import { Injectable } from '@nestjs/common'
import Jimp from 'jimp'
import { File } from '../common/interface/common.interface'
import { createCanvas, Canvas, loadImage, Image } from 'canvas'
import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf.js'
import * as path from 'path'

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    var canvas = createCanvas(width, height)
    var context = canvas.getContext('2d')
    return {
      canvas,
      context,
    }
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width
    canvasAndContext.canvas.height = height
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0
    canvasAndContext.canvas.height = 0
    canvasAndContext.canvas = null
    canvasAndContext.context = null
  },
}

@Injectable()
export class TransformService {
  async test({ file }: { file: File }) {
    return Jimp.read(file.buffer).then(img => {
      return img.brightness(0.5)
    })
  }
  async pdf2Img({ file }) {
    const data = new Uint8Array(file.buffer)
    const loadingTask = pdfjsLib.getDocument({
      data,
      cMapUrl: path.join(require.resolve('pdfjs-dist'), 'cmaps'),
      cMapPacked: true,
    })
    return loadingTask.promise.then(pdfDocument => {
      return pdfDocument.getPage(1).then(page => {
        const viewport = page.getViewport({ scale: 2.0 })
        const canvasFactory = new NodeCanvasFactory()
        const canvasAndContext = canvasFactory.create(
          viewport.width,
          viewport.height,
        )
        const renderContext = {
          canvasContext: canvasAndContext.context,
          viewport,
          canvasFactory,
        }

        const renderTask = page.render(renderContext)
        return renderTask.promise.then(() => {
          const image = canvasAndContext.canvas.toDataURL('image/png')
          return image
        })
      })
    })
  }
}
