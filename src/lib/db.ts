export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  category: string;
  image_url: string;
  images: string;
  sizes: string;
  stock_status: string;
  featured: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  google_id: string | null;
  password_hash: string | null;
  role: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: string;
  items: string;
  subtotal: number;
  total: number;
  status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string;
}

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
  exec: (query: string) => Promise<D1ExecResult>;
  batch: <T = unknown>(statements: D1PreparedStatement[]) => Promise<D1Result<T>[]>;
  dump: () => Promise<ArrayBuffer>;
};

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  run: <T = unknown>() => Promise<D1Result<T>>;
  all: <T = unknown>() => Promise<D1Result<T>>;
  raw: <T = unknown[]>() => Promise<T[]>;
};

type D1Result<T> = {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
};

type D1ExecResult = {
  count: number;
  duration: number;
};

export async function getProducts(db: D1Database): Promise<Product[]> {
  const result = await db.prepare("SELECT * FROM products ORDER BY featured DESC, created_at DESC").all<Product>();
  return result.results;
}

export async function getFeaturedProducts(db: D1Database): Promise<Product[]> {
  const result = await db.prepare("SELECT * FROM products WHERE featured = 1 ORDER BY created_at DESC").all<Product>();
  return result.results;
}

export async function getProductBySlug(db: D1Database, slug: string): Promise<Product | null> {
  return db.prepare("SELECT * FROM products WHERE slug = ?").bind(slug).first<Product>();
}

export async function getProductById(db: D1Database, id: string): Promise<Product | null> {
  return db.prepare("SELECT * FROM products WHERE id = ?").bind(id).first<Product>();
}

export async function createProduct(db: D1Database, product: Omit<Product, "created_at" | "updated_at">): Promise<void> {
  await db
    .prepare(
      `INSERT INTO products (id, name, slug, description, price, sale_price, category, image_url, images, sizes, stock_status, featured, meta_title, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      product.id,
      product.name,
      product.slug,
      product.description,
      product.price,
      product.sale_price,
      product.category,
      product.image_url,
      product.images,
      product.sizes,
      product.stock_status,
      product.featured,
      product.meta_title,
      product.meta_description
    )
    .run();
}

export async function updateProduct(db: D1Database, id: string, updates: Partial<Product>): Promise<void> {
  const fields = Object.keys(updates)
    .filter((k) => k !== "id" && k !== "created_at")
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.keys(updates)
    .filter((k) => k !== "id" && k !== "created_at")
    .map((k) => updates[k as keyof Product]);
  await db
    .prepare(`UPDATE products SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteProduct(db: D1Database, id: string): Promise<void> {
  await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
}

export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  return db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<User>();
}

export async function getUserById(db: D1Database, id: string): Promise<User | null> {
  return db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<User>();
}

export async function getUserByGoogleId(db: D1Database, googleId: string): Promise<User | null> {
  return db.prepare("SELECT * FROM users WHERE google_id = ?").bind(googleId).first<User>();
}

export async function createUser(db: D1Database, user: Omit<User, "created_at">): Promise<void> {
  await db
    .prepare(
      `INSERT INTO users (id, email, name, avatar_url, google_id, password_hash, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(user.id, user.email, user.name, user.avatar_url, user.google_id, user.password_hash, user.role)
    .run();
}

export async function upsertGoogleUser(
  db: D1Database,
  googleId: string,
  email: string,
  name: string,
  avatarUrl: string,
  userId: string
): Promise<User> {
  const existing = await getUserByGoogleId(db, googleId);
  if (existing) {
    await db
      .prepare("UPDATE users SET name = ?, avatar_url = ?, updated_at = datetime('now') WHERE google_id = ?")
      .bind(name, avatarUrl, googleId)
      .run();
    return { ...existing, name, avatar_url: avatarUrl };
  }
  const emailUser = await getUserByEmail(db, email);
  if (emailUser) {
    await db
      .prepare("UPDATE users SET google_id = ?, name = ?, avatar_url = ?, updated_at = datetime('now') WHERE email = ?")
      .bind(googleId, name, avatarUrl, email)
      .run();
    return { ...emailUser, google_id: googleId, name, avatar_url: avatarUrl };
  }
  const newUser: Omit<User, "created_at"> = {
    id: userId,
    email,
    name,
    avatar_url: avatarUrl,
    google_id: googleId,
    password_hash: null,
    role: "customer",
  };
  await createUser(db, newUser);
  return { ...newUser, created_at: new Date().toISOString() };
}

export async function createOrder(db: D1Database, order: Omit<Order, "updated_at">): Promise<void> {
  await db
    .prepare(
      `INSERT INTO orders (id, user_id, customer_email, customer_name, customer_phone, shipping_address, items, subtotal, total, status, razorpay_order_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      order.id,
      order.user_id,
      order.customer_email,
      order.customer_name,
      order.customer_phone,
      order.shipping_address,
      order.items,
      order.subtotal,
      order.total,
      order.status,
      order.razorpay_order_id,
      order.created_at
    )
    .run();
}

export async function updateOrderPayment(
  db: D1Database,
  razorpayOrderId: string,
  paymentId: string,
  signature: string
): Promise<void> {
  await db
    .prepare(
      `UPDATE orders SET status = 'paid', razorpay_payment_id = ?, razorpay_signature = ?, updated_at = datetime('now')
       WHERE razorpay_order_id = ?`
    )
    .bind(paymentId, signature, razorpayOrderId)
    .run();
}

export async function getOrders(db: D1Database): Promise<Order[]> {
  const result = await db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all<Order>();
  return result.results;
}

export async function getOrderById(db: D1Database, id: string): Promise<Order | null> {
  return db.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first<Order>();
}

export async function getPage(db: D1Database, slug: string): Promise<Page | null> {
  return db.prepare("SELECT * FROM pages WHERE slug = ?").bind(slug).first<Page>();
}

export async function getPages(db: D1Database): Promise<Page[]> {
  const result = await db.prepare("SELECT * FROM pages ORDER BY slug").all<Page>();
  return result.results;
}

export async function updatePage(db: D1Database, slug: string, updates: Partial<Page>): Promise<void> {
  await db
    .prepare(
      `UPDATE pages SET title = ?, content = ?, meta_title = ?, meta_description = ?, updated_at = datetime('now')
       WHERE slug = ?`
    )
    .bind(updates.title, updates.content, updates.meta_title, updates.meta_description, slug)
    .run();
}
