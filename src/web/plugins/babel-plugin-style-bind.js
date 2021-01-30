const { extname, join } = require('path')
const globby = require('globby')
const { addDefault } = require('@babel/helper-module-imports')

function genCallExpression(t, { styles, classNames }) {
  if (!genCallExpression.node) {
    genCallExpression.node = t.callExpression(
      t.memberExpression(classNames, t.identifier('bind')),
      [styles],
    )
  }
  return args => {
    return t.callExpression(genCallExpression.node, args)
  }
}

module.exports = ({ types: t }) => {
  return {
    pre() {
      // { filename->{ styles, classNames } }
      this.importedCache = new Map()
      this.matchedPaths = null
      this.defaultOpts = {
        varName: 'cx',
        extensions: ['.less'],
        includes: [join(process.cwd(), 'src', 'pages', '**', '*.{jsx,tsx}')],
      }
      this.opts = {
        ...this.defaultOpts,
        ...this.opts,
      }
    },
    visitor: {
      Program(path) {
        if (!this.matchedPaths) {
          this.matchedPaths = []
          for (let pattern of this.opts.includes) {
            this.matchedPaths = [...this.matchedPaths, ...globby.sync(pattern)]
          }
        }
        const filename = path.hub?.file?.opts?.filename
        if (
          this.matchedPaths.includes(filename) &&
          !this.importedCache.has(filename)
        ) {
          const pattern = this.opts.extensions
            .map(ext => {
              return ext.slice(1)
            })
            .join(',')
          const styleFiles = globby.sync(
            filename.replace(extname(filename), `.${pattern}`),
          )
          if (!styleFiles || !styleFiles.length) return
          const styles = addDefault(
            path,
            styleFiles[0], // only support one type currently
            {
              nameHint: 'styles',
            },
          )
          const classNames = addDefault(path, 'classnames/bind', {
            nameHint: 'classNames',
          })
          this.importedCache.set(filename, { styles, classNames })
        }
      },
      CallExpression(path) {
        const filename = path.hub?.file?.opts?.filename
        const { node } = path
        if (
          this.importedCache.has(filename) &&
          node.callee.name === this.opts.varName
        ) {
          path.replaceWith(
            genCallExpression(
              t,
              this.importedCache.get(filename),
            )(node.arguments),
          )
        }
      },
    },
  }
}
