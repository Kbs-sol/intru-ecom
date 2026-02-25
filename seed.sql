-- intru.in Seed Data

-- Insert 6 products
INSERT OR IGNORE INTO products (id, name, slug, description, price, sale_price, category, image_url, images, sizes, stock_status, featured, meta_title, meta_description) VALUES
(
  'prod_001',
  'Intru Classic Tee',
  'intru-classic-tee',
  'Our signature heavyweight tee crafted from 100% premium combed cotton. Structured fit, minimal design, maximum presence. Built to outlast fast fashion with reinforced seams and pre-shrunk fabric.',
  1299,
  999,
  'tshirts',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80","https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80"]',
  '["S","M","L","XL","XXL"]',
  'in_stock',
  1,
  'Intru Classic Tee - Premium Heavyweight Cotton T-Shirt | intru.in',
  'Shop the Intru Classic Tee. 100% premium combed cotton, structured fit, built to last. Free shipping on prepaid orders.'
),
(
  'prod_002',
  'Intru Oversized Drop',
  'intru-oversized-drop',
  'The ultimate oversized silhouette. Dropped shoulders, extended hem, garment-washed for that lived-in feel right out of the box. Wear it oversized, wear it layered — it is built for both.',
  1599,
  1299,
  'tshirts',
  'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
  '["https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80","https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"]',
  '["S","M","L","XL","XXL"]',
  'in_stock',
  1,
  'Intru Oversized Drop - Garment-Washed Oversized Tee | intru.in',
  'The Intru Oversized Drop tee. Dropped shoulders, garment-washed, extended hem. Your new everyday staple.'
),
(
  'prod_003',
  'Intru Essential Hoodie',
  'intru-essential-hoodie',
  'Heavyweight 400GSM fleece hoodie with a clean, minimal front. Ribbed cuffs and hem, kangaroo pocket, and an adjustable drawstring hood. The hoodie you will reach for every single day.',
  2499,
  1999,
  'hoodies',
  'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
  '["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80","https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80"]',
  '["S","M","L","XL","XXL"]',
  'in_stock',
  1,
  'Intru Essential Hoodie - 400GSM Heavyweight Fleece | intru.in',
  'Intru Essential Hoodie — 400GSM heavyweight fleece, minimal design, built for everyday wear. Shop now.'
),
(
  'prod_004',
  'Intru Cargo Pants',
  'intru-cargo-pants',
  'Functional meets minimal. Six-pocket cargo pants in durable ripstop fabric with an adjustable waistband and tapered leg. Designed for movement, styled for everywhere.',
  2999,
  2499,
  'bottoms',
  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
  '["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"]',
  '["S","M","L","XL","XXL"]',
  'in_stock',
  0,
  'Intru Cargo Pants - Minimal Ripstop Cargo | intru.in',
  'Intru Cargo Pants in durable ripstop. Six pockets, tapered leg, adjustable waistband. Style meets function.'
),
(
  'prod_005',
  'Intru Zip-Up Track',
  'intru-zipup-track',
  'A modern take on the classic track jacket. Full-zip with ribbed trim, side pockets, and clean minimal branding. Layer it over everything — from tees to hoodies.',
  2199,
  1799,
  'jackets',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
  '["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80","https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80"]',
  '["S","M","L","XL","XXL"]',
  'in_stock',
  0,
  'Intru Zip-Up Track Jacket - Minimal Track Jacket | intru.in',
  'Intru Zip-Up Track Jacket. Clean minimal design, full-zip, ribbed trim. The perfect layer for any outfit.'
),
(
  'prod_006',
  'Intru Jogger Set',
  'intru-jogger-set',
  'Matching jogger set in 320GSM French terry. The hoodie and joggers are designed to be worn together or separately. Tapered ankle with ribbed cuffs, elastic drawstring waist.',
  3499,
  2999,
  'sets',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80","https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"]',
  '["S","M","L","XL","XXL"]',
  'in_stock',
  0,
  'Intru Jogger Set - 320GSM French Terry Co-ord Set | intru.in',
  'Intru Jogger Set in 320GSM French terry. Wear together or separately. Your new weekend uniform.'
);

