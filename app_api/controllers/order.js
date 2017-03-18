const nodemailer = require('nodemailer');

module.exports.newOrderSubmit = function (req,res){
    var orderData, transporter, mailOptions;
    orderData = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        minis: req.body.minis,
        assembly: req.body.assembly,
        level: req.body.level,
        comments: req.body.comments
    };
    console.log(req.body);
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ORDER_MAIL_USER,
            pass: process.env.ORDER_MAIL_PASS
        }
    });

    mailOptions = {
        from: '"'+orderData.name+'"'+'<'+process.env.ORDER_MAIL_USER+'>', // sender address
        to: process.env.ORDER_MAIL_DESTINATION, // list of receivers
        subject: 'Заказ на покраску миниатюр', // Subject line
        text: JSON.stringify(orderData),
        html: '<h3>Имя</h3><p>'+orderData.name+'</p><h3>Телефон</h3><p>'+orderData.phone+'</p>'+'<h3>Email</h3><p>'+orderData.email+'</p>'+'<h3>Миниатюры</h3><p>'+orderData.minis+'</p>'+'<h3>Сборка</h3><p>'+orderData.assembly+'</p>'+'<h3>Уровень покраски</h3><p>'+orderData.level+'</p>'+'<h3>Примечания</h3><p>'+orderData.comments+'</p>'
    };

    transporter.sendMail(mailOptions,function(error,info){
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent %s ',info.messageId, info.response);
        sendJsonResponse(res,200,{message:'Заказ успешно оформлен!'})
    });
};
var sendJsonResponse = function(res,status,content) {
    res.status(status);
    res.json(content);
};