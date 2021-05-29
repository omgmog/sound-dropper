const express = require('express');
const multer = require('multer');
const slugify = require('slugify');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'drops/')
        },
        filename: (req, file, cb) => {
            const time = new Date().getTime()
            const name = slugify(req.body.username || 'anonymous', {remove: /[\\\/*+~.()'"!:@]/g}).slice(0,30);

            const filename = `${time}-${name}.ogg`

            cb(null, filename);
        }
    }),
    fileFilter: (req, file, cb) => {
        cb(null, file.mimetype === 'audio/ogg');
    },
    limits: {
        fileSize: 10000000
    }
});

const port = process.env.PORT || 3000;

const app = express();

app.post('/drop', upload.single('file'), (req, res) => {
    res.send("thanks")
})


app.get('/drops/:file', (req, res) => {
    res.send(`Requested file "${req.params.file}"`);
})

app.get('/drops', (req, res) => {
    res.send([
        {by: 'max', length: 200},
        {by: 'ben', length: 120},
    ])
})



// load files in ./static directory
app.use(express.static('static'))

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});