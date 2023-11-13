require("dotenv").config();
const express = require('express');
const {connectToMongoDB} = require('./connect');
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const app = express();
const PORT = process.env.PORT || 8001;
const cors = require('cors');


connectToMongoDB(process.env.MONGO_URL)
.then(()=>console.log("database connected"))

app.use(express.json());
// const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use("/url",urlRoute);

app.get('/:shortId',async(req,res)=>{
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
        shortId,
    },
    {
        $push: {
            visitHistory:{timestamp:Date.now(),}
        }
    }
    );
    res.redirect(entry.redirectURL);
})

app.listen(PORT,()=>console.log(`Server started at port ${PORT}`))