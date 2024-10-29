Fancy.format = {
  CURRENCY_REGIONS: {
    USD: 'en-US',
    EUR: 'de',
    GBP: 'en-gb',
    JPY: 'jp',
    CNY: 'zh-cn'
  },
  currency(params) {
    const value = params.value;
    const minDecimal = params.minDecimal || 0;
    const maxDecimal = params.maxDecimal || minDecimal || 0;
    const currency = params.currency || 'USD';
    let region = 'en-US';

    if (isNaN(value) || value === '' || value === null) {
      return '';
    }

    if (params.region) {
      region = params.region;
    } else if (Fancy.format.CURRENCY_REGIONS[params.currency]) {
      region = Fancy.format.CURRENCY_REGIONS[params.currency];
    }

    return new Intl.NumberFormat(region, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: minDecimal,
      maximumFractionDigits: maxDecimal
    }).format(value);
  }
}
