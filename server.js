const express = require('express')
const mongoose = require('mongoose')
const app = express()
const db = require('./models/shortDB')

const port = process.env.PORT || 5000;;

mongoose.connect(process.env.MONGODB_URI||'mongodb://mongo:27017/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res)=>{
    
    const url = await db.find();
    res.render('index', {
        shortUrls: url
    });
})

app.post('/shortUrls', async (req, res) => {
    await db.create({full: req.body.fullUrl})

    res.redirect('/');
})

app.get('/:shortUrl', async (req, res)=>{
    
    const shortUrl = await db.findOne({short: req.params.shortUrl});

    if(shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save()

    res.redirect(shortUrl.full);
    
})

app.listen(port, ()=>{
    console.log("server started on ", port);
    
})