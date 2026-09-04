# बगीचा ब्लॉक पोर्टल

जशपुर जिला, छत्तीसगढ़ के बगीचा ब्लॉक के लिए सामुदायिक वेबसाइट।

## फ़ोल्डर संरचना

```
bagicha-block-portal/
├── index.html                    मुख्य पेज (सभी सेक्शन यहीं हैं)
├── pages/
│   ├── about.html                हमारे बारे में
│   ├── contact.html              संपर्क
│   ├── feedback.html             Feedback form
│   ├── panchayat.html            पंचायत विवरण पेज (?name=नाम)
│   └── auth/
│       ├── login.html            Login पेज
│       └── signup.html           Sign Up पेज
├── css/                          स्टाइलिंग अलग-अलग फ़ाइलों में (HTML से अलग)
│   ├── style.css                 मुख्य स्टाइल
│   ├── ad-style.css              विज्ञापन स्लाइडर स्टाइल
│   ├── language-style.css        भाषा चयनकर्ता स्टाइल
│   └── auth-style.css            Login/Signup + header auth स्टाइल
├── js/
│   ├── paths.js                  SITE_BASE resolver (हर page का root path)
│   ├── auth.js                   User login/signup logic (localStorage)
│   ├── auth-pages.js             Login/Signup form handlers
│   ├── script.js                 पंचायत निर्देशिका + menú
│   ├── ad-script.js              विज्ञापन स्लाइडर
│   ├── detail.js                 पंचायत विवरण लोड करना
│   ├── feedback.js               Feedback save करना
│   └── language.js               भाषा switch करना
├── data/
│   └── *.json                    पंचायत, भाषा, ad, feedback डेटा
└── images/
    └── ad-*.png                  विज्ञापन इमेज
```

## कैसे खोलें

`index.html` को किसी भी ब्राउज़र में खोलें। नोट: कुछ ब्राउज़र सीधे फ़ाइल खोलने पर
`fetch()` को स्थानीय JSON फ़ाइल पढ़ने से रोक सकते हैं (CORS सुरक्षा)। अगर पंचायत
सूची खाली दिखे, तो नीचे दिए तरीके से एक छोटा लोकल सर्वर चलाएँ:

```bash
# फ़ोल्डर के अंदर जाकर:
python3 -m http.server 8000
```

फिर ब्राउज़र में `http://localhost:8000` खोलें।

(इसे किसी भी होस्टिंग जैसे GitHub Pages, Netlify, या Hostinger पर अपलोड करने पर
यह समस्या नहीं आती — वहाँ यह अपने आप ठीक से काम करेगा।)

## Login / Sign Up

- **Sign Up करें**: `pages/auth/signup.html` पर नाम, ईमेल और पासवर्ड डालकर खाता बनाएं।
- **Login करें**: `pages/auth/login.html` पर ईमेल और पासवर्ड से login करें।
- हर पेज के header में **Login / Sign Up / Logout** button दिखता है।
- account device के browser के localStorage me save hota है (password hashed form में)।
- **सीमा**: यह client-side demo auth है — security के लिए असली server-based auth
  (जैसे backend + database) की ज़रूरत होगी।

## पंचायत विवरण पेज (Single Panchayat Page)

निर्देशिका में किसी भी पंचायत के नाम पर क्लिक करने पर `pages/panchayat.html?name=नाम` खुलता है,
जो `data/panchayat-details.json` से उस पंचायत की जानकारी (जनसंख्या, ऊँचाई, खास बातें आदि)
दिखाता है। अभी सिर्फ़ **Bhitghara** के लिए जानकारी भरी गई है (सार्वजनिक जनगणना 2011 डेटा
पर आधारित)। बाकी पंचायतों के लिए, जब कोई नाम इस फ़ाइल में नहीं मिलता, पेज पर
"जानकारी अभी जोड़ी नहीं गई" दिखता है।

**किसी और पंचायत के लिए जानकारी जोड़ने का तरीका:**
`data/panchayat-details.json` खोलें और `"Bhitghara": { ... }` जैसी एक नई एंट्री उसी
पंचायत के नाम से जोड़ें (json में मौजूद फ़ील्ड्स — about, highlights, contact — कॉपी करके
नई Coming Soon)।

## विज्ञापन (Ad Banner) कैसे लगाएँ

हीरो सेक्शन में एक ad banner स्लॉट बना हुआ है। अपनी विज्ञापन इमेज को
`images/ad-1.png` / `images/ad-2.png` नाम से रखें (सुझाया गया साइज़: 600×500px)।
इमेज के नाम/लिंक `data/ads.json` में अपडेट करें। इमेज मिलते ही वह अपने आप दिखने लगेगा;
जब तक इमेज नहीं होगी, वहाँ "यहाँ विज्ञापन लगाएँ" वाला प्लेसहोल्डर दिखता रहेगा।

## डेटा अपडेट करना

- **पंचायतों के नाम जोड़ें/बदलें**: `data/panchayats.json` खोलें और नाम एडिट करें।
- **आपातकालीन नंबर, बाज़ार, समाचार, योजनाएँ**: `index.html` में संबंधित सेक्शन
  (`#emergency`, `#market`, `#news`, `#schemes`) में जाकर placeholder टेक्स्ट को
  असली जानकारी से बदलें।
- **रंग/डिज़ाइन बदलें**: `css/style.css` की शुरुआत में `:root` के अंदर रंग वेरिएबल
  (जैसे `--marigold`, `--forest`) बदलें — पूरी वेबसाइट में अपने आप लागू हो जाएगा।
- **भाषाएँ**: `data/languages.json` में हर भाषा के लिए translations रहती हैं।

## Development Status
Major sections that do not yet have real data are marked **Coming Soon**.
No fake emergency/contact numbers are shown during development.

## Pages
- `about.html` — portal purpose and development status
- `contact.html` — official contact placeholder until verified details are available
- `feedback.html` — local feedback form; backend submission can be connected later
- `login.html` / `signup.html` — client-side user accounts (localStorage)