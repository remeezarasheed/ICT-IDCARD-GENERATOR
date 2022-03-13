const express = require('express'); 
const Users = require('./src/modal/userDB')
const Batch = require('./src/modal/batchDB')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Joi = require("joi");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const dotenv = require("dotenv").config();
let path = require('path');
var pdfmake = require('pdfmake');
const nodemailer = require("nodemailer");
const batchRouter = require("./src/route/batch_manager");




const app = express(); 
app.use( express.static(path.join(__dirname,'/src/build')))
const cors = require('cors');
const { get } = require('express/lib/response');
const { ClientRequest } = require('http');
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//cors
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//cors ends here


//middle router 
app.use("/batchmanager",  verifyJWT, batchRouter);

app.use('/images', express.static(path.join(__dirname, 'images')))

//multer & uuid


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
  }
  
  let upload = multer({ storage, fileFilter });
  
  //multer ends



//joi

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
})

const loginValidation = (data => {
  return loginSchema.validate(data);
})

//joi ends


//register student
app.post("/api/studentregister", upload.single('image'), async(req,res)=>{
  const user = req.body;

      //check user name or pswd is taken before
      const takenEmail =  await Users.findOne({email: user.email.toLowerCase()})
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

      if (takenEmail){
          res.json ({message: "Email has already been taken"})
      }else if(!regex.test(user.email)) {
          res.json ({message:"Email is invalid"});
      }
      else{
          user.password = await bcrypt.hash(req.body.password, 10)
          const dbUser =  new Users({
              email: user.email.toLowerCase(),
              name: user.name,
              gender:user.gender,
              password: user.password,
              batch:user.batch,
              course:user.course,
              image: req.file.filename,
              role: "user",
              designation:"Student",

          })
          dbUser.save()
          res.json({message: "Success"})
      }
})


//register student ends

//verifyJWT token
//Verify JSON Web Token

function verifyJWT(req, res, next) {
  // removes 'Bearer` from token
  const token = req.headers["x-access-token"]?.split(' ')[1]

  if (token) {
      //token verifying
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) return res.json({
              isLoggedIn: false, 
              message: "Failed To Authenticate"
          })
          req.user = {};
          req.user.id = decoded.id
          req.user.email = decoded.email
          req.user.designation = decoded.designation
          req.user.role = decoded.role
          req.user.course = decoded.course
          req.user.name= decoded.name
          req.user.gender= decoded.gender
          req.user.image= decoded.image
          req.user.approvedstatus = decoded.approvedstatus

          next()
      })
  } else {
      res.json({message: "Incorrect Token Given", isLoggedIn: false})
  }
}

//ends here VerifyJWT token





//////////////////////Login

app.post("/api/login", (req, res) => {
    
  const userLoggingIn = req.body;

  if (!userLoggingIn) return res.json({message: "Server Error"})

  const validationError = loginValidation(userLoggingIn).error

  if (validationError) {
      return res.json({message: validationError.details[0].message})
  } else {
      Users.findOne({email: userLoggingIn.email.toLowerCase()})
      .then(dbUser => {
          if (!dbUser) {
              return res.json({message: "Invalid Email or Password"})
          }
          //bcrypt checking password
          bcrypt.compare(userLoggingIn.password, dbUser.password)
          .then(isCorrect => {
              if (isCorrect) {
                  const payload = {
                      id: dbUser._id,
                      email: dbUser.email,
                      designation: dbUser.designation,
                      role: dbUser.role,
                      gender:dbUser.gender,
                      name:dbUser.name,
                      image:dbUser.image,
                      course:dbUser.course,
                      approvedstatus:dbUser.approvedstatus

                  }
                  jwt.sign(
                      payload, 
                      process.env.JWT_SECRET,
                      {expiresIn: 86400},
                      (err, token) => {
                          return res.json({message: "Success", token: "Bearer " + token})
                      }
                  )
              } else {
                  return res.json({message: "Invalid Username or Password"})
              }
          })

      })
  }
})

//////////////////////Login ends

/////////////////////////isUserAuth
 
app.get("/isUserAuth", verifyJWT, (req, res) => {
  return res.json({isLoggedIn: true, email: req.user.email, role: req.user.role})
})
/////////////////////////isUserAuthEnds



app.get("/",(req,res)=>{
  return res.json(message = "true")
})


////USER DETAILS IN HOME

