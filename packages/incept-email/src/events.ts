//modules
import type { SendMailOptions, SentMessageInfo } from 'nodemailer';
import nodemailer from 'nodemailer';
//stackpress
import { ServerRouter } from '@stackpress/ingest/dist/Router';
import type { EmailConfig } from './types';

const emitter = new ServerRouter();

emitter.on('email-send', async function EmailSend(req, res) {
  const server = req.context;
  const config = server.config<EmailConfig['email']>('email');
  if (!config) return;
  const options = req.data<SendMailOptions>();
  const transporter = nodemailer.createTransport(config);
  const info = await new Promise<SentMessageInfo>((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
  res.setResults(info);
  
});

export default emitter;