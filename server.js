const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const dummyData = require('./playground/public/ticket-dummy/DummyData.json');
const fs = require('fs');

const app = express();
const port = 60000;

app.use(cors());
app.use(bodyParser.json());


app.post('/api/dummydata', (req, res) => {
  const newData = req.body;

  // Otomatik artan ID oluştur
  const lastId = parseInt(dummyData[dummyData.length - 1].Id);
  newData.Id = (lastId + 1).toString();

  dummyData.push(newData);

  // Dosyaya yazma işlemi (asenkron)
  fs.writeFile('./playground/public/ticket-dummy/DummyData.json', JSON.stringify(dummyData), (err) => {
    if (err) {
      console.error('Dosyaya yazma hatası:', err);
      res.status(500).json({ error: 'Dosyaya yazma hatası' });
    } else {
      res.json(newData);
    }
  });
});

app.get('/api/dummydata', (req, res) => {
  res.json(dummyData);
});

app.get('/api/dummydata/:id', (req, res) => {
  const requestedId = req.params.id;
  const requestedData = dummyData.find(item => item.Id === requestedId);

  if (requestedData) {
    res.json(requestedData);
  } else {
    res.status(404).json({ error: 'Veri bulunamadı' });
  }
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Sunucu çalışıyor: http://investmentbank.localhost:${port}`);
});