app.get("/userdetails", verifyJWT, (req, res) => {
    if(req.user.role==="user"){
     res.json({
        id: req.user.id,
        email: req.user.email,
        designation: req.user.designation,
        name:req.user.name,
        gender:req.user.gender,
        role: req.user.role,
        course: req.user.course,
        image: req.user.image,
        approvedstatus:req.user.approvedstatus

})}else{
    res.json(message="Not authorized")
}

    })


//admindetails

app.get("/admindetails", verifyJWT, (req, res) => {
    if(req.user.role==="admin"){
     res.json({
        id: req.user.id,
        email: req.user.email,
        designation: req.user.designation,
        name:req.user.name,
        gender:req.user.gender,
        role: req.user.role,
        course: req.user.course,
        image: req.user.image,
        approvedstatus:req.user.approvedstatus

})}else{
    res.json(message="Not authorized")
}

    })





//USERDETAILS IN HOME



//course adding 
app.put('/api/addcourse',(req,res)=>{
    const {course} = req.body;
    const filter = {};
    const update = {$push: {course}}
    Batch.findOneAndUpdate (filter,update,{new:true})
        .then((course)=>{
            res.json(course)
        })
    })

//batch adding 
app.put('/api/addbatch',(req,res)=>{
    const {batch} = req.body;
    const filter = {};
    const update = {$push: {batch}}
    Batch.findOneAndUpdate (filter,update,{new:true})
        .then((batch)=>{
            res.json(batch)
        })
    })

//BATCH AND COURSE
app.get('/api/batchcourse',(req,res) => {
    Batch.find()
    .then ((batchdetails)=>{
        res.json(batchdetails)
    })
});

//applyuser

app.put('/api/:id/apply', verifyJWT, upload.single('regimage'),async (req,res) => {
    const role= req.user.role;
    const filter = {_id:  req.params.id };
    if (role==="user"){
        const{email, 
            fullname, 
            course, 
            batch, 
            phone,
            coursesd,
            coursesend,
            approvedby,
            regimage, 
            gender,
            approvedstatus
        } = req.body;
        const update = {email, 
            fullname, 
            course, 
            batch, 
            phone,
            coursesd,
            coursesend,
            approvedby, 
            regimage:req.file.filename,
            gender, 
            approvedstatus:"pending"
        }
        const regex1= /^\d{10}$/g;
        if(!regex1.test(req.body.phone)){
            res.json({message: "Invalid Phone Number"})
        }else{
        Users.findOneAndUpdate(filter, update,{new: true})
        .then(()=>{
            res.json({message: "Success"})
        })}}else{
            res.json(message = "User can only perform this Action.")
    }

})

//getstatus

app.get('/api/:id/getroleandstatus', verifyJWT, (req,res)=>{
    const id=  req.params.id;
    const _id = req.user.id;
    const role= req.user.role;

    if(role==="user" && id===_id)
    {
    Users.find({_id:id},{email:1,role:1,approvedstatus:1,fullname:1,regimage:1,course:1, updatedAt:1})
    .then((getrole)=>{
        res.json(getrole)
    })
}
})


//PDF MAKE STARTS HERE


//PDF MAKE STARTS HERE


