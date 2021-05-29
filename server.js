const express = require('express');
const multer = require('multer');
const slugify = require('slugify');
const fs = require('fs/promises');
const path = require('path');

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
    const full = path.join(__dirname, 'drops', req.params.file);
    res.sendFile(full)
})

app.get('/drops', async (req, res) => {
    const files = await fs.readdir('./drops')

    const json = files.map(file => ({
        path: file,
        date: (new Date(file.split('-')[0]*1)).toLocaleDateString(),
        name: file.split('-')[1].split('.')[0]
        // 
    }))

    res.send(json)

    // console.log(dir)


})



// load files in ./static directory
app.use(express.static('static'))

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});