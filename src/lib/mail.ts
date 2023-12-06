import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { mailTemplate } from "./mailTemplate";

interface Props {
  to: string;
  name: string;
  subject: string;
  url: string;
}

export const sendMail = async ({ to, name, subject, url }: Props) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  //check transport
  try {
    const testResult = await transport.verify();
    console.log("transportCheck", testResult);
  } catch (error) {
    console.log(error);
    return;
  }

  //send mail
  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: compileTemplate(name, url),
    });

    console.log("sendResult", sendResult);
  } catch (error) {
    console.log(error);
  }
};

const compileTemplate = (name: string, url: string) => {
  const template = handlebars.compile(mailTemplate);
  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
};