app.get('/api/:id/generate-pdf', verifyJWT, (req, res) => {
    const id =  req.params.id;
    const role= req.user.role;
    Users.find({_id:id},{_id:1, email:1, role:1, phone:1,coursesd:1, coursesend:1 ,gender:1, approvedstatus:1,fullname:1,regimage:1,course:1, updatedAt:1, designation:1})
    .then((getrole)=>{
        const obj = getrole[0]
        if ( role === "user" && req.user.id === id && obj.approvedstatus === "approved" )
        {

    var docDefinition = {

        info: {
            title: `ICTAK ID CARD - ${obj.fullname}`,
            author: 'ICTAK',
            subject: 'ID CARD',
            keywords: `${obj._id}`,
          },
      
        pageSize: 'C7',
        footer: {
            columns: [
                    `\n Sd/- \n Issuing Authority`,
                {
                },
            ],
            margin: [140, 0, -80, -120 ],
            fontSize: 7,
            alignment:"right",
            color: "#0281a1",


        },  
        content: [
            {
                image: `./images/logo.jpg`,
                absolutePosition: { x: 7, y: 5 },
                height: 50,
                width:50

            },
           
            {
                text:["Thiruvananthapuram/Thrissur/Kozhikode"],
                    fontSize:7,
                    absolutePosition: { x: 61, y: 30},
                    
                 },
            {
            text:["Phone: 7594051437 /+91-471-2700811"],
                fontSize:7,
                absolutePosition: { x: 61, y: 40},

             },
             {
                 canvas: [
                     { type: 'line', 
                     x1: -44, y1: 22, x2: 595-2*40, y2: 19, 
                     lineWidth: 2, 
                     lineColor: "#0281a1",
                     
                    }]
                
            },

            {
                image: `./images/${obj.regimage}`,
                absolutePosition: { x: 65, y: 80 },
                height: 125,
                width:100

            },
            {
                text: [ `\n`,`\n`,`\n`,`\n`,`\n`,`\n`,`\n`,`\n`,`\n`,`\n`,`\n`, `${obj.fullname} \n`],
                fontSize: 12,
                alignment: "center",
                color: "#0281a1",
                margin: [0, 0],

            },

            {
                text: [ 
                `${obj.designation} \n`,
                `Gender: ${obj.gender} \n`,
                `${obj.course} \n`,

                ],
                alignment: "center",
                fontSize: 10,
            },
            {
            text:[
           ],
           pageBreak: "after"
            },
            {
                image: `./images/smallhead.png`,
                absolutePosition: { x: 0, y: -30, z:-1 },
                height: 69,
                width:230
            },
            {
                text: [ `Phone Number: +91 ${obj.phone} \n`,
                `\n`,
                `e-mail: ${obj.email } \n`,
                `\n`,
                `Course Start Date: ${(obj.coursesd).split('-').map(Number).reverse().join('/')}\n`,
                `\n`,
                `Valid up to: ${(obj.coursesend).split('-').map(Number).reverse().join('/')}`,
                `\n`,
                `\n`,
                `\n`,
                ],
                alignment: "left",
                fontSize: 9,
                lineHeight:0.6,
            },
            { qr:`id: ${obj._id} \n Name: ${obj.fullname} \n Designation: ${obj.designation} \n Gender: ${obj.gender} \n Course: ${obj.course} \n e-mail: ${obj.email } \n Phone Number: +91 ${obj.phone} \n Course Start Date: ${(obj.coursesd).split('-').map(Number).reverse().join('/')}\n Course End Date: ${(obj.coursesend).split('-').map(Number).reverse().join('/')}`,
            foreground: '#0281a1', 
            fit: '130',
            alignment:"center",
     },
     {
            text:[{text:`\n \n Finder may please return this card to the address given below \n \n`, color:"black"},
            "ICTAK, GF-1 Thejaswini Building, Technopark Rd, Thiruvananthapuram, Kerala 695581",
            `\n \n Phone: 0471 270 0811 `,
            `| email ID: ictaksupport@ictkeral.org \n`,
        `Website: ictkerala.org`],
            alignment: "left",
            fontSize: 5,
            color: "#0281a1",
     },
     {
        image: `./images/smallhead.png`,
        absolutePosition: { x: 0, y: 285, z:-1 },
        height: 69,
        width:230

    },

          ],

          

        header: {
            text:["Information and Communication Technology Academy of Kerala"],
            fontSize:9,
            absolutePosition: { x: 60, y: 8 },
            color: "#0281a1",
            margin: [-180, 0 , -160, -120 ],

        },
       
        };
         

    const doc = new pdfmake({
      Roboto: { normal: new Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64') }
    }).createPdfKitDocument(docDefinition)
    var chunks = [];
    var result;
    doc.on('readable', function () {
      var chunk;
      while ((chunk = doc.read(9007199254740991)) !== null) {
        chunks.push(chunk);
      }
    });
    doc.on('end', function () {
      result = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-disposition', `attachment; filename=ICTAK ID Card - ${obj.fullname}.pdf`);
      res.send(result);
    });
    doc.end();
  
    }else{
        res.json(message= "Not Authorized")
    }}) 
});

//PDF MAKE ENDS HERE






//ADMIN CRUD OPERATIONS

////////////////nodemail setups///////////////

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
      refresh_token: process.env.OAUTH_REFRESH_TOKEN
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
      tls:{
          rejectUnauthorized: false
      }
    },
  });

  return transporter;
};











//ADMIN FORM CONTROL

//course adding 
app.put('/api/addcourse',verifyJWT,(req,res)=>{
    const role = req.user.role;
    if (role === "admin")
    {
    const {course} = req.body;
    const filter = {};
    const update = {$push: {course}}
    Batch.findOneAndUpdate (filter,update,{new:true})
        .then((course)=>{
            res.json(course)
        })
    }
    else{
        res.json(message= "Not an Admin")
    }
    })

//batch adding 
app.put('/api/addbatch',verifyJWT, (req,res)=>{
    const role = req.user.role;
    if (role === "admin")
    {
    const {batch} = req.body;
    const filter = {};
    const update = {$push: {batch}}
    Batch.findOneAndUpdate (filter,update,{new:true})
        .then((batch)=>{
            res.json(batch)
        })
    }
    else{
        res.json(message= "Not an Admin")
    }
    })

