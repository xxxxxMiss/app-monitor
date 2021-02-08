import { Injectable } from '@nestjs/common'
import { JoinImg } from './interfaces/join-img.interface'

@Injectable()
export class JoinImgService {
  join(data: JoinImg) {}
}
