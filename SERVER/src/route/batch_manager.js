const express = require("express");
const Users = require("../modal/userDB");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
let path = require("path");
const bcrypt = require("bcrypt");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Googleapis
const { google } = require("googleapis");
// Pull out OAuth from googleapis
const OAuth2 = google.auth.OAuth2;
const createTransporter = async () => {
  //Connect to the oauth playground
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  // Add the refresh token to the Oauth2 connection
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token : error message(" + err);
      }
      resolve(token);
    });
  });

  // Authenticating and creating a method to send a mail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL,
      accessToken,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  return transporter;
};

let upload = multer({ storage, fileFilter });

// details of batchmanagers

router.get("/", (req, res) => {
  const role = req.user.role;
  if (role === "admin") {
    Users.find(
      { role: "bm" },
      {
        email: 1,
        role: 1,
        name: 1,
        course: 1,
        designation: 1,
        phone: 1,
        gender: 1,
        batch: 1,
        image: 1,
      }
    )
      .then((r) => res.status(200).json(r))
      .catch((e) => res.status(500).json(e.message));
  }
});

//details of BM end here

router.get("/:id", (req, res) => {
  const role = req.user.role;
  const id = req.params.id;
  Users.findById(id)
    .then((r) => res.json(r))
    .catch((error) => res.status(500).json({ message: error.message }));
});
// adding new BM and mail sending
router.post("/", upload.single("image"), async (req, res) => {
  const role = req.user.role;
  if (role === "admin") {
    const user = req.body;
    //check user name or pswd is taken before
    const takenEmail = await Users.findOne({ email: user.email.toLowerCase() });
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (takenEmail) {
      res.json({ message: "Email has already been taken" });
    } else if (!regex.test(user.email)) {
      res.json({ message: "Email is invalid" });
    } else {
      user.password = await bcrypt.hash(`ICTAK123@${req.body.phone}`, 10);
      const dbUser = new Users({
        email: user.email.toLowerCase(),
        phone: user.phone,
        name: user.name,
        gender: user.gender,
        password: user.password,
        batch: user.batch,
        course: user.course,
        image: req.file.filename,
        designation: user.designation,
        role: "bm",
      });

      const recipient = user.email;
      const mailSubject = "ICTAK ID CARD Generator-Login Credentials-reg.";
      const mailBody = `Dear ${req.body.name},
    
     Welcome to ID Card Generator!

     We have created a login credentials for you!
     _____________________________

     Login ID: ${user.email}
     Password: ICTAK123@${req.body.phone}
     _____________________________

////////////////////////////////////////////////////////////
    
This is a system generated mail. Please do not reply to this e-mail address. If you have any concerns about this mail, kindly contact your system administrator.

////////////////////////////////////////////////////////////


    Administrator,
    ICTAK
    `;

      // Mail options
      let mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: recipient,
        subject: mailSubject,
        text: mailBody,
      };
      try {
        dbUser.save();
        let emailTransporter = await createTransporter();
        emailTransporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            // failed block
            console.log(error);
          } else {
            // Success block
            console.log("Email sent: " + info.response);
          }
        });
      } catch (error) {
        return console.log(error);
      }
      res.json({ message: "Success" });
    }
  } else {
    res.json((message = "Not an Admin"));
  }
});

//adding new BM and mail sending end here

//deleting BM
router.delete("/:id", (req, res) => {
  const role = req.user.role;
  if (role === "admin") {
    const { id } = req.params;
    const filter = { _id: id };
    Users.deleteOne(filter, { new: true })
      .then((batch) => {
        res.json(batch);
      })
      .catch((e) => console.log(e.message));
  } else {
    res.json((message = "Not an Admin"));
  }
});

//deleting BM end here

//updating details of BM

router.put("/:id", upload.single("image"), async (req, res) => {
  //destructuring data from request and body
  console.log("12345");
  console.log("req.body", req.body);
  const role = req.user.role;
  if (role === "admin") {
    const id = req.params.id;
    const getCurrent = await Users.findById(id);
    console.log(getCurrent);
    const filter = { _id: id };
    const { email, name, designation, gender, role, batch, course, phone } =
      req.body;
    const update = {
      email: getCurrent.email,
      name: name && name !== "" ? name : getCurrent.name,
      designation:designation&& designation!==""? designation : getCurrent.designation,
      gender: gender&& gender!==""? gender : getCurrent.gender,
      password: getCurrent.password,
      role:role&& role!==""? role : getCurrent.role,
      batch: batch&& batch!==""? batch : getCurrent.batch,
      course: course&& course!==""? course : getCurrent.course,
      phone: phone&& phone!==""? phone: getCurrent.phone,
    };
    console.log(update);
    const batchUpdate = await Users.updateOne(filter, update, { new: true });
    res.status(200).json(batchUpdate);
  } else {
    res.json((message = "Not an Admin"));
  }
});

//updating details of BM ends here
module.exports = router;
