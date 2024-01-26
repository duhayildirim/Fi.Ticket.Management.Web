# Fimple Ticket Management Web
Fimple web projesi içini eklenen yeni menüde(Eğitim>Örnek listeleme), başvuru yönetim sistemi oluşturuldu.

- _Kullanıcı gerekli inputları doldurduktan sonra başvuru oluşturur. Kullanıcı girdileri gerekli validasyon işlemlerini geçtikten sonra diğer başvurularla birlikte listelenir._
- _Tüm başvuruların listede belirli özellikleri görünür şekilde listelenir. Liste kolonları daha iyi bir kullanıcı deneyimi açısından kalabalık ve karışık tutulmamıştır. Sadece başvuruların temel özellikleri listelenmiştir_ 
- _Bir başvurunun tüm özelliklerini görüntülenmek istenirse liste üzerinden başvurun satırında çıkan butonlardan detay aracılığıyla detay sayfasına gidilebilir._
- _Bir başvuru silinmek istenirse ilgili satırda çıkan butonlardan sil aracılığıyla silinebilir._
- _Başvuru reddedilebilir, onaylanabilir veya incelemesinin devam ettiği belirtilebilir. Bununla birlikte kullanıcıya başvurusuna dair bir mesaj gönderilebilir. Bu işlem, ilgili başvurunun satırında çıkan butonlardan güncelle aracılığıyla gerçekleştirilir._
- _Listeleme ekranında tüm verilerin tüm özellikleri listelenmemesine rağmen kart üzerinde bulunan inputlar aracılığıyla daha detaylı bir arama yapılabilir._


## Start and Run
```
`yarn` -- Bağımlılıkları yükler
`yarn start` -- Dummydatalarla çalışmaya imkan sağlan server.js, Container ve mikrofrontend uygulamalarını başlatır.
```

Uygulama bu adreste başlayacaktır:_http://investmentbank.localhost:50000/_

## Folder Structure
### Yeni eklenen dosyalar
- root dizin > server.js
Uygulama içinde api istekleri cors'a takıldığı için _(fimplecouk ya da localhost içeren api ifadelerine izin verdiğinden)_ uygulama içinde küçük bir sunucu oluşturuldu ve localhost:60000 portunda çalışır hale getirildi.
Bu sunucu 'yarn start' komutu ile birlikte ayağa kalkar ekstra bir şey yapmaya gerek yoktur.
Sunucu public içindeki DummyData.json dosyasıyla çalışır.
Sunucu ile ilgili kodlamalar _(api istekli, port ayarları vb.)_ ilgili dosyada yorum satırlarıyla açıklanmıştır.
<br />

- pages > sample-list, sample-definition, sample-detail, sample-update
Gerçekleştirilen ticket sistemindeki CRUD işlemleri ayrı klasör yapısına bölünmüştür. Sistemi daha iyi anlamak, daha fazla kodlama yapmak, sıfırdan sayfalar oluşturabilmeyi öğrenmek, framework'ü daha iyi anlamak, SampleList.js dosyasını kalabalık tutmamak ve daha temiz kod bir adına bu yöntem tercih edilmiştir.
Oluşturulan her sayfa için, unique bir uikey generate-uiKey komutu ile oluşturulmuş ve routes.js içinde tanımlanmıştır.
Bu sayfalarda yapılan kodlamalar, yorum satırları ile açıklanmıştır.
<br />

### Coding
- Kodlama sürecinde: dosya-klasör oluşturma, değişken-fonksiyon tanımlama vb. uygulama içi uyulması beklenen frontend kurallarına ilgili dökümantasyon takip edilerek uyulmuştur. _(https://sdk-docs.fimple.co.uk/sdkdocs/development/Frontend-Coding-Rules.html)_ 
- Kodlama sürecinde: açılacak yeni bir diyalog, eklenecek yeni bir input, input özelleştirme, input validasyon, Card, Responsive tasarım ve benzeri konularda uygulamanın kendi dokümantasyonu baz alınmıştır. _(https://storybook.sandbox.fimple.co.uk/)_