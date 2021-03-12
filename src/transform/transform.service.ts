import { Injectable } from '@nestjs/common'
import Jimp from 'jimp'
import { File } from '../common/interface/common.interface'
import { createCanvas, Canvas, loadImage, Image } from 'canvas'
import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf.js'
import * as path from 'path'
import * as fs from 'fs'
import puppeteer, { PDFOptions } from 'puppeteer'
import markit from 'markdown-it'
import hljs from 'highlight.js'
import matter from 'gray-matter'
import cheerio from 'cheerio'
import * as url from 'url'
import markdownItPlantuml from 'markdown-it-plantuml'
import mustache from 'mustache'

function makeCss(filename) {
  const css = fs.readFileSync(filename, { encoding: 'utf-8' })
  if (css) {
    return '\n<style>\n' + css + '\n</style>\n'
  }
  return ''
}
// TODO: support custom style
function readStyles() {
  let filename = path.join(__dirname, '..', 'config', 'markdown.css')
  let style = makeCss(filename)

  filename = path.join(
    path.dirname(require.resolve(`highlight.js/package.json`)),
    'styles',
    'github.css',
  )
  style += makeCss(filename)

  filename = path.join(__dirname, '..', 'config', 'markdown-pdf.css')
  style += makeCss(filename)
  return style
}

function makeHtml(data) {
  const filename = path.join(__dirname, '..', 'config', 'template.html')
  const template = fs.readFileSync(filename, { encoding: 'utf-8' })

  // read mermaid javascripts
  // var mermaidServer =
  //   vscode.workspace.getConfiguration('markdown-pdf')['mermaidServer'] || ''
  // var mermaid = '<script src="' + mermaidServer + '"></script>'

  const view = {
    title: 'title',
    style: readStyles(),
    content: data,
    // mermaid: mermaid,
  }
  return mustache.render(template, view)
}

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
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

function convertImgPath(src, filename) {
  let href = decodeURIComponent(src)
  href = href.replace(/("|')/g, '').replace(/\\/g, '/').replace(/#/g, '%23')
  const protocol = url.parse(href).protocol
  if (protocol === 'file:' && href.indexOf('file:///') !== 0) {
    return href.replace(/^file:\/\//, 'file:///')
  }
  if (protocol === 'file:') {
    return href
  }
  if (!protocol || path.isAbsolute(href)) {
    href = path
      .resolve(path.dirname(filename), href)
      .replace(/\\/g, '/')
      .replace(/#/g, '%23')
    if (href.indexOf('//') === 0) {
      return 'file:' + href
    }
    if (href.indexOf('/') === 0) {
      return 'file://' + href
    }
    return 'file:///' + href
  }
  return src
}
/*
 * https://github.com/microsoft/vscode/blob/ca4ceeb87d4ff935c52a7af0671ed9779657e7bd/extensions/markdown-language-features/src/slugify.ts#L26
 */
function Slug(string) {
  return encodeURI(
    string
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace whitespace with -
      .replace(
        /[\]\[\!\'\#\$\%\&\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\_\{\|\}\~\`。，、；：？！…—·ˉ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g,
        '',
      ) // Remove known punctuators
      .replace(/^\-+/, '') // Remove leading -
      .replace(/\-+$/, ''), // Remove trailing -
  )
}

async function exportMaterial(data, { type }) {
  const basePath = path.join(process.cwd(), 'temp')
  const tmpfilename = path.join(basePath, '_tmp.html')
  fs.writeFileSync(tmpfilename, data)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(data, { waitUntil: 'networkidle0' })
  if (type === 'pdf') {
    await page.pdf({
      path: path.join(basePath, 'test.pdf'),
    })
  } else {
    await page.screenshot({
      path: path.join(basePath, 'test.png'),
      fullPage: true,
    })
  }

  await browser.close()
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
  async markdown2Pdf({ data, type, filename }) {
    // const buf: Buffer = data.file.buffer
    // const grayText = buf.toString('utf-8')
    const matterParts = matter(data)
    const md = markit({
      html: true,
      breaks: true,
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (error) {
            str = md.utils.escapeHtml(str)
          }
        } else {
          str = md.utils.escapeHtml(str)
        }
        return '<pre class="hljs"><code><div>' + str + '</div></code></pre>'
      },
    })
    const defaultRender = md.renderer.rules.image
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      let href = token.attrs[token.attrIndex('src')][1]
      if (type === 'html') {
        href = decodeURIComponent(href).replace(/("|')/g, '')
      } else {
        href = convertImgPath(href, filename)
      }
      token.attrs[token.attrIndex('src')][1] = href
      return defaultRender(tokens, idx, options, env, self)
    }
    if (type !== 'html') {
      md.renderer.rules.html_block = (tokens, idx) => {
        const html = tokens[idx].content
        const $ = cheerio.load(html)
        $('img').each(function () {
          const src = $(this).attr('src')
          const href = convertImgPath(src, filename)
          $(this).attr('src', href)
        })
        return $.html()
      }
    }
    md.use(require('markdown-it-checkbox'))

    const emojiOptions = {
      defs: require(path.join(__dirname, '..', 'config', 'emoji.json')),
    }
    md.use(require('markdown-it-emoji'), emojiOptions)
    md.renderer.rules.emoji = function (token, idx) {
      const emoji = token[idx].markup
      const emojiPath = path.join(
        path.dirname(require.resolve('emoji-images/package.json')),
        'pngs',
        `${emoji}.png`,
      )
      const emojidata = fs.readFileSync(emojiPath, null).toString('base64')
      if (emojidata) {
        return (
          '<img class="emoji" alt="' +
          emoji +
          '" src="data:image/png;base64,' +
          emojidata +
          '" />'
        )
      }
      return ':' + emoji + ':'
    }
    md.use(require('markdown-it-named-headers'), {
      slugify: Slug,
    })
    md.use(require('markdown-it-container'), '', {
      validate: function (name) {
        return name.trim().length
      },
      render: function (tokens, idx) {
        if (tokens[idx].info.trim() !== '') {
          return `<div class="${tokens[idx].info.trim()}">\n`
        }
        return `</div>\n`
      },
    })

    const plantumlOptions: markdownItPlantuml.Options = {
      openMarker: matterParts.data.plantumlOpenMarker || '@startuml',
      closeMarker: matterParts.data.plantumlCloseMarker || '@enduml',
      server: '',
    }
    md.use(markdownItPlantuml, plantumlOptions)
    md.use(require('markdown-it-include'), {
      root: path.dirname(filename),
      includeRe: /:\[.+\]\((.+\..+)\)/i,
    })

    const content = md.render(matterParts.content)
    const html = makeHtml(content)
    await exportMaterial(html, { type: 'png' })
    return ''
  }
}
