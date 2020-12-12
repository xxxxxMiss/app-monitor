import { Injectable } from '@nestjs/common'
import { createWorker } from 'tesseract.js'
import { join } from 'path'
import { readFileSync } from 'fs'
import { RecognizeData } from './interfaces/fund.interface'
import { homedir } from 'os'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Cat, CatDocument } from './schemas/cat.schema'
import { Model } from 'mongoose'
import { CreateCatDto } from './dto/create-cat.dto'

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = []
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto)
    return createdCat.save()
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec()
  }

  findOne(id: number): string {
    // console.log(this.configService.get<string>('PREFIX'))
    return 'find one'
  }

  async resolve(imgBuf: Buffer): Promise<RecognizeData> {
    const worker = createWorker({
      logger: m => console.log(m),
      langPath: join(homedir(), 'tesseract-langs'),
    })
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    const {
      data: { text },
    } = await worker.recognize(imgBuf)
    await worker.terminate()
    const txs = text
      .split(/\r?\n/)
      .filter(tx => !!tx.trim())
      .find((_, i) => i === 9)
      .split(' ')
    return {
      price: txs[1],
      count: txs[3],
    }
  }

  async test(): Promise<RecognizeData> {
    const worker = createWorker({
      logger: m => console.log(m),
      langPath: join(homedir(), 'tesseract-langs'),
    })
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    const {
      data: { text },
    } = await worker.recognize(
      readFileSync(join(__dirname, '../../code/test.png')),
    )
    await worker.terminate()
    const txs = text
      .split(/\r?\n/)
      .find(tx => tx.startsWith('FERAM'))
      .split(' ')

    return {
      price: txs[1],
      count: txs[3],
    }
  }
}
