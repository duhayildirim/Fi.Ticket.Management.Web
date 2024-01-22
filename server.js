const express = require('express');
const cors = require('cors');
const path = require('path');
const dummyData = require('./playground/public/ticket-dummy/DummyData.json');

const app = express();
const port = 60000;

// CORS ayarları
app.use(cors());

// API endpoint'i
app.get('/api/dummydata', (req, res) => {
  debugger;
  res.json(dummyData);
});

// API endpoint'i - Id'ye göre veri çekme
app.get('/api/dummydata/:id', (req, res) => {
  const requestedId = req.params.id;
  const requestedData = dummyData.find(item => item.Id === requestedId);

  if (requestedData) {
    res.json(requestedData);
  } else {
    res.status(404).json({ error: 'Veri bulunamadı' });
  }
});

// Static dosyaları servis etmek için (React uygulamanızın build dosyaları)
app.use(express.static(path.join(__dirname, 'build')));

// Diğer tüm yolları React uygulamanıza yönlendirme
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Sunucu çalışıyor: http://investmentbank.localhost:${port}`);
});
