const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name, verificationNumber) => {
  sgMail.send({
    to: email,
    from: "taskmanager@theevenfall.com",
    subject: "Welcome to The Evenfall Task Manager app!",
    text: `Welcome to The Evenfall task Manager app, ${name}!\nGo ahead 
        and organize your tasks.\nPlease provide the following verification number: ${verificationNumber}\nYou might wanna hear some cool music: https://theevenfall.bandcamp.com/`,
    html: `<body style="font-size: 18px; font-family: Arial, Helvetica, sans-serif;">Welcome to <font color="blue"><strong>The Evenfall task Manager app</strong></font>, ${name}!<br> 
        Go ahead and organize your tasks...<br><br>But first, please provide this verification number in order to confirm your account: <strong>${verificationNumber}</strong><br><br>By the way, you might wanna hear some cool music:<br><br> <a href="https://theevenfall.bandcamp.com/" target="_blank" style="background: #FFF0F5;border-top: 1px solid grey; border-radius: 25px;padding: 8px 12px;text-decoration: none; font-size: 22px">CLICK ME!</a><br><br>or...<br><br><a href="" target="_blank" style="background:#FFF0F5;border-top: 1px solid grey; font-size:22px;border-radius: 25px; padding: 8px 12px; color:green; text-decoration:none">GO AND VERIFY</a><br><br><br><br><br><div style="font-size: 18px;border-top: 1px solid grey; padding-top:5px">The Evenfall<br><br>Progressive Metal From Argentina</div></body>`,
  });
};

const sendGoodByeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "taskmanager@theevenfall.com",
    subject: `So sorry you deleted your account...`,
    text: `You have successfully deleted your account from Task Manager.\nMeanwhile, check this awesome music: https://theevenfall.bandcamp.com/`,
    html: `<div style="font-size: 24px">You have successfully deleted your account from Task Manager ${name}.\nMeanwhile, check this awesome music: <a href="https://theevenfall.bandcamp.com/" target="_blank">THE EVENFALL</a></div>`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendGoodByeEmail,
};
