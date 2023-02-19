import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailSenderService {
  constructor(private transporter) {
    this.transporter = nodemailer.createTransport({
      host: 'smpt.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'KupiPodariWebMaster@yandex.ru',
        pass: 'ukuojnhqlrvijbrr'
      },
    });    
  }

  async sendEmail(emails: string[], subject: string, message: string): Promise<void> {
    return this.transporter.sendEmail({
      from: '"KupiPodariDay" <KupiPodariWebMaster@yandex.ru>',
      to: emails.join(),
      subject: "Собрали деньги на подарок",
      text: message,
    }).then((data) => console.log('Message succcessfully send', data))
    .catch((error) => console.log('error', error))
  }  
}