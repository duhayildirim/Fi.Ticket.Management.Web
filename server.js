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

// Uygulama api istekleri için cors uyguladığından ve fimplecouk ya da localhost içeren api ifadelerine izin verdiğinden
// uygulama içinde küçük bir sunucu oluşturuldu ve localhost:60000 portunda çalışır hale getirildi.
// Bu sunucu 'yarn start' komutu ile birlikte ayağa kalkar ekstra bir şey yapmaya gerek yoktur.
// Sunucu public içindeki dummydata.json dosyasıyla çalışır.

// get methodu- tüm datayı çeker
app.get('/api/dummydata', (req, res) => {
  res.json(dummyData);
});

// getbyid- id'ye göre belirli bir datayı çeker
app.get('/api/dummydata/:id', (req, res) => {
  const requestedId = req.params.id;
  const requestedData = dummyData.find(item => item.Id === requestedId);

  if (requestedData) {
    res.json(requestedData);
  } else {
    res.status(404).json({ error: 'Veri bulunamadı' });
  }
});

// delete- id'ye göre ilgili datayı siler
app.delete('/api/dummydata/:id', (req, res) => {
  const requestedId = req.params.id;
  const index = dummyData.findIndex(item => item.Id === requestedId);

  if (index !== -1) {
    // Veriyi listeden çıkar
    dummyData.splice(index, 1);

    // Dosyaya yazma işlemi (asenkron)
    fs.writeFile('./playground/public/ticket-dummy/DummyData.json', JSON.stringify(dummyData), (err) => {
      if (err) {
        console.error('Dosyaya yazma hatası:', err);
        res.status(500).json({ error: 'Dosyaya yazma hatası' });
      } else {
        res.json({ success: true });
      }
    });
  } else {
    res.status(404).json({ error: 'Veri bulunamadı' });
  }
});

// post- yeni veri ekler
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

// update- id'ye göre data'yı siler
app.put('/api/dummydata/:id', (req, res) => {
  const requestedId = req.params.id;
  const updatedData = req.body;

  // İlgili ID'ye sahip veriyi bul
  const existingDataIndex = dummyData.findIndex(item => item.Id === requestedId);

  if (existingDataIndex !== -1) {
    // Var olan veriyi güncelle
    dummyData[existingDataIndex] = {
      ...dummyData[existingDataIndex],
      Message: updatedData.Message,
      Status: ["inceleniyor", "reddedildi", "onaylandı"].includes(updatedData.Status)
        ? updatedData.Status
        : dummyData[existingDataIndex].Status // Eğer geçersiz bir Status gönderilirse, mevcut değeri kullan
    };

    // Dosyaya yazma işlemi (asenkron)
    fs.writeFile('./playground/public/ticket-dummy/DummyData.json', JSON.stringify(dummyData), (err) => {
      if (err) {
        console.error('Dosyaya yazma hatası:', err);
        res.status(500).json({ error: 'Dosyaya yazma hatası' });
      } else {
        res.json(dummyData[existingDataIndex]);
      }
    });
  } else {
    res.status(404).json({ error: 'Veri bulunamadı' });
  }
});

// filter- detaylı arama için card üzerindeki inputlara göre veriyi/verileri çeker
app.post('/api/dummydata/search', (req, res) => {
  const searchData = req.body;

  const filteredData = dummyData.filter(item => {
    return (
      (!searchData.Id || item.Id === searchData.Id) &&
      (!searchData.Message || item.Message.includes(searchData.Message)) &&
      (!searchData.Status || item.Status === searchData.Status)
    );
  });

  res.json(filteredData);
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Sunucu çalışıyor: http://investmentbank.localhost:${port}`);
});
