Fancy.format = {
  CURRENCY_REGIONS: {
    AUD: 'en-AU',
    CAD: 'en-CA',
    CHF: 'de-CH',
    CNY: 'zh-CN',
    EUR: 'de-DE',
    GBP: 'en-GB',
    INR: 'en-IN',
    JPY: 'ja-JP',
    KRW: 'ko-KR',
    KZT: 'kk-KZ',
    NOK: 'nb-NO',
    PLN: 'pl-PL',
    RUB: 'ru-RU',
    SEK: 'sv-SE',
    TRY: 'tr-TR',
    USD: 'en-US'
  },
  currency(params) {
    const value = params.value;
    const minDecimal = params.minDecimal || 0;
    const maxDecimal = params.maxDecimal || minDecimal || 0;
    const currency = params.currency || 'USD';
    const region = params.region || Fancy.format.CURRENCY_REGIONS[params.currency] || 'en-US';

    if (isNaN(value) || value === '' || value === null) return '';

    return new Intl.NumberFormat(region, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: minDecimal,
      maximumFractionDigits: maxDecimal
    }).format(value);
  }
};

Fancy.toCamelCase = (str) => {
  return str
    .split(' ')
    .map((word, index) => {
      if (index === 0) return word;

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
};
