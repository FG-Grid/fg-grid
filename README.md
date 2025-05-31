# FG-Grid

Build v0.7.10

FG-Grid - Open source data grid library for building enterprise applications

<div align="center">
    <picture>
      <img width="100%" alt="FG-Grid" src="https://www.fg-grid.com/img/car-dealer-store-2.png"/>
    </picture>
</div>

## Install

#### *npm*
```
npm install fg-grid
```

### React
```
npm install fg-grid fg-grid-react-wrapper
```

#### *CDN*
```
https://cdn.jsdelivr.net/npm/fg-grid/styles/fg-grid.min.css
https://cdn.jsdelivr.net/npm/fg-grid/dist/fg-grid.min.js
```

## Quick Start
Include a reference to the FG-Grid library

```html
<link href="https://cdn.jsdelivr.net/npm/fg-grid/styles/fg-grid.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/fg-grid/dist/fg-grid.min.js"></script>
```
The `Grid` object is now accessible. Happy griding!
```html
<div id="grid"></div>
<script>
document.addEventListener('DOMContentLoaded', () => {  
  new Grid({
    renderTo: 'grid',
    width: 300,
    height: 200,
    data: [
      { brand: 'Lexus', model: 'RX 350', price: 60000, year: 2021 },
      { brand: 'Toyota', model: 'Land Cruiser Prado', price: 70000, year: 2022 },
      { brand: 'Volkswagen', model: 'Tiguan', price: 38000, year: 2021 },
      { brand: 'Volkswagen', model: 'Teramont', price: 60000, year: 2023 },
      { brand: 'Mazda', model: 'CX-9', price: 45000, year: 2023 },
      { brand: 'Honda', model: 'Pilot', price: 45000, year: 2023 },
      { brand: 'Kia', model: 'Sorento', price: 40000, year: 2023 },
    ],  
    columns: [{
      index: 'brand',
      title: 'Brand',
      type: 'string'
    },{
      index: 'model',
      title: 'Model',
      type: 'string'
    },{
      index: 'price',
      title: 'Price',
      type: 'currency'
    },{
      index: 'year',
      title: 'Year',
      type: 'number'
    }]
  });
});
</script>
```

## Support
If you need any assistance or would like to report any bugs found in FancyGrid, please contact us at support@fancygrid.com
