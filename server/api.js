module.exports = app => {
  const http = require('http');
  const ws = require('ws');

  const multer = require('multer');
  const slugify = require('slugify');
  const fs = require('fs/promises');
  const path = require('path');

  const { getAudioDurationInSeconds } = require('get-audio-duration');

  const server = http.createServer(app);
  const wss = new ws.Server({ server });

  wss.addListener('connection', () => {
    console.log('CONNECT');
  });

  function broadcast(message) {
    for (const client of wss.clients) {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  }

  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'drops/');
      },
      filename: (req, file, cb) => {
        const time = new Date().getTime();
        const name = slugify(req.body.username || 'anonymous', { remove: /[\\\/*+~.()'"!\?:@]/g }).slice(0, 30);

        const filename = `${time}-${name}.ogg`;

        broadcast({
          type: 'new-file',
          payload: nameMap(filename),
        });

        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      cb(null, file.mimetype === 'audio/ogg');
    },
    limits: {
      fileSize: 10000000,
    },
  });

  app.post('/drop', upload.single('file'), (req, res) => {
    // res.send("thanks")
    res.redirect('/');
  });

  app.get('/drops/:file', (req, res) => {
    const full = path.join(__dirname, '..', 'drops', req.params.file);
    res.sendFile(full);
  });

  app.get('/duration/:file', (req, res) => {
    const full = path.join(__dirname, 'drops', req.params.file);

    getAudioDurationInSeconds(full).then((duration) => {
      res.send({ duration });
    });
  });

  // const Ref = //

  function nameMap(file) {
    return ({
      path: file,
      date: new Date(file.split('-')[0] * 1),
      name: file.split('-')[1].split('.')[0],
      //
    });
  }

  app.get('/drops', async (req, res) => {
    const files = await fs.readdir('./drops');
    const json = files.filter((name) => name.endsWith('ogg')).map(nameMap);

    res.send(json);

    // console.log(dir)
  });
}
