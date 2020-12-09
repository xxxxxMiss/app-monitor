import { Injectable } from '@nestjs/common'
import { Cat } from './interfaces/cat.interface'
import { createWorker } from 'tesseract.js'
import { join } from 'path'
// import { readFileSync } from 'fs'
import { RecognizeData } from './interfaces/fund.interface'
import { homedir } from 'os'

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = []

  create(cat: Cat) {
    this.cats.push(cat)
  }

  findAll(): Cat[] {
    return this.cats
  }

  findOne(id: number): string {
    console.log(id)
    return 'find one'
  }

  async resolve(imgBuf: Buffer): Promise<RecognizeData> {
    const worker = createWorker({
      logger: (m) => console.log(m),
      langPath: join(homedir(), 'tesseract-langs'),
    })
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    // readFileSync(join(__dirname, '../../code/test1.png')),
    const {
      data: { text },
    } = await worker.recognize(imgBuf)
    await worker.terminate()
    const data: string[] = text.split(' ')
    return {
      price: data[1],
      count: data[3],
    }
  }
}