-- Insert legal pages
INSERT OR IGNORE INTO pages (id, slug, title, content, meta_title, meta_description) VALUES
(
  'page_privacy',
  'privacy',
  'Privacy Policy',
  '<h2>Privacy Policy</h2>
<p>Last updated: January 2025</p>
<p>At intru.in, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
<h3>Information We Collect</h3>
<p>We collect information you provide directly to us, such as your name, email address, shipping address, and payment information when you make a purchase. We also collect information automatically when you use our website, including your IP address, browser type, and pages visited.</p>
<h3>How We Use Your Information</h3>
<p>We use the information we collect to process your orders, send you order confirmations and shipping updates, respond to your questions and requests, send you promotional communications (with your consent), and improve our website and services.</p>
<h3>Information Sharing</h3>
<p>We do not sell, trade, or otherwise transfer your personal information to third parties, except to trusted partners who assist us in operating our website and conducting our business (such as payment processors and shipping partners), subject to confidentiality agreements.</p>
<h3>Payment Security</h3>
<p>All payment transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. We do not store your complete card information on our servers.</p>
<h3>Cookies</h3>
<p>We use cookies to enhance your experience on our site, including to keep track of your shopping cart. You can disable cookies in your browser settings, but this may affect the functionality of our website.</p>
<h3>Your Rights</h3>
<p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@intru.in.</p>
<h3>Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at privacy@intru.in.</p>',
  'Privacy Policy | intru.in',
  'Read intru.in privacy policy to understand how we collect, use, and protect your personal information.'
),
(
  'page_terms',
  'terms',
  'Terms & Conditions',
  '<h2>Terms & Conditions</h2>
<p>Last updated: January 2025</p>
<p>Welcome to intru.in. By accessing or using our website, you agree to be bound by these Terms and Conditions.</p>
<h3>Use of Website</h3>
<p>You must be at least 18 years old to use this website. You agree to use this website only for lawful purposes and in a manner consistent with all applicable laws and regulations.</p>
<h3>Products and Pricing</h3>
<p>We reserve the right to modify prices at any time. All prices are in Indian Rupees (INR). We make every effort to display accurate product information, but errors may occur. We reserve the right to cancel orders placed at incorrect prices.</p>
<h3>Order Acceptance</h3>
<p>Your order is an offer to buy from us. We reserve the right to refuse or cancel any order for reasons including product unavailability, pricing errors, or suspected fraud. Order confirmation does not guarantee acceptance.</p>
<h3>Intellectual Property</h3>
<p>All content on this website, including logos, images, and text, is the property of intru.in and is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute any content without our express written permission.</p>
<h3>Limitation of Liability</h3>
<p>intru.in shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or our products.</p>
<h3>Governing Law</h3>
<p>These Terms and Conditions are governed by the laws of India. Any disputes shall be resolved in the courts of jurisdiction where intru.in is registered.</p>
<h3>Contact Us</h3>
<p>For questions about these Terms, contact us at legal@intru.in.</p>',
  'Terms & Conditions | intru.in',
  'Read intru.in terms and conditions for website use, purchases, and our policies.'
),
(
  'page_returns',
  'returns',
  'Returns & Exchanges',
  '<h2>Returns & Exchanges</h2>
<p>We want you to love your intru pieces. If you are not completely satisfied, we are here to help.</p>
<h3>Return Policy</h3>
<p>We accept returns within 7 days of delivery for unused items in their original condition with tags attached. Items must be unworn, unwashed, and free from any damage.</p>
<h3>How to Initiate a Return</h3>
<p>1. Email us at returns@intru.in with your order number and reason for return.<br>2. We will send you a return authorization and instructions within 24-48 hours.<br>3. Pack the item securely and ship it to the address provided.<br>4. Once we receive and inspect the item, we will process your refund within 5-7 business days.</p>
<h3>Exchange Policy</h3>
<p>We offer exchanges for different sizes within 7 days of delivery, subject to availability. To exchange, follow the same process as returns and specify the size you would like instead.</p>
<h3>Refunds</h3>
<p>Approved refunds will be credited to the original payment method within 5-7 business days after we receive the returned item. Shipping charges are non-refundable unless the item was defective or we made an error.</p>
<h3>Non-Returnable Items</h3>
<p>Sale items, items marked as final sale, and items that have been worn, washed, or damaged by the customer are not eligible for return or exchange.</p>
<h3>Defective Items</h3>
<p>If you receive a defective or incorrect item, please contact us immediately at returns@intru.in with photos. We will arrange a replacement or full refund at no additional cost.</p>',
  'Returns & Exchanges Policy | intru.in',
  'Learn about intru.in return and exchange policy. 7-day returns on unworn items. Easy process.'
),
(
  'page_shipping',
  'shipping',
  'Shipping Policy',
  '<h2>Shipping Policy</h2>
<p>We ship all across India. Here is everything you need to know about our shipping process.</p>
<h3>Processing Time</h3>
<p>Orders are processed within 1-2 business days. You will receive an email with tracking information once your order has been shipped.</p>
<h3>Delivery Time</h3>
<p>Standard delivery: 5-7 business days<br>Express delivery: 2-3 business days (additional charges apply)</p>
<h3>Shipping Charges</h3>
<p>Free shipping on all prepaid orders above ₹999.<br>For orders below ₹999, a flat shipping fee of ₹99 applies.<br>Cash on Delivery (COD) is available with an additional handling fee of ₹50.</p>
<h3>Order Tracking</h3>
<p>Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order on our logistics partner website.</p>
<h3>Failed Delivery</h3>
<p>If a delivery attempt fails, our courier partner will make up to 2 more attempts. After that, the order will be returned to us. In such cases, please contact us to reschedule delivery.</p>
<h3>Contact Us</h3>
<p>For shipping queries, contact us at shipping@intru.in or WhatsApp us at +91-XXXXXXXXXX.</p>',
  'Shipping Policy | intru.in',
  'intru.in shipping policy. Free shipping on prepaid orders above ₹999. Pan-India delivery in 5-7 days.'
);

-- Insert default admin user (password: intru@27)
-- This hash is generated using PBKDF2-SHA256, will be replaced at first login setup
INSERT OR IGNORE INTO admin_users (id, email, password_hash) VALUES
('admin_001', 'admin@intru.in', 'PBKDF2_PLACEHOLDER');
