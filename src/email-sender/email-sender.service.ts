import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { Wish } from "src/wishes/entities/wish.entity";

@Injectable()
export class EmailSenderService {
  async sendEmail(emails: string[], wish: Wish) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: '465',
      secure: true,
      auth: {
        user: 'KupiPodariWebMaster@yandex.ru',
        pass: 'ukuojnhqlrvijbrr'
      },
    });

    console.log('emails пришли', emails);
    console.log('wish пришло', wish)

    const email = await transporter.sendMail({
      from: '"KupiPodariDay 🎁" <KupiPodariWebMaster@yandex.ru>',
      to: `${emails}`,
      // to: 'shnatalee@yandex.ru',
      subject: 'Сбор денег на подарок завершен',       
      html: `
      <div>
        <h1>Сбор средств на подарок завершен!</h1>
        <img src="${wish.image}">
        <p>Лови <a href="${wish.link}">ссылку</a> на подарок</p>
        <p>Контакты для связи с "дарителями":</p>
        ${emails}
      </div>`      
    });

    if (!email) {
		console.log('Error: message faild')
		return;
	  } else {
		console.log("Message sent: %s", email.messageId);
	  }  
  } 
}