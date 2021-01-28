import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  async sendMail() {
    const options = this.configService.get('nodemailer')
    console.log('---------', options)
    const transporter = nodemailer.createTransport(options)
    transporter.sendMail({
      from: options.auth.user,
      to: 'jzclc@126.com',
      text: 'hello world',
    })
  }
}
