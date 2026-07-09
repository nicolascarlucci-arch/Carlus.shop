// Regression test for a whole class of bug: Astro's view-transition router
// (astro:transitions / ClientRouter) dedupes identical inline <script>
// content across client-side navigations and only executes it once per
// session. Any page script that sets up interactivity at the top level
// (instead of inside an `astro:page-load` listener) goes dead the second
// time its page — or a page with byte-identical script content, like every
// product detail page — is visited in the same session.
//
// Run with the dev server up: `npm run dev` in one terminal, then
// `node test-navigation.mjs` (or `npm run test:nav`) in another.
//
// This isn't a general-purpose e2e suite — it exists specifically to catch
// regressions of this one bug shape across every page that has one.

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const results = [];

function check(label, ok) {
  results.push({ label, ok });
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${label}`);
}

const browser = await chromium.launch();

// --- Desktop-flow checks: product pages, cart, contact form ---
{
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('Failed to fetch')) errors.push(msg.text());
  });

  // Quantity buttons and add-to-cart must work after navigating from one
  // product detail page to another (not just on the first product page
  // visited in the session).
  await page.goto(`${BASE}/produkte/uvsu-shaker`, { waitUntil: 'networkidle' });
  await page.click('a[href="/produkte"]');
  await page.waitForURL('**/produkte');
  await page.click('a[href="/produkte/laufweste"]');
  await page.waitForURL('**/produkte/laufweste');
  await page.waitForTimeout(300);

  const qtyBefore = await page.inputValue('#quantity-input');
  await page.click('#qty-plus');
  await page.waitForTimeout(150);
  const qtyAfter = await page.inputValue('#quantity-input');
  check('product page: qty + button works on 2nd product page visited', qtyBefore !== qtyAfter);

  await page.click('#add-to-cart-btn');
  await page.waitForTimeout(300);
  let cart = await page.evaluate(() => sessionStorage.getItem('carlus_cart'));
  check('product page: add-to-cart works on 2nd product page visited', cart && cart !== '[]');

  // Warenkorb must render and stay interactive on a *second* visit.
  await page.click('a[href="/warenkorb"]');
  await page.waitForURL('**/warenkorb');
  await page.waitForTimeout(300);
  let itemCount = await page.locator('#cart-items > *').count();
  check('warenkorb: renders items on 1st visit', itemCount > 0);

  await page.click('a[href="/produkte"]');
  await page.waitForURL('**/produkte');
  await page.click('a[href="/warenkorb"]');
  await page.waitForURL('**/warenkorb');
  await page.waitForTimeout(300);
  itemCount = await page.locator('#cart-items > *').count();
  check('warenkorb: renders items on 2nd visit', itemCount > 0);

  const qtyText1 = await page.locator('[data-bind="qty"]').first().textContent();
  await page.click('[data-action="inc"]');
  await page.waitForTimeout(200);
  const qtyText2 = await page.locator('[data-bind="qty"]').first().textContent();
  check('warenkorb: qty + button works on 2nd visit', qtyText1 !== qtyText2);

  // Header cart badge must reflect reality after several navigations
  // (allow a brief async settle — this is not the bug we're guarding, it's
  // inherent event-listener latency).
  await page.click('a[href="/ratgeber"]');
  await page.waitForURL('**/ratgeber');
  await page.click('a[href="/kontakt"]');
  await page.waitForURL('**/kontakt');
  await page.waitForTimeout(300);
  const cartRaw = await page.evaluate(() => sessionStorage.getItem('carlus_cart'));
  const expectedCount = String(JSON.parse(cartRaw).reduce((s, i) => s + i.quantity, 0));
  const badgeText = await page.locator('#cart-count').textContent();
  check(`header: cart badge correct after several navigations (expected ${expectedCount})`, badgeText === expectedCount);

  // Kontakt form must submit on a second visit to the page in one session.
  await page.route('**/api/kontakt', (route) => route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }));
  await page.click('a[href="/versand"]');
  await page.waitForURL('**/versand');
  await page.click('a[href="/kontakt"]');
  await page.waitForURL('**/kontakt');
  await page.waitForTimeout(200);
  await page.fill('#name', 'Test');
  await page.fill('#email', 'test@example.com');
  await page.fill('#message', 'Testnachricht');
  await page.click('#contact-form button[type=submit]');
  await page.waitForTimeout(300);
  check('kontakt: form submits on 2nd visit to the page', await page.locator('#form-success').isVisible());

  // checkout/erfolg must clear the cart every time it's reached, not just
  // the first — but must NOT clear the cart on unrelated navigations
  // afterwards (that was a regression introduced while fixing this).
  await page.goto(`${BASE}/produkte/laufweste`, { waitUntil: 'networkidle' });
  await page.click('#add-to-cart-btn');
  await page.waitForTimeout(200);
  await page.goto(`${BASE}/checkout/erfolg`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
  let cartAfter = await page.evaluate(() => sessionStorage.getItem('carlus_cart'));
  check('checkout/erfolg: clears cart on 1st visit', cartAfter === '[]');

  await page.click('a[href="/produkte"]');
  await page.waitForURL('**/produkte');
  await page.click('a[href="/produkte/laufweste"]');
  await page.waitForURL('**/produkte/laufweste');
  await page.waitForTimeout(200);
  await page.click('#add-to-cart-btn');
  await page.waitForTimeout(200);
  cartAfter = await page.evaluate(() => sessionStorage.getItem('carlus_cart'));
  check('checkout/erfolg: does NOT clear cart on unrelated navigation after a visit', cartAfter && cartAfter !== '[]');

  check('desktop flow: no console/page errors', errors.length === 0);
  if (errors.length) console.log(errors.map((e) => '  ' + e).join('\n'));

  await page.close();
}

// --- Mobile menu across client-side navigations ---
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  async function toggleWorks() {
    const before = await page.locator('#menu-toggle').getAttribute('aria-expanded');
    await page.click('#menu-toggle');
    await page.waitForTimeout(150);
    const after = await page.locator('#menu-toggle').getAttribute('aria-expanded');
    return before !== after;
  }

  check('mobile menu: toggle works on 1st page', await toggleWorks());

  for (const href of ['/ratgeber', '/produkte', '/kontakt']) {
    await page.click(`#mobile-menu a[href="${href}"]`);
    await page.waitForURL(`**${href}`);
    await page.waitForTimeout(200);
    check(`mobile menu: toggle works after client-side nav to ${href}`, await toggleWorks());
  }

  await page.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) {
  console.log('\nFailed checks:');
  for (const f of failed) console.log(`  - ${f.label}`);
  process.exit(1);
}
