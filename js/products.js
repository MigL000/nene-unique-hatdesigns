/* Product data sourced from nene.nu — image, price (SEK) and a
   translation key (+ optional params) resolved against i18n.js. */
window.NENE_PRODUCTS = {
  hairAccessories: [
    { img: 'hair-accessory-1.jpg', price: 900, sold: false, descKey: 'ha_plain' },
    { img: 'hair-accessory-2.jpg', price: 900, sold: true, descKey: 'ha_plain' },
    { img: 'hair-accessory-3.jpg', price: 900, sold: false, descKey: 'ha_plain' },
    { img: 'hair-accessory-4.jpg', price: 800, sold: false, descKey: 'ha_color' },
    { img: 'hair-accessory-5.jpg', price: 800, sold: true, descKey: 'ha_color' },
    { img: 'hair-accessory-6.jpg', price: 800, sold: false, descKey: 'ha_color' }
  ],
  feltHats: [
    { img: 'felthat-1.jpg', price: 1600, sold: false, descKey: 'fh_fedora' },
    { img: 'felthat-2.jpg', price: 1500, sold: false, descKey: 'fh_boaterGold' },
    { img: 'felthat-3.jpg', price: 1700, sold: false, descKey: 'fh_boaterGoldChain' },
    { img: 'felthat-4.jpg', price: 1700, sold: false, descKey: 'fh_fedoraPainted' },
    { img: 'felthat-5.jpg', price: 1500, sold: false, descKey: 'fh_boater' },
    { img: 'felthat-6.jpg', price: 1500, sold: false, descKey: 'fh_boaterTwoColors' },
    { img: 'felthat-7.jpg', price: 1500, sold: false, descKey: 'fh_fedora' },
    { img: 'felthat-8.jpg', price: 1500, sold: false, descKey: 'fh_feltcap' },
    { img: 'felthat-9.jpg', price: 900, sold: false, descKey: 'fh_pillerbox' },
    { img: 'felthat-10.jpg', price: 900, sold: false, descKey: 'fh_pillerbox' }
  ],
  broches: [
    { img: 'broche-1.jpg', price: 800, sold: true, descKey: 'br_template', size: 'M' },
    { img: 'broche-2.jpg', price: 800, sold: false, descKey: 'br_template', size: 'M' },
    { img: 'broche-3.jpg', price: 800, sold: true, descKey: 'br_template', size: 'L' },
    { img: 'broche-4.jpg', price: 800, sold: true, descKey: 'br_noSize' },
    { img: 'broche-5.jpg', price: 800, sold: false, descKey: 'br_template', size: 'S' },
    { img: 'broche-6.jpg', price: 900, sold: false, descKey: 'br_plain' },
    { img: 'broche-7.jpg', price: 800, sold: false, descKey: 'br_template', size: 'L' },
    { img: 'broche-8.jpg', price: 800, sold: false, descKey: 'br_noSize' },
    { img: 'broche-9.jpg', price: 800, sold: false, descKey: 'br_template', size: 'M' }
  ],
  wedding: [
    { img: 'wedding-1.jpg', price: 1200, sold: false, descKey: 'we_silkPillerbox' },
    { img: 'wedding-2.jpg', price: 1000, sold: false, descKey: 'we_sinamayHairpiece' },
    { img: 'wedding-3.jpg', price: 700, sold: false, descKey: 'we_satinHairpiece' },
    { img: 'wedding-4.jpg', price: 700, sold: false, descKey: 'we_satinHairpiece' }
  ]
};

window.NENE_INSPIRATION = Array.from({ length: 28 }, (_, i) => `inspiration-${i + 1}.jpg`);
