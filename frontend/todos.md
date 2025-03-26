# Hayvan Hakları İstatistikleri Sayfası - Yapılacaklar

## Genel Yapı
- [ ] Ana sayfada "İstatistikler" bölümü için bir link oluştur
- [ ] `/statistics` veya `/awareness` route'u oluştur
- [ ] İstatistikler sayfası için yeni bir component oluştur

## Gerekli Paketler
```bash
npm install chart.js@^4.4.1 react-chartjs-2@^5.2.0
```

## Veri Yapısı
İstatistikler için kullanılacak örnek veri yapısı:
```javascript
const animalData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [{
        label: 'Hayvan Katliamları',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
    }]
};

const speciesData = {
    labels: ['Kediler', 'Köpekler', 'Kuşlar', 'Diğer'],
    datasets: [{
        data: [300, 250, 200, 150],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)'
        ]
    }]
};

const monthlyData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [{
        label: 'Aylık Hayvan Kayıpları',
        data: [120, 150, 180, 90, 160, 95],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
};
```

## Chart.js Kurulumu
```javascript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// SSR için dynamic import kullanımı
const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), {
  ssr: false,
});

const Pie = dynamic(() => import('react-chartjs-2').then(mod => mod.Pie), {
  ssr: false,
});
```

## Grafik Ayarları
```javascript
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Hayvan Hakları İstatistikleri'
        }
    }
};
```

## Sayfa İçeriği
### Üst Bilgilendirme Metinleri
- "Satın almayın, sahiplenin ve hayvanlara adalet sağlamak için mücadele edin!"
- "Bazen hayat şartları değişir ve minik dostlarımız için en iyisini yapmak isteriz."
- "İşte tam da bu noktada, sevgiyle büyüttüğün hayvanını güvenilir bir aileye emanet edebilmen için buradayız!"
- "Ancak unutmamalıyız ki, her yıl milyonlarca hayvan, şahseca yaşam hakları ellerinden alındığı için acı ve eziyetlere maruz kalıyor."

### Alt Bilgilendirme Metinleri
- "Bu veriler, sadece bir nyanş değil, aynı zamanda bir çağrıdır: Değişim, her birimizin elinde!"
- "Bir hayvanın sevgisini kazanmak, koşulsuz sevginin en saf haline tanık olmaktır." - A.D. Williams

## Responsive Tasarım Sınıfları
### Container ve Genel Yapı
```html
<div className="min-h-screen bg-gray-800 py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        <!-- İçerik buraya gelecek -->
    </div>
</div>
```

### Grafik Container'ları
```html
<div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg space-y-4 sm:space-y-5 md:space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        <!-- Grafikler buraya gelecek -->
    </div>
</div>
```

### Grafik Boyutları
```html
<div className="h-[250px] sm:h-[300px] md:h-[350px]">
    <!-- Grafik componenti buraya gelecek -->
</div>
```

## API Entegrasyonu
- [ ] `getAnimalStatistics` fonksiyonunu API servisine ekle
- [ ] Veri çekme işlemini useEffect içinde gerçekleştir
- [ ] Hata yönetimini ekle 