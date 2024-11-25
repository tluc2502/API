const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const sendMail = require("../util/mailConfig");
const upload = require("../util/uploadConfig");
router.post("/guimail", async function (req, res, next) {
    try {
        const { to } = req.body;
        // Nội dung HTML và CSS của email
        const content = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333333;
            }
            p {
                color: #555555;
                line-height: 1.5;
            }
            .button {
                display: inline-block;
                padding: 10px 15px;
                margin-top: 10px;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <h1>Chào bạn!</h1>
            <p>{halo}</p>
            <a href="https://example.com" class="button">Tìm hiểu thêm</a>
        </div>
    </body>
    </html>
`;

        const mailOptions = {
            from: "toi <tluc2502@gmail.com>",
            to: to,
            subject: "luc top 1 da gui ",
            html: content,
        };
        await sendMail.transporter.sendMail(mailOptions);
        res.json({ status: 1, message: "Gửi mail thành công" });
    } catch (err) {
        console.error("Lỗi:", err);
        res.json({ status: 0, message: "Gửi mail thất bại", error: err.message });
    }
});

router.post('/upload', [upload.single('imge')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
               return res.json({ status: 0, link : "" }); 
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : "" });
        }
    });



module.exports = router;
