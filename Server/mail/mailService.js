import nodemailer from 'nodemailer'; 
import "dotenv/config"


let transporter;

 
async function main() {

    
    transporter = nodemailer.createTransport({
        //transport options
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
      auth: {
            type: "OAUTH2",
            user: process.env.GMAIL_USER, // generated ethereal user
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: 'ya29.A0ARrdaM_Uok2gaODO4ly6NXWopqpTDT8vsh5IohDpeS_K8ftv5eJJFQxGDSw_Klzb9mWs2kqLSAxfCUKqnNYzERYMAwn2a60jxGFJd_gMPhnY_KM7T-CjaoXhP_5DkvckZf7SNRVo4sObJ1gxMtdXzO4ZXZd1'
      },
    });     
   
}


main().catch(console.error);

export default function mailService(data){

    let htmlBody;
    let subject;
    switch(data.type){
        case 'register_confirmation':
            subject = 'Confirm your account on Svelte Shop'
            htmlBody = 
            `<div style="text-align:center; border:1px solid rgba(255,255,255,0.5); border-radius:5px; margin:5px 10px; padding:15px; box-shadow: 2px 2px 2px rgba(255,255,255,0.5)">
                <h2>Hello ${data.name || 'Customer'}</h2>
                    <h3>Thank you for signing up with Us!</h3>
                    <p>To verify your email follow this <span><a href='#'>link<a/></span></p>
                    <p style="color:red;">link does not work as of yet</p>
                    <br>
                    <p style="color:#0080ff" >Svelte Shop</b></p>
            </div>`

            break;
        case 'forgot_password':
            subject = 'Reset password'
            htmlBody = 
            `<div style="text-align:center; border:1px solid rgba(255,255,255,0.5); border-radius:5px; margin:5px 10px; padding:15px; box-shadow: 2px 2px 2px rgba(255,255,255,0.5)">
                    <h3>Hi ${data.name}</h3>
                    <p>To reset your password, click the button below.</p>
                    <a href="#" style=" padding: 8px 15px; background-color:#0080ff; color: #fff; text-decoration:none; font-size:16px;">Reset password</a>
                    <p>If you did not request this, then ignore this email</p>
                    <p style="color:#0080ff" >Svelte Shop</b></p>
            </div>`
            break;
        case 'purchase_confirmation':
            subject = 'Order Confirmation';
            htmlBody = 
            `<div style="text-align:center; border:1px solid rgba(255,255,255,0.5); border-radius:5px; margin:5px 10px; padding:15px; box-shadow: 2px 2px 2px rgba(255,255,255,0.5)">
                <h2>Thank you for your purchase</h2>
                    <h3>Dear ${data.name || 'Customer'}</h3>
                    <p>Thank you for choosing to buy from us.</p>
                    <p>You will receive a confirmation when the order is sent!</p>
                    <p>If you have any questions regarding the order or the shipment, please feel free to contant us</p>
                    <br>
                    <p>With regards</p>
                    <p style="color:#0080ff" >Svelte Shop</b></p>
            </div>`
            break;
        
    }
    
    data.htmlBody = htmlBody;
    data.subject = subject;
    sendMail(data);
}

async function sendMail(data){
    let info = await transporter.sendMail({
        from: '"Svelte Shop" <1505samirali@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: data.htmlBody, // html body
      }, function(err){
          if(err) console.log(`failed to send email: ${err}`);
          else console.log(`email sent successfully`);
      });
}