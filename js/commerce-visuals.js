/* ShopDev concept screens: original, code-built commerce UI studies. */
(() => {
  const sequence = document.querySelector('.story-sequence--concepts .story-scenes');
  if (!sequence) return;

  const image = (name, alt = '') => `<img src="assets/images/concepts/${name}.webp" alt="${alt}" loading="lazy" width="1024" height="1024">`;
  const head = (brand, nav, utility = 'SEARCH / BAG 0') => `<header class="demo-store-head"><b>${brand}</b><nav>${nav}</nav><span>${utility}</span></header>`;
  const foot = (number, text) => `<footer class="demo-store-foot"><span>SHOPDEV / CONCEPT ${number}</span><span>${text}</span></footer>`;
  const button = (label, detail = '') => `<button type="button" tabindex="-1">${label}<span>${detail}</span></button>`;
  const screens = [
    `<div class="commerce-demo commerce-demo--fashion">${head('FORM / STUDIO', 'NEW &nbsp; SHOP &nbsp; STORY')}<div class="demo-collection-title"><div><small>SHOP / NEW SEASON</small><h4>Clothes, considered.</h4></div><span>18 PIECES&nbsp; / &nbsp;SORT: FEATURED</span></div><div class="demo-collection"><aside><small>FILTER BY</small><b>Category <i>−</i></b><span>All clothing</span><span>Outerwear</span><span>Everyday layers</span><b>Size <i>+</i></b><b>Colour <i>+</i></b><b>Price <i>+</i></b></aside><div class="demo-product-grid">${[['THE DAILY OVERSHIRT','concept-fashion-overshirt'],['RELAXED MERINO','concept-fashion-knit'],['WIDE-LEG TROUSER','concept-fashion-trousers']].map(([name,photo], i) => `<figure><div class="demo-photo demo-photo--fashion demo-photo--crop-${i + 1}">${image(photo, `${name.toLowerCase()} product concept photograph`)}</div><figcaption><span>${name}</span><b>$${[148,122,136][i]}</b><small>CHARCOAL / 3 SIZES</small></figcaption></figure>`).join('')}</div></div>${foot('01', 'COLLECTION / FILTERS / QUICK ADD')}</div>`,
    `<div class="commerce-demo commerce-demo--beauty">${head('STILL / SKIN', 'ROUTINE &nbsp; PRODUCTS &nbsp; OUR FORMULA')}<div class="demo-pdp"><div class="demo-pdp__photo">${image('concept-beauty','Skincare concept product photography')}<span>01 / DAILY RITUAL</span></div><div class="demo-pdp__details"><small>THE DAILY RITUAL / 30 ML</small><h4>Barrier<br>serum</h4><div class="demo-rating">★★★★★ &nbsp; PRODUCT NOTES</div><b class="demo-price">$42.00</b><p>Lightweight hydration, designed to sit comfortably in a daily routine.</p><label>FORMAT</label><div class="demo-choice"><i class="is-selected">30 ML</i><i>TRAVEL 10 ML</i></div><label>HOW OFTEN</label><div class="demo-choice"><i class="is-selected">ONE TIME</i><i>REPLENISH</i></div>${button('ADD TO BAG','$42')}<small class="demo-quiet">INGREDIENTS / HOW TO USE / DELIVERY</small></div></div>${foot('02', 'PRODUCT DETAIL / INGREDIENTS / SUBSCRIBE')}</div>`,
    `<div class="commerce-demo commerce-demo--wellness">${head('SLOW / RITUALS','START HERE &nbsp; BODY &nbsp; HOME','YOUR SET / 02')}<div class="demo-bundle"><div class="demo-bundle__photo">${image('concept-wellness','Wellness ritual product concept')}<span>THE EVENING EDIT / 01</span></div><div class="demo-bundle__builder"><small>BUILD YOUR EVENING SET</small><h4>Choose your<br>three essentials.</h4><div><span>01 / WIND-DOWN OIL</span><b>SELECTED</b></div><div><span>02 / BATH SOAK</span><b>ADD +</b></div><div><span>03 / SLEEP BALM</span><b>ADD +</b></div><section><span>DELIVERY</span><b>One time &nbsp; / &nbsp; Monthly</b></section><section><span>YOUR SET / 2 ITEMS</span><b>$68.00</b></section>${button('REVIEW YOUR SET')}<small class="demo-quiet">CHANGE OR PAUSE YOUR PLAN WHENEVER YOU NEED</small></div></div>${foot('03','BUNDLE BUILDER / SUBSCRIPTION / CART')}</div>`,
    `<div class="commerce-demo commerce-demo--home">${head('COMMON / HOME','LIVING &nbsp; TABLE &nbsp; OBJECTS')}<div class="demo-home-pdp"><div class="demo-home-pdp__photo">${image('concept-home','Homeware concept product styled in a natural setting')}<span>IN THE ROOM / 01</span></div><div><small>OBJECTS / VESSELS</small><h4>Form One<br>vessel</h4><b class="demo-price">$86</b><p>A sculptural form in a hand-finished mineral glaze.</p><label>FINISH / CHALK</label><div class="demo-swatches"><i class="is-selected"></i><i></i><i></i><span>CHALK / CLAY / INK</span></div><label>SIZE / MEDIUM</label>${button('ADD TO BAG','+$86')}<small class="demo-quiet">HEIGHT 24 CM / WIDTH 18 CM / CARE GUIDE</small></div></div>${foot('04','PRODUCT DETAIL / DIMENSIONS / FINISH')}</div>`,
    `<div class="commerce-demo commerce-demo--food">${head('OLIVA / PANTRY','OIL &nbsp; SETS &nbsp; RECIPES','BAG / 02')}<div class="demo-cart-scene"><div class="demo-pantry">${image('concept-food','Olive oil concept product photography')}<small>FROM THE GROVE / FIRST PRESS</small><h4>Good things<br>for the table.</h4><span>SHOP THE PANTRY</span></div><aside class="demo-cart"><div class="demo-cart__top"><b>Your bag</b><span>02 ITEMS</span></div><div class="demo-cart__line">${image('concept-food','Olive oil bottle concept')}<div><b>First Press / 500 ml</b><small>Quantity 01<br>Harvest / Early press</small></div><span>$34</span></div><div class="demo-cart__line demo-cart__line--mini"><i></i><div><b>Grove tasting set</b><small>Quantity 01 / Three bottles</small></div><span>$48</span></div><p>You are one step from complimentary delivery.</p><div class="demo-cart__subtotal"><span>Subtotal</span><b>$82.00</b></div>${button('CONTINUE TO CHECKOUT')}<small class="demo-quiet">DELIVERY / RETURNS / SECURE CHECKOUT</small></aside></div>${foot('05','BUNDLE / CART DRAWER / DELIVERY')}</div>`,
    `<div class="commerce-demo commerce-demo--jewelry">${head('ARCA / OBJECTS','NECKLACES &nbsp; RINGS &nbsp; STUDIO','WISHLIST / BAG 0')}<div class="demo-jewel-pdp"><div class="demo-jewel-pdp__photo">${image('concept-jewelry','Sculptural jewelry concept in brushed metal')}<span>OBJECT / 04 — DETAIL</span></div><div><small>THE EVERYDAY COLLECTION</small><h4>Arc cuff</h4><b class="demo-price">$118.00</b><div class="demo-rating">★★★★★ &nbsp; PRODUCT NOTES</div><label>FINISH / SELECT ONE</label><div class="demo-choice demo-choice--stack"><i class="is-selected">BRUSHED SILVER</i><i>WARM GOLD</i><i>BLACKENED</i></div><label>SIZE / ADJUSTABLE</label><p class="demo-size-note">A flexible fit designed to sit comfortably.</p>${button('ADD TO BAG')}<small class="demo-quiet">GIFT WRAP AVAILABLE / CARE INCLUDED</small></div></div>${foot('06','QUICK VIEW / VARIANTS / PRODUCT NOTES')}</div>`,
    `<div class="commerce-demo commerce-demo--sport">${head('ROAM / OUTDOOR','TRAIL &nbsp; RUN &nbsp; EQUIPMENT')}<div class="demo-sport-title"><small>GEAR / TRAIL SYSTEMS</small><h4>Pack for the long way.</h4><span>12 PRODUCTS / FILTERED BY: DAY PACK</span></div><div class="demo-sport-grid"><aside><b>ACTIVITY <i>−</i></b><span>Hiking &nbsp; ✓</span><span>Climbing</span><b>CAPACITY <i>−</i></b><span>18–30 L &nbsp; ✓</span><span>31–45 L</span><b>FEATURES <i>+</i></b><b>WEATHER <i>+</i></b></aside><div class="demo-sport-photo">${image('concept-outdoor','Technical outdoor product concept')}<span>TRAVERSE / 24 L</span></div><div class="demo-sport-specs"><small>PRODUCT SPECIFICATION</small><b>24 L</b><span>CAPACITY</span><b>Recycled shell</b><span>FABRIC</span><b>All day</b><span>FIT</span>${button('VIEW DETAILS')}</div></div>${foot('07','COLLECTION / FILTERS / SPECIFICATIONS')}</div>`,
    `<div class="commerce-demo commerce-demo--audio">${head('FIELD / AUDIO','HEADPHONES &nbsp; SPEAKERS &nbsp; SUPPORT','COMPARE / 02')}<div class="demo-audio-title"><small>FIND YOUR LISTENING SETUP</small><h4>Two ways to<br>hear more.</h4><span>COMPARE MODELS</span></div><div class="demo-audio-products"><div>${image('concept-electronics','Over-ear headphones concept')}<b>FIELD / ONE</b><span>Over-ear / Wireless</span><strong>$249</strong></div><div><i class="demo-earbuds"></i><b>FIELD / MINI</b><span>In-ear / Wireless</span><strong>$139</strong></div></div><table class="demo-compare-table"><thead><tr><th>DETAIL</th><th>ONE</th><th>MINI</th></tr></thead><tbody><tr><td>Noise control</td><td>Adaptive</td><td>Passive</td></tr><tr><td>Fit</td><td>Over-ear</td><td>In-ear</td></tr><tr><td>Best for</td><td>Long listening</td><td>On the move</td></tr></tbody></table>${foot('08','COMPARISON / COMPATIBILITY / ACCESSORIES')}</div>`,
    `<div class="commerce-demo commerce-demo--personal">${head('ARCA / MADE FOR YOU','OBJECTS &nbsp; PERSONALIZE &nbsp; STUDIO','STEP 03 / 04')}<div class="demo-personalizer"><div class="demo-personalizer__preview">${image('concept-jewelry','Personalized jewelry concept preview')}<span>LIVE PREVIEW / FINISH 02</span><b>AM</b></div><div class="demo-personalizer__options"><small>THE ARC PENDANT / BUILD YOURS</small><h4>A piece with<br>your mark.</h4><div><span>01 / CHOOSE METAL</span><b>BRUSHED SILVER &nbsp; ✓</b></div><div><span>02 / ADD YOUR INITIALS</span><b>A&nbsp; M</b></div><div><span>03 / PREVIEW</span><b>Ready to review</b></div>${button('ADD PERSONALIZED PIECE','$96')}<small class="demo-quiet">REVIEW YOUR DETAILS BEFORE ADDING TO BAG</small></div></div>${foot('09','CUSTOMIZER / LIVE PREVIEW / CART')}</div>`,
  ];

  sequence.querySelectorAll('[data-story-step]').forEach((step, index) => {
    const visual = step.querySelector('.story-scene__visual');
    if (!visual || !screens[index]) return;
    visual.classList.add('commerce-visual');
    visual.innerHTML = screens[index];
    if (index < 8) {
      step.dataset.storyTitle = [
        'Fashion collection concept', 'Beauty product detail concept', 'Wellness bundle concept',
        'Home product detail concept', 'Food cart concept', 'Jewelry product options concept',
        'Outdoor product filtering concept', 'Electronics comparison concept',
      ][index];
      const eyebrow = step.querySelector('.story-scene__eyebrow');
      const heading = step.querySelector('.story-scene__copy h3');
      const copy = step.querySelector('.story-scene__copy > p:not(.story-scene__eyebrow):not(.concept-spec)');
      const spec = step.querySelector('.concept-spec');
      const content = [
        ['01 / FASHION / CONCEPT','Browse the whole collection.','Editorial merchandising, filters and fit context make a considered range easier to explore.','COLLECTION / FILTERS / QUICK ADD'],
        ['02 / BEAUTY / CONCEPT','Every product detail, in reach.','Ingredients, routine and replenishment options sit beside the product and purchase decision.','PRODUCT DETAIL / INGREDIENTS / SUBSCRIBE'],
        ['03 / WELLNESS / CONCEPT','Build a ritual that fits.','A guided set builder explains what is included and keeps delivery cadence clear.','BUNDLE BUILDER / SUBSCRIPTION / CART'],
        ['04 / HOME / CONCEPT','Show how it fits at home.','Materials, dimensions and finish choices help a considered object make sense in its space.','PRODUCT DETAIL / DIMENSIONS / FINISH'],
        ['05 / FOOD / CONCEPT','Make the next step feel easy.','Bundle contents, quantities and delivery timing stay visible in a focused cart review.','BUNDLE / CART DRAWER / DELIVERY'],
        ['06 / JEWELRY / CONCEPT','Let the details do the work.','Finish, fit and gifting information make a considered piece easier to choose.','QUICK VIEW / VARIANTS / PRODUCT NOTES'],
        ['07 / OUTDOOR / CONCEPT','Find the right kit, faster.','Activity, fit and technical details turn a broad range into a useful shortlist.','COLLECTION / FILTERS / SPECIFICATIONS'],
        ['08 / ELECTRONICS / CONCEPT','Compare what matters.','Compatibility and product differences help customers select an audio setup.','COMPARISON / COMPATIBILITY / ACCESSORIES'],
      ][index];
      if (eyebrow) eyebrow.textContent = content[0];
      if (heading) heading.textContent = content[1];
      if (copy) copy.textContent = content[2];
      if (spec) spec.textContent = content[3];
    }
  });

  const personalized = document.createElement('article');
  personalized.className = 'story-scene';
  personalized.dataset.storyStep = '';
  personalized.dataset.storyTitle = 'Personalized product builder concept';
  personalized.innerHTML = `<div class="story-scene__copy"><p class="story-scene__eyebrow">09 / PERSONALIZED / CONCEPT</p><h3>Make the product yours.</h3><p>A guided builder keeps personalization, live preview and final cart details connected.</p><p class="concept-spec">CUSTOMIZER / LIVE PREVIEW / CART</p></div><div class="story-scene__visual commerce-visual" aria-hidden="true">${screens[8]}</div>`;
  sequence.append(personalized);

  const sequenceRoot = sequence.closest('.story-sequence');
  const progress = sequenceRoot?.querySelector('.story-progress');
  const count = sequence.querySelectorAll('[data-story-step]').length;
  if (progress) progress.setAttribute('aria-valuemax', String(count));
  const current = sequenceRoot?.querySelector('[data-story-current]');
  if (current) current.textContent = `01 / ${String(count).padStart(2, '0')}`;
})();