// batch deleting

app.post('/api/delbatch',verifyJWT, (req,res)=>{
    const role = req.user.role;
    if (role === "admin")
    {
    const {batch} = req.body;
    const filter = {};
    const update = {$pull: {batch}}
    Batch.findOneAndUpdate (filter,update,{new:true})
        .then((batch)=>{
            res.json(batch)
        })
    }
    else{
        res.json(message= "Not an Admin")
    }
    })

    // course deleting

app.post('/api/delcourse',verifyJWT, (req,res)=>{
    const role = req.user.role;
    if (role === "admin")
    {
    const {course} = req.body;
    const filter = {};
    const update = {$pull: {course}}
    Batch.findOneAndUpdate (filter,update,{new:true})
        .then((batch)=>{
            res.json(batch)
        })
    }
    else{
        res.json(message= "Not an Admin")
    }
    })


//BATCH AND COURSE GET
app.get('/api/batchcourse',(req,res) => {
    Batch.find()
    .then ((batchdetails)=>{
        res.json(batchdetails)
    })
});




//ADMIN FORM CONTROL ENDS

// to get  BM details
app.get("/bmdetails", verifyJWT, (req, res) => {
    if(req.user.role==="bm"){
     res.json({
        id: req.user.id,
        email: req.user.email,
        designation: req.user.designation,
        name:req.user.name,
        gender:req.user.gender,
        role: req.user.role,
        course: req.user.course,
        image: req.user.image,
        approvedstatus:req.user.approvedstatus

})}else{
    res.json(message="Not authorized")
}

    })





// Forget Password api

app.post("/api/forgetpwd",async(req, res) => {
    
    const emailfind = await Users.findOne({email:req.body.email})
   
        if (!emailfind) {
        res.json({message: "Invalid Email/Name"})
        }
        else if(req.body.name !== emailfind.name)
        {
        res.json({message: "Invalid Email/Name"})
        }  
        else if(req.body.name == emailfind.name)
        {  
           const filter = {_id: emailfind._id};
           const{password} ={password: await bcrypt.hash("ICTAK@123", 10)} ;
           const update = {password}
           Users.updateOne(filter, update,{new:true}).then(async (batch)=>{

           const recipient = req.body.email;
           const mailSubject = "ICTAK Reset Password-ID Generator-reg.";
           const mailBody = 
           
         `Dear ${req.body.name},
         
         We have reset your login credentials!
         _____________________________
     
          Login ID: ${req.body.email}
          Password: ICTAK@123
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
           
           
           
           
       res.json({message : "success"})
           })}       
})


//Forget Password api ends here

//bm

//bm list shows
app.get("/:id/showmyapprove",verifyJWT, async(req,res)=>{
    const id = req.params.id;
    const emailfinder = await Users.findOne({_id:id})
   if(emailfinder.role==="bm"){
    Users.find({approvedby: emailfinder.email}).then((list)=>{
        res.json(list)
    })}
})
//bmlist ends


//bm action list shows
app.get("/showmypendingilst",verifyJWT, async(req,res)=>{
    const id = req.user.id;
    const pendlist = await Users.findOne({_id:id})
    if (pendlist.role==="bm") {
    Users.find({course: pendlist.course, role:"user", approvedstatus:"pending"}).then((list)=>{
        res.json(list)
    })} 
})
//bmlist pending list ends

//bm pending to approved&by shows
app.put("/:id/approved",verifyJWT, async(req,res)=>{
    const id = req.params.id;
    const apprby = req.user.email;
    const filter = {_id: id };
    const update = {approvedstatus:"approved", approvedby: apprby}
    const role = req.user.role;
    if(role==="bm"){
    Users.findOneAndUpdate(filter, update,{new: true}).then((list)=>{
        res.json(list)
    })}
})
//bmlist pending list ends

//bm pending to approved&by shows
app.put("/:id/rejected",verifyJWT, async(req,res)=>{
    const id = req.params.id;
    const apprby = req.user.email;
    const filter = {_id:  req.params.id };
    const update = {approvedstatus:"rejected", approvedby: apprby}
    const role = req.user.role;
    if(role==="bm"){
    Users.findOneAndUpdate(filter, update,{new: true}).then((list)=>{
        res.json(list)
    })}
})
//bmlist pending list ends
//bm

const port = process.env.PORT || 8000; 

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname+'/src/build/index.html'));
})
// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));