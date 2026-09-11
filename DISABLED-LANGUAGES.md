# Disabled Languages — Kaise Enable Karein

Kuch languages abhi `disabled` hain kyunki unke translations blank hain.

**Disabled languages:**
- कुड़ुख (kurukh)
- सादरी (sadri)
- छत्तीसगढ़ी (chhattisgarhi)

Jab translations ready ho jayen, neeche diye steps follow karke ek language enable karein.

## Step 1 — Translations bharein (`data/languages.json`)

`data/languages.json` kholen. Isme `"kurukh"`, `"sadri"` aur `"chhattisgarhi"` ke
blocks ali empty strings hain, jaise:

```json
"kurukh": {
  "panchayat": "",
  "emergency": "",
  "market": "",
  ...
  "officials_note": ""
}
```

Jis language ko enable karna hai, uska block khol kar har key ke andar sahara
translation bharein. Example — agar `"kurukh"` ka `"panchayat"` bharna hai:

```json
"kurukh": {
  "panchayat": "पंचायत निर्देशिका",
  "emergency": "आपातकालीन सेवाएँ",
  ...
}
```

Reference ke liye `"hindi"` ya `"english"` block dekhein — wahi keys translate karni
hai. Koi bhi key khali chhod do to us text ka translation nahi lagta aur Hindi
rahata hai.

> **Note:** `data/kurukh.json`, `data/sadri.json`, `data/chhattisgarhi.json` files
> bhi hain, lekin website unhe load nahi karti. Sirf `languages.json` use hota hai.
> Ye files documentation/backup ke liye hain (consistency ke liye inme bhi
> translations daal sakte ho, optional).

## Step 2 — `disabled` attribute hatao

Har page ke header me language selector ke buttons hain.
Abhi ye aise hain:

```html
<button type="button" data-language="kurukh" disabled>कुड़ुख</button>
<button type="button" data-language="sadri" disabled>सादरी</button>
<button type="button" data-language="chhattisgarhi" disabled>छत्तीसगढ़ी</button>
```

Jo language enable karni hai, uske button se `disabled` attribute hatao:

```html
<button type="button" data-language="kurukh">कुड़ुख</button>
```

Ye button **6 HTML files** me hai, sabme change karein:
1. `index.html`
2. `pages/about.html`
3. `pages/contact.html`
4. `pages/feedback.html`
5. `pages/officials.html`
6. `pages/panchayat.html`

## Step 3 — Test karein

Server chala kar browser me language selector kholen, woh language chune aur verify
karein ki pura content translate ho raha hai.

**Agar koi user pehle se disabled language localStorage me save kiya ho:** koi
problem nahi — `js/language.js` languages.json me agar woh language nahi mili to
automatic `hindi` par set kar deta hai.

## Quick Summary

| Kaam | File |
|------|------|
| Translations bharein | `data/languages.json` |
| `disabled` hatao (6 files) | `index.html`, `pages/*.html` |
| Reset check | `js/language.js` (koi change nahi chahiye) |