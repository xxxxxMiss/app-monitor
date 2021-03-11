// @ts-nocheck
import { Injectable } from '@nestjs/common'
import Jimp from 'jimp'
import { File } from '../common/interface/common.interface'
import { createCanvas, Canvas, loadImage, Image } from 'canvas'
import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf.js'
import * as path from 'path'
import * as fs from 'fs'
import puppeteer from 'puppeteer'
import markit from 'markdown-it'
import hljs from 'highlight.js'
import matter from 'gray-matter'
import cheerio from 'cheerio'
import * as url from 'url'

function isExistsPath(path) {
  if (path.length === 0) {
    return false
  }
  try {
    fs.accessSync(path)
    return true
  } catch (error) {
    console.warn(error.message)
    return false
  }
}

function readFile(filename, encode = 'utf-8') {
  if (filename.length === 0) {
    return ''
  }
  if (!encode && encode !== null) {
    encode = 'utf-8'
  }
  if (filename.indexOf('file://') === 0) {
    if (process.platform === 'win32') {
      filename = filename.replace(/^file:\/\/\//, '').replace(/^file:\/\//, '')
    } else {
      filename = filename.replace(/^file:\/\//, '')
    }
  }
  if (isExistsPath(filename)) {
    return fs.readFileSync(filename, encode)
  } else {
    return ''
  }
}
function makeCss(filename) {
  try {
    var css = readFile(filename)
    if (css) {
      return '\n<style>\n' + css + '\n</style>\n'
    } else {
      return ''
    }
  } catch (error) {
    console.log('makeCss()', error)
  }
}
function fixHref(resource, href) {
  if (!href) {
    return href
  }

  // Use href if it is already an URL
  const hrefUri = vscode.Uri.parse(href)
  if (['http', 'https'].indexOf(hrefUri.scheme) >= 0) {
    return hrefUri.toString()
  }

  // Use a home directory relative path If it starts with ^.
  if (href.indexOf('~') === 0) {
    return vscode.Uri.file(href.replace(/^~/, os.homedir())).toString()
  }

  // Use href as file URI if it is absolute
  if (path.isAbsolute(href)) {
    return vscode.Uri.file(href).toString()
  }

  // Use a workspace relative path if there is a workspace and markdown-pdf.stylesRelativePathFile is false
  var stylesRelativePathFile = vscode.workspace.getConfiguration(
    'markdown-pdf',
  )['stylesRelativePathFile']
  let root = vscode.workspace.getWorkspaceFolder(resource)
  if (stylesRelativePathFile === false && root) {
    return vscode.Uri.file(path.join(root.uri.fsPath, href)).toString()
  }

  // Otherwise look relative to the markdown file
  return vscode.Uri.file(
    path.join(path.dirname(resource.fsPath), href),
  ).toString()
}
function readStyles() {
  try {
    var style = ''
    var styles = ''
    var filename = ''
    var i

    // 1. read the style of the vscode.
    filename = path.join(__dirname, '..', 'config', 'markdown.css')
    style += makeCss(filename)

    // // 2. read the style of the markdown.styles setting.
    // if (includeDefaultStyles) {
    //   styles = vscode.workspace.getConfiguration('markdown')['styles']
    //   if (styles && Array.isArray(styles) && styles.length > 0) {
    //     for (i = 0; i < styles.length; i++) {
    //       var href = fixHref(uri, styles[i])
    //       style += '<link rel="stylesheet" href="' + href + '" type="text/css">'
    //     }
    //   }
    // }

    // 3. read the style of the highlight.js.
    // var highlightStyle =
    //   vscode.workspace.getConfiguration('markdown-pdf')['highlightStyle'] || ''
    if (true) {
      var css = 'github.css'
      filename = path.join(
        path.dirname(require.resolve(`highlight.js/package.json`)),
        'styles',
        css,
      )
      style += makeCss(filename)
    } else {
    }

    // 4. read the style of the markdown-pdf.
    filename = path.join(__dirname, '..', 'config', 'markdown-pdf.css')
    style += makeCss(filename)

    // 5. read the style of the markdown-pdf.styles settings.
    // styles = vscode.workspace.getConfiguration('markdown-pdf')['styles'] || ''
    // if (styles && Array.isArray(styles) && styles.length > 0) {
    //   for (i = 0; i < styles.length; i++) {
    //     var href = fixHref(uri, styles[i])
    //     style += '<link rel="stylesheet" href="' + href + '" type="text/css">'
    //   }
    // }

    return style
  } catch (error) {
    console.log('readStyles()', error)
  }
}

function makeHtml(data, uri) {
  try {
    // read styles
    var style = ''
    style += readStyles(uri)

    // read template
    var filename = path.join(__dirname, '..', 'config', 'template.html')
    var template = readFile(filename)

    // read mermaid javascripts
    // var mermaidServer =
    //   vscode.workspace.getConfiguration('markdown-pdf')['mermaidServer'] || ''
    // var mermaid = '<script src="' + mermaidServer + '"></script>'

    // compile template
    var mustache = require('mustache')

    var view = {
      title: 'title',
      style: style,
      content: data,
      // mermaid: mermaid,
    }
    return mustache.render(template, view)
  } catch (error) {
    console.log('makeHtml()', error)
  }
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

function exportHtml(data, filename) {
  fs.writeFile(filename, data, 'utf-8', function (error) {
    if (error) {
      console.log('exportHtml()', error)
      return
    }
  })
}

async function exportPdf(data, type, uri) {
  var exportFilename = path.join(process.cwd(), 'temp', 'test.pdf')
  try {
    // create temporary file
    var f = {
      dir: path.join(process.cwd(), 'temp'),
      name: 'helloworld',
    }
    var tmpfilename = path.join(f.dir, f.name + '_tmp.html')
    exportHtml(data, tmpfilename)
    var options = {
      executablePath: puppeteer.executablePath(),
      args: [
        // '--lang=' + vscode.env.language,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      // Setting Up Chrome Linux Sandbox
      // https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
    }
    const browser = await puppeteer.launch(options)
    const page = await browser.newPage()
    // vscode.Uri.file(tmpfilename).toString(), {
    //       waitUntil: 'networkidle0',
    //     }
    // await page.goto(
    //   'file:///Users/qsch/workspace/app-monitor/temp/helloworld_tmp.html',
    //   { waitUntil: 'networkidle0' },
    // )
    await page.setContent(data, { waitUntil: 'networkidle0' })
    // generate pdf
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
    if (type == 'pdf') {
      // If width or height option is set, it overrides the format option.
      // In order to set the default value of page size to A4, we changed it from the specification of puppeteer.
      var format_option = 'A4'
      var landscape_option = true
      var options = {
        path: exportFilename,
        scale: 1,
        displayHeaderFooter: true,
        headerTemplate:
          '<div style="font-size: 9px; margin-left: 1cm;"> <span class=\'title\'></span></div> <div style="font-size: 9px; margin-left: auto; margin-right: 1cm; "> <span class=\'date\'></span></div>',
        footerTemplate:
          "<div style=\"font-size: 9px; margin: 0 auto;\"> <span class='pageNumber'></span> / <span class='totalPages'></span></div>",
        printBackground: true,
        landscape: landscape_option,
        pageRanges: '',
        format: format_option,
        width: '',
        height: '',
        margin: {
          top: '1.5cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm',
        },
      }
      await page.pdf(options)
      return
    }

    // generate png and jpeg
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
    // if (type == 'png' || type == 'jpeg') {
    //   // Quality options do not apply to PNG images.
    //   var quality_option
    //   if (type == 'png') {
    //     quality_option = undefined
    //   }
    //   if (type == 'jpeg') {
    //     quality_option =
    //       vscode.workspace.getConfiguration('markdown-pdf')['quality'] || 100
    //   }

    //   // screenshot size
    //   var clip_x_option =
    //     vscode.workspace.getConfiguration('markdown-pdf')['clip']['x'] || null
    //   var clip_y_option =
    //     vscode.workspace.getConfiguration('markdown-pdf')['clip']['y'] || null
    //   var clip_width_option =
    //     vscode.workspace.getConfiguration('markdown-pdf')['clip']['width'] ||
    //     null
    //   var clip_height_option =
    //     vscode.workspace.getConfiguration('markdown-pdf')['clip']['height'] ||
    //     null
    //   var options
    //   if (
    //     clip_x_option !== null &&
    //     clip_y_option !== null &&
    //     clip_width_option !== null &&
    //     clip_height_option !== null
    //   ) {
    //     options = {
    //       path: exportFilename,
    //       quality: quality_option,
    //       fullPage: false,
    //       clip: {
    //         x: clip_x_option,
    //         y: clip_y_option,
    //         width: clip_width_option,
    //         height: clip_height_option,
    //       },
    //       omitBackground: vscode.workspace.getConfiguration('markdown-pdf')[
    //         'omitBackground'
    //       ],
    //     }
    //   } else {
    //     options = {
    //       path: exportFilename,
    //       quality: quality_option,
    //       fullPage: true,
    //       omitBackground: vscode.workspace.getConfiguration('markdown-pdf')[
    //         'omitBackground'
    //       ],
    //     }
    //   }
    //   await page.screenshot(options)
    // }

    await browser.close()

    // delete temporary file
    // if (isExistsPath(tmpfilename)) {
    //   deleteFile(tmpfilename)
    // }
  } catch (error) {
    console.log('exportPdf()', error)
  }
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
  async markdown2Pdf({ data, type, filename, emoji_f = true }) {
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
    // checkbox
    md.use(require('markdown-it-checkbox'))

    // emoji
    if (emoji_f) {
      var emojies_defs = require(path.join(
        __dirname,
        '..',
        'config',
        'emoji.json',
      ))
      const options = {
        defs: emojies_defs,
      }
      md.use(require('markdown-it-emoji'), options)
      md.renderer.rules.emoji = function (token, idx) {
        var emoji = token[idx].markup
        const emojiPath = path.join(
          path.dirname(require.resolve('emoji-images/package.json')),
          'pngs',
          `${emoji}.png`,
        )
        var emojidata = readFile(emojiPath, null).toString('base64')
        if (emojidata) {
          return (
            '<img class="emoji" alt="' +
            emoji +
            '" src="data:image/png;base64,' +
            emojidata +
            '" />'
          )
        } else {
          return ':' + emoji + ':'
        }
      }
    }
    // toc
    // https://github.com/leff/markdown-it-named-headers
    const options = {
      slugify: Slug,
    }
    md.use(require('markdown-it-named-headers'), options)

    // markdown-it-container
    // https://github.com/markdown-it/markdown-it-container
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

    // PlantUML
    // https://github.com/gmunguia/markdown-it-plantuml
    var plantumlOptions = {
      openMarker: matterParts.data.plantumlOpenMarker || '@startuml',
      closeMarker: matterParts.data.plantumlCloseMarker || '@enduml',
      server: '',
    }
    md.use(require('markdown-it-plantuml'), plantumlOptions)
    md.use(require('markdown-it-include'), {
      root: path.dirname(filename),
      includeRe: /:\[.+\]\((.+\..+)\)/i,
    })

    const content = md.render(matterParts.content)
    const html = makeHtml(content)
    await exportPdf(html, 'pdf')
    return ''
  }
}
