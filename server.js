const express = require('express');
const multer = require('multer');
const slugify = require('slugify');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/')
        },
        filename: (req, file, cb) => {
            cb(null, slugify(file.originalname, {
                lower: true,
                remove: /[*+~()'"!:@]/g
            }));
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

app.post('/upload', upload.single('file'), (req, res, next) => {
    console.log(`Doing something with ${req.file}`);
    console.log(req);
});


app.get('/upload/:file', (req, res) => {
    res.send(`Requested file "${req.params.file}"`);
})

app.get('/', (req, res) => {
    res.send('Try POST to /upload, or GET /upload/${filename}')
})

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});