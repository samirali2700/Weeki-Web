import nodemailer from 'nodemailer';
import 'dotenv/config';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { header, footer, link, button } from './component.js';
import { style } from './style.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mail_icon_path = path.resolve(__dirname, 'images', 'mail.png');

let transporter;
async function main() {
	transporter = nodemailer.createTransport({
		//transport options
		host: 'mail.weeki.dk',
		port: 465,
		secure: true,
		auth: {
			user: 'service@weeki.dk',
			pass: process.env.MAIL_PASSWORD,
		},
	});
}
main().catch(console.error);

const rootLink = 'http://localhost:3000';
const imageLink = `${rootLink}/images/email-images`;

export default async function mailService(data) {
	let htmlBody;
	let subject;
	switch (data.type) {
		case 'register_confirm':
			subject = 'Bekræft din konto';
			htmlBody = ` 
            <head>
                ${style}
            </head>
            <body>
                <div class="hero">
                    ${header()}
                    <div class="content">
                        <div class="content-container">
                        <div class="intro"><img id="mail" src="intro@mail" alt="mail"><h1>Bekræft din email</h1></div>
                            <div class="text">
                                <h3 style="color:#000; margin-bottom: 10px;">Hej ${
																																	data.name
																																} </h3>
                                <p>For at aktivere din konto, brug nedenfor knap til at bekræfte din email:</p>
                            </div>
                            ${button('Bekræft Email', data.linkTo)}
                            <div class="text">
                                <p>Hvis knappen ikke virker, kan du copy-paste linket nedenfor i din brower</p>
                                <br>
                                ${link(data.linkTo)}
                            </div>
                        </div>
                    </div>
                    ${footer(data.to)}
                </div>
            </body>
            `;
			break;
		case 'invite_employee':
			subject = 'Invitation til Weeki';
			htmlBody = ` 
            <head>
                ${style}
            </head>
            <body>
                <div class="hero">
                    ${header()}
                    <div class="content">
                        <div class="content-container">
                        <div class="intro"><h1>Du er blevet inviteret til Weeki</h1></div>
                            <div class="text">
                                <h3 style="color:#000; margin-bottom: 10px;">Hej,</h3>
                                <p>Din arbejdsgiver har inviteret dig til Weeki, klik på knappen nedenfor og følg vejledingen for at oprette en bruger</p>
                            </div>
                            ${button('Acceptere invitationen', data.linkTo)}
                            <div class="text">
                                <p>Hvis knappen ikke virker, kan du copy-paste linket nedenfor i din brower</p>
                                <br>
                                ${link(data.linkTo)}
                            </div>
                        </div>
                    </div>
                    ${footer(data.to)}
                </div>
            </body>
            `;
			break;
		case 'forgot_password':
			subject = 'Reset password';
			htmlBody = `<div style="text-align:center; border:1px solid rgba(255,255,255,0.5); border-radius:5px; margin:5px 10px; padding:15px; box-shadow: 2px 2px 2px rgba(255,255,255,0.5)">
                    <h3>Hi ${data.name}</h3>
                    <p>To reset your password, click the button below.</p>
                    <a href="localhost:3000/" style=" padding: 8px 15px; background-color:#0080ff; color: #fff; text-decoration:none; font-size:16px;">Reset password</a>
                    <p>If you did not request this, then ignore this email</p>
                    <p style="color:#0080ff" >Weeki</b></p>
            </div>`;
			break;
	}
	data.htmlBody = htmlBody;
	data.subject = subject;
	await sendMail(data);
}

async function sendMail(data) {
	await transporter.sendMail(
		{
			from: '"Weeki" <service@weeki.dk>', // sender address
			to: data.to, // list of receivers
			subject: data.subject, // Subject line
			html: data.htmlBody, // html body
			attachments: [
				{
					filename: 'logo_small.png',
					path: `${imageLink}/logo_small.png`,
					cid: 'intro@logo',
				},
				{
					filename: 'mail.png',
					path: mail_icon_path,
					cid: 'intro@mail',
				},
			],
		},
		function (err) {
			if (err) console.log(`failed to send email: ${err}`);
			else console.log(`email sent successfully`);
		}
	);
}
