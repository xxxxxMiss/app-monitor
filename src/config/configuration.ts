import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'

export default () => {
  const env = process.env.NODE_ENV || 'defaults'
  return yaml.load(fs.readFileSync(join(__dirname, `${env}.yml`), 'utf8'))
}
