document.addEventListener("alpine:init", () => {
  Alpine.store("cart", {
    items: [],
    open: false,

    init() {
      try {
        const saved = localStorage.getItem("intru_cart");
        if (saved) {
          this.items = JSON.parse(saved);
        }
      } catch {
        this.items = [];
      }
    },

    save() {
      try {
        localStorage.setItem("intru_cart", JSON.stringify(this.items));
      } catch {}
    },

    add(product, size, qty = 1) {
      const key = `${product.id}-${size}`;
      const existing = this.items.find((i) => i.key === key);
      if (existing) {
        existing.qty += qty;
      } else {
        this.items.push({
          key,
          id: product.id,
          name: product.name,
          price: product.sale_price || product.price,
          image: product.image_url,
          size,
          qty,
        });
      }
      this.save();
      this.open = true;
    },

    remove(key) {
      this.items = this.items.filter((i) => i.key !== key);
      this.save();
    },

    updateQty(key, qty) {
      const item = this.items.find((i) => i.key === key);
      if (item) {
        if (qty <= 0) {
          this.remove(key);
        } else {
          item.qty = qty;
          this.save();
        }
      }
    },

    clear() {
      this.items = [];
      this.save();
    },

    get count() {
      return this.items.reduce((sum, i) => sum + i.qty, 0);
    },

    get subtotal() {
      return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },

    get total() {
      return this.subtotal >= 999 ? this.subtotal : this.subtotal + 99;
    },

    formatPrice(amount) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      }).format(amount);
    },
  });
});
