const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The regex will find the add-to-cart button and move it to the end of product-card__info
html = html.replace(
  /<button class="product-card__add-btn add-to-cart-btn"([^>]+)>Add to Cart<\/button>(\s*)<\/div>(\s*)<div class="product-card__info">/g,
  '$2</div>$3<div class="product-card__info"><button class="product-card__add-btn-static add-to-cart-btn" $1>Add to Cart</button>'
);

fs.writeFileSync('index.html', html);
