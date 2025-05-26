import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense
import numpy as np
import json

texts = [
    "Kediyi sahiplendirme ücretini IBAN'a yollayacağım.",
    "Köpeği satın almak istiyorum, ödeme için hesap bilgisi atar mısınız?",
    "Yavru kediyi rezerve etmek istiyorum, IBAN verir misiniz?",
    "Papağan için ödeme yapacağım, banka bilgilerinizi yollar mısınız?",
    "Evcil hayvan mamasını sipariş ettim, IBAN gönderir misiniz?",
    "Veteriner hizmeti için ücret yatıracağım, hesap numarasını paylaşır mısınız?",
    "Köpek tasması siparişi verdim, ödeme için IBAN lazım.",
    "Kedi kumu için ödeme yapmam gerekiyor, hesap bilgisi yollar mısın?",
    "Hayvan taşıma kafesi aldım, ücret için IBAN atar mısın?",
    "Yavru köpek için kapora yatırmak istiyorum.",
    "Kuş kafesi siparişi için ödeme yapacağım.",
    "Kedi maması toplu siparişi verdim, IBAN’ı yazar mısın?",
    "Hayvan oteli rezervasyonu için ücret yatırmam lazım.",
    "Veteriner muayene ücreti için ödeme yapacağım.",
    "Yavru kediyi sahipleneceğim, ücret bilgisini yollar mısınız?",
    "Barınaktan hayvan sahiplendim, bağış için IBAN atar mısınız?",
    "Evcil hayvan bakım paketi için ödeme göndereceğim.",
    "Köpeğin bakımı için masrafları ödemek istiyorum.",
    "Pet kuaför hizmeti için ücret IBAN’ına göndereceğim.",
    "Kedi taşıma çantasının parasını havale edeceğim.",
    "Petshop’tan sipariş verdim, ödeme için hesap numarası at.",
    "Veterinerden ilaç aldım, ödeme için IBAN lazım.",
    "Hayvan eğitimi için kayıt yaptıracağım, hesap bilgisi paylaşır mısınız?",
    "Evcil hayvan aksesuarları için ödeme yapmam gerekiyor.",
    "Köpek eğitmeni için ücret yatıracağım.",
    "Kedi sahiplendirme ücretini EFT ile göndereceğim.",
    "Köpek maması aylık abonelik ödemesi yapacağım.",
    "Kuş satın almak istiyorum, ödeme detaylarını yollar mısın?",
    "Kedi yuvası siparişi verdim, banka bilgisi lazım.",
    "Kedi oyuncakları siparişi için ödeme IBAN’ı yollar mısın?",
    "Petshop faturasını ödeyeceğim, IBAN gönder.",
    "Yavru tavşan için ödeme yapmak istiyorum.",
    "Köpek pansiyonu için ödeme gönderilir mi?",
    "Hayvan bakıcısı hizmeti için IBAN paylaşır mısınız?",
    "Evcil hayvan sigortası ödemesi yapmam gerekiyor.",
    "Köpeğin sağlık raporu için ücret yatıracağım.",
    "Kedi aşı randevusu için ön ödeme yapacağım.",
    "Veteriner kontrol ücreti için IBAN atar mısın?",
    "Petshop'tan oyuncak aldım, ödeme yapmam lazım.",
    "Hayvan taşıma hizmeti için hesap bilgisi yollar mısın?",
    "Kedi sahiplendirme ilanı için başvurdum, ücret ne kadar?",
    "Köpek tıraşı için ödeme yapacağım.",
    "Hayvan kurtarma derneğine bağış göndermek istiyorum.",
    "Sokak hayvanları için mama aldım, ödeme için IBAN gerekli.",
    "Veteriner kliniğinden randevu aldım, ücret IBAN’ına gönderilecek.",
    "Kedi bakım seti için ödeme göndereceğim.",
    "Köpek eğitimi için taksitli ödeme yapabilir miyim?",
    "Hayvan sahiplendirme etkinliği için katkı ücreti yatıracağım.",
    "Hayvan sahiplenme sözleşmesini tamamladım, ücret ne kadar?",
    "Barınağa bağış yapmak istiyorum, IBAN paylaşır mısınız?"

    "Bu ay kirayı sen mi ödeyeceksin?",
    "Cüzdanımı evde unuttum, biraz para verir misin?",
    "Kredi kartı limitim dolmuş, harcayamıyorum",
    "Ay sonu gelmeden hesabım boşaldı",
    "Yarın faturaları yatırmam lazım",
    "Harçlığımdan bir kısmını sana verebilirim",
    "Dün akşam yemeği bendendi, bu akşam sende olsun",
    "Bankadan gelen mesajı gördün mü?",
    "Yatırım hesabındaki parayı çekecek misin?",
    "ATM'den para çekerken kartım sıkıştı",
    "Sana borcumu hafta sonu ödeyeceğim",
    "Akaryakıt için kredi kartı kullandım",
    "Kampanya ile birlikte %10 indirim aldım",
    "Bugün maaş yattı mı kontrol ettin mi?",
    "Biraz nakit lazım, bankamatik kartım çalışmıyor",
    "Ek hesap faiz işliyor dikkat et",
    "Kartım kopyalanmış, bankayı aramam lazım",
    "Ödemeyi QR kod ile yaptım",
    "İnternet bankacılığına giriş yapamıyorum",
    "Bankamatik sırasındayım biraz gecikeceğim",

    "Kediyi veterinere götürmeyi unutma.",
    "Köpeğe mamasını saatinde ver.",
    "Bugün köpeği gezdirmeye çıkarman gerekiyor.",
    "Kedinin aşı günü geldi, kliniği ara.",
    "Köpeğe tasma takmadan dışarı çıkarma.",
    "Bu akşam kediye yaş mama ver.",
    "Lütfen kedinin kumunu temizle.",
    "Tavşanın suyunu her gün değiştir.",
    "Kuşun kafesini güneş alan bir yere koy.",
    "Balıklara fazla yem verme.",
    "Köpeğin tüylerini fırçala.",
    "Kedinin tırnaklarını kesmeyi unutma.",
    "Kuşun kafesini haftada bir temizle.",
    "Tavşanı dışarı çıkardığında gözetim altında tut.",
    "Balık akvaryumunun filtresini kontrol et.",
    "Kediyi yeni gelen misafire alıştır.",
    "Köpeğin kulaklarını düzenli kontrol et.",
    "Tavşana sebze verirken yıkamayı ihmal etme.",
    "Kedinin mama kabını temiz tut.",
    "Köpeğin su kabını taze suyla doldur.",
    "Aşı karnesini veteriner ziyaretinde yanında bulundur.",
    "Kuşa vitamin takviyesi yapmayı unutma.",
    "Kediyi taşıma çantasına alıştır.",
    "Köpeği sıcak havalarda fazla dışarıda tutma.",
    "Balıkların suyunu haftalık olarak değiştir.",
    "Kediyi banyoya sokmadan önce tırnaklarını kes.",
    "Tavşanı sert zeminlerde gezdirme.",
    "Kuşun tüneğini düzenli temizle.",
    "Köpeğin dişlerini haftada bir fırçala.",
    "Kediyi güneş ışığından uzak tut.",
    "Köpeğe yeni oyuncaklar alarak enerjisini boşaltmasına yardımcı ol.",
    "Balıkların suyuna klor katmamaya dikkat et.",
    "Kediyi yüksek yerlerden uzak tut.",
    "Kuşun kafesine ayna koyma, agresifleşebilir.",
    "Köpeğin pati bakımlarını ihmal etme.",
    "Tavşanı çocuklardan uzak tutarken dikkatli ol.",
    "Kediyi arabaya binmeden önce sakinleştiriciyle rahatlat.",
    "Kuşun yemliğini günde iki kez kontrol et.",
    "Köpeğe evde yalnız kalma eğitimi ver.",
    "Kedinin oyuncaklarını haftalık dezenfekte et.",
    "Tavşanın tüy dökme dönemine dikkat et.",
    "Balıklara gece yem vermekten kaçın.",
    "Kediyi cam kenarlarında yalnız bırakma.",
    "Kuşun kanatlarını veteriner kontrolünde kestir.",
    "Köpeğin egzersiz ihtiyacını ihmal etme.",
    "Tavşana elma verirken çekirdeksiz olduğuna dikkat et.",
    "Kediyi banyodan sonra havluyla kurula.",
    "Köpeğin aşılarının tarihini dijital takvime ekle.",
    "Kuşun kafesinin yerini sık sık değiştirme.",
    "Kedinin göz çevresini düzenli temizle.",
    "Kediyi veterinere götürmeyi unutma.",
    "Köpeğe mamasını saatinde ver.",
    "Bugün köpeği gezdirmeye çıkarman gerekiyor.",
    "Kedinin aşı günü geldi, kliniği ara.",
    "Köpeğe tasma takmadan dışarı çıkarma.",
    "Bu akşam kediye yaş mama ver.",
    "Lütfen kedinin kumunu temizle.",
    "Tavşanın suyunu her gün değiştir.",
    "Kuşun kafesini güneş alan bir yere koy.",
    "Balıklara fazla yem verme.",
    "Köpeğin tüylerini fırçala.",
    "Kedinin tırnaklarını kesmeyi unutma.",
    "Kuşun kafesini haftada bir temizle.",
    "Tavşanı dışarı çıkardığında gözetim altında tut.",
    "Balık akvaryumunun filtresini kontrol et.",
    "Kediyi yeni gelen misafire alıştır.",
    "Köpeğin kulaklarını düzenli kontrol et.",
    "Tavşana sebze verirken yıkamayı ihmal etme.",
    "Kedinin mama kabını temiz tut.",
    "Köpeğin su kabını taze suyla doldur.",
    "Aşı karnesini veteriner ziyaretinde yanında bulundur.",
    "Kuşa vitamin takviyesi yapmayı unutma.",
    "Kediyi taşıma çantasına alıştır.",
    "Köpeği sıcak havalarda fazla dışarıda tutma.",
    "Balıkların suyunu haftalık olarak değiştir.",
    "Kediyi banyoya sokmadan önce tırnaklarını kes.",
    "Tavşanı sert zeminlerde gezdirme.",
    "Kuşun tüneğini düzenli temizle.",
    "Köpeğin dişlerini haftada bir fırçala.",
    "Kediyi güneş ışığından uzak tut.",
    "Köpeğe yeni oyuncaklar alarak enerjisini boşaltmasına yardımcı ol.",
    "Balıkların suyuna klor katmamaya dikkat et.",
    "Kediyi yüksek yerlerden uzak tut.",
    "Kuşun kafesine ayna koyma, agresifleşebilir.",
    "Köpeğin pati bakımlarını ihmal etme.",
    "Tavşanı çocuklardan uzak tutarken dikkatli ol.",
    "Kediyi arabaya binmeden önce sakinleştiriciyle rahatlat.",
    "Kuşun yemliğini günde iki kez kontrol et.",
    "Köpeğe evde yalnız kalma eğitimi ver.",
    "Kedinin oyuncaklarını haftalık dezenfekte et.",
    "Tavşanın tüy dökme dönemine dikkat et.",
    "Balıklara gece yem vermekten kaçın.",
    "Kediyi cam kenarlarında yalnız bırakma.",
    "Kuşun kanatlarını veteriner kontrolünde kestir.",
    "Köpeğin egzersiz ihtiyacını ihmal etme.",
    "Tavşana elma verirken çekirdeksiz olduğuna dikkat et.",
    "Kediyi banyodan sonra havluyla kurula.",
    "Köpeğin aşılarının tarihini dijital takvime ekle.",
    "Kuşun kafesinin yerini sık sık değiştirme.",
    "Kedinin göz çevresini düzenli temizle."
]

labels = [
    1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1
    ]


# Metinleri sayılara çevir
tokenizer = Tokenizer(oov_token="<OOV>")
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded = pad_sequences(sequences, padding='post')

# Model
model = Sequential([
    Embedding(input_dim=1000, output_dim=16, input_length=padded.shape[1]),
    LSTM(64),
    Dense(32, activation='relu'),
    Dense(3, activation='softmax')  # 3 sınıf: -1, 0, 1
])

model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Label'leri 0-1-2 olarak dönüştür
label_map = {-1: 0, 0: 1, 1: 2}
y_train = np.array([label_map[y] for y in labels])

# Eğitim
model.fit(padded, y_train, epochs=22)

# Modeli ve tokenizer'ı kaydet
model.save('sentiment_model.h5')

with open('tokenizer.json', 'w') as f:
    f.write(tokenizer.to_json())

with open('label_map.json', 'w') as f:
    json.dump(label_map, f)
