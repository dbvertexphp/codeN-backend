import { PrivacyPolicy } from '../../../models/admin/PrivacyPolicy/privacypolicy.model.js';

// Add or Update Privacy Policy
export const addPrivacyPolicy = async (req, res) => {
  const { content } = req.body;
  try {
    let data = await PrivacyPolicy.findOne();
    if (data) {
      data.content = content;
      await data.save();
      return res
        .status(200)
        .json({ status: true, message: 'Privacy Policy updated!', data });
    } else {
      data = await PrivacyPolicy.create({ content });
      return res
        .status(201)
        .json({ status: true, message: 'Privacy Policy created!', data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Privacy Policy
// export const getPrivacyPolicy = async (req, res) => {
//   try {
//     const data = await PrivacyPolicy.findOne();
//     res.status(200).json({ status: true, data });
//   } catch (error) {
//     res.status(500).json({ status: false, message: error.message });
//   }
// };
// Get Privacy Policy (Mobile API)
export const getPrivacyPolicy = async (req, res) => {
  try {
    const data = await PrivacyPolicy.findOne();

    const content = data
      ? data.content
      : '<h1>Privacy Policy coming soon...</h1>';

    // ADMIN PANEL → JSON
    if (req.headers.accept?.includes('application/json')) {
      return res.status(200).json({
        success: true,
        data: {
          content: content,
        },
      });
    }

    // MOBILE APP → HTML
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            color: #2c3e50;
            background-color: #ffffff;
          }
          h1,h2,h3{color:#1a252f;border-bottom:1px solid #eee;padding-bottom:10px;}
          p{margin-bottom:15px;text-align:justify;}
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;

    res.set('Content-Type', 'text/html');
    res.status(200).send(htmlResponse);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
