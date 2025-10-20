import { Config } from '../configs/config';
import nodemailer from 'nodemailer';
import { getNodemailerOptions } from '../configs/nodemailer.configs';
import { loggerConfig } from '../configs/logger.configs';

export const sendMail = async (
  config: Config,
  subject: string,
  html: string,
): Promise<void> => {
  const transporter = nodemailer.createTransport(getNodemailerOptions(config));

  const from = config.smtpConfig.username;
  const recipient = config.smtpConfig.recipientEmail;

  const mailOptions = {
    from: from,
    to: recipient,
    subject: subject,
    html: html,
  };

  loggerConfig.info(`Sending mail to - ${recipient}`);

  await transporter
    .sendMail(mailOptions)
    .catch((error) => loggerConfig.error(error));
};

export function getSubject(data: any): string {
  const { product_name } = data;
  return product_name && product_name.length > 0
    ? `Produktanfrage: ${product_name}`
    : 'Allgemeine Kontaktanfrage';
}

export function getTemplate(data: any): string {
  const {
    name,
    email,
    message,
    product_name,
    product_url,
    ...otherAttributes
  } = data;

  const knownKeys = [
    'name',
    'email',
    'message',
    'product_name',
    'product_url',
    'agb_accepted',
  ];

  const userDefinedAttributes = Object.keys(data).filter(
    (key) =>
      !knownKeys.includes(key) &&
      data[key] &&
      data[key].toString().trim() !== '',
  );

  let additionalInfoHtml = '';
  if (userDefinedAttributes.length > 0) {
    additionalInfoHtml += `
        <h3 style="color:#1D4ED8; margin-top: 20px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">Zusätzliche Attribute</h3>
        <ul style="list-style-type: none; padding: 0;">`;
    userDefinedAttributes.forEach((key) => {
      additionalInfoHtml += `<li style="margin-bottom: 5px;"><strong style="color:#374151;">${key}:</strong> ${data[key]}</li>`;
    });
    additionalInfoHtml += `</ul>`;
  }

  return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                <h1 style="color: #1E40AF; border-bottom: 2px solid #1E40AF; padding-bottom: 10px;">Neue Kontaktanfrage</h1>
                
                <p>Sie haben eine neue Nachricht über das Kontaktformular von Ihrer Webseite erhalten.</p>
                
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEE; width: 30%;"><strong>Name:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEE;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEE;"><strong>E-Mail:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEE;"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    ${
                      product_name && product_name !== 'N/A'
                        ? `
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEE;"><strong>Produkt:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEE;">${product_name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEE;"><strong>URL:</strong></td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EEE;"><a href="${product_url}">${product_url}</a></td>
                    </tr>
                    `
                        : ''
                    }
                </table>

                <h3 style="color:#1D4ED8; margin-top: 20px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">Nachricht</h3>
                <p style="white-space: pre-wrap; background-color: #F9FAFB; padding: 15px; border-radius: 5px; border: 1px solid #E5E7EB;">${message}</p>
                
                ${additionalInfoHtml}
                
                <p style="margin-top: 30px; font-size: 0.9em; color: #6B7280;">Gesendet am: ${new Date().toLocaleString('de-DE')}</p>
            </div>
        </div>
    `;
}
