import nodemailer from 'nodemailer';

export const sendUserEmail = async (email: string, subject: string, text: string) =>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.APP_PASSWORD
        }
    });

    const mailOptions ={
        from:{
            name:"Backend Archetecture",
            address:process.env.EMAIL_USER as string
        },
        to:email,
        subject:subject,
        text:text
    }

    try{
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ",info.response);


    }catch(err:any){
        console.error("Error sending email: ",err);
    }
}