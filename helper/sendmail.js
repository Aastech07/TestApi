var postmark = require("postmark");
const User = require("../models/userModel");
const postmarkApiKey = process.env.POSTMARK_API_KEY;
var client = new postmark.ServerClient(postmarkApiKey);

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `http://your-app-url/reset-password?token=${resetToken}`;

  const text = `Click the following link to reset your password: ${resetLink}`;
  const html = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
        a {
          color: #007BFF;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Password Reset</h1>
        <p>Click the following link to reset your password:</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
      </div>
    </body>
  </html>
`;

  const message = {
    From: "vinod@integrate360.in",
    To: email,
    Subject: "Password Reset",
    TextBody: text,
    HtmlBody: html,
  };

  try {
    console.log("Sending email:", message);
    await client.sendEmail(message);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset email");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received forgot password request for email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    console.log("Reset token generated:", resetToken);

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
};

module.exports = {
  forgotPassword,
};
