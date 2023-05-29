const express=require("express");
const fileupload=require("express-fileupload");
const cors=require("cors");
const mongoose=require("mongoose");
const route = require("./Routes/routes");
const register = require("./Routes/register");
const verifyUser=require("./middleware/verifyUser");
const app = express();
const PORT=5000;

const user = require("./model/user");


app.use(cors());
app.use(fileupload({createParentPath: true}));

mongoose.connect('mongodb+srv://ShyamKuntal:Shyam123@cluster0.ygygsie.mongodb.net/fileupload?retryWrites=true&w=majority',(err)=>{
    if(err) console.log(err);
    else console.log("database Connected");
})
    
app.use(express.json());
app.use("/files", route);
app.use("/register", register);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/Files/:name/:email", verifyUser , async (req, res) => {
    try {
      res.sendFile(__dirname + `/uploads/${req.params.name}`);
    } catch (err) {
      res.status(500).json({
        status: "Failed",
        message: err.message,
      });
    }
  });

  app.post('/api/signup' , async (req ,res) =>{
    try {
        console.log(req.body)
        let newUser = new user(req.body);
        let result = await newUser.save()
        res.send(result)
    } catch (error) {
       res.send(error) 
    }
})

app.post("/api/mylogin" , async (req,res)=>{
  
  console.log(req.body)
    try {
        const  {email , password} = req.body ;

        const userLogin = await user.findOne({email : email})

        if(userLogin){
            res.status(200).json({message : "User signIn Sucessfully"})
            
        }
        else{
            res.status(400).json({message : "Please Register YourSelf First"})
        }
    } catch (error) {
        console.log(error)
    }
})

app.get('*',(req,res)=>{
    res.status(404).json({
        status:"Failed",
        message:"Page Not Found"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`);
})