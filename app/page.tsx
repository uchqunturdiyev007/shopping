"use client";

import React, { useMemo, useState } from "react";

type Variant = {
  id: string;
  colorName: string; // masalan: "Oq"
  colorHex: string; // UI uchun
  price: number; // so'm
  image: string; // /01.jpg kabi (public ichida)
};

type Product = {
  id: string;
  name: string;
  badge?: string;
  variants: Variant[];
};

function formatUZS(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Page() {
  const products: Product[] = useMemo(
    () => [
      {
        id: "onc-01",
        name: "Onclod Runner 01",
        badge: "Top sotuv",
        variants: [
          { id: "onc-01-w", colorName: "Oppoq", colorHex: "#ffffff", price: 890000, image: "/02.jpg" },
          { id: "onc-01-b", colorName: "Qora", colorHex: "#111827", price: 890000, image: "/04.jpg" },
          { id: "onc-01-g", colorName: "Kulrang", colorHex: "#9CA3AF", price: 910000, image: "/01.jpg" },
        ],
      },
      {
        id: "onc-02",
        name: "Onclod Urban 02",
        badge: "Yangi",
        variants: [
          { id: "onc-02-w", colorName: "Sal oq", colorHex: "#ffffff", price: 950000, image: "/03.jpg" },
          { id: "onc-02-bl", colorName: "Ko'k", colorHex: "#00008B", price: 970000, image: "/06.jpg" },
          { id: "onc-02-b", colorName: "Qora", colorHex: "#111827", price: 950000, image: "/04.jpg" },
        ],
      },
      {
        id: "onc-03",
        name: "Onclod Street 03",
        variants: [
          { id: "onc-03-b", colorName: "Qora", colorHex: "#111827", price: 820000, image: "/01.jpg" },
          { id: "onc-03-r", colorName: "Qizil", colorHex: "#DC2626", price: 840000, image: "/02.jpg" },
          { id: "onc-03-w", colorName: "Oq", colorHex: "#ffffff", price: 820000, image: "/03.jpg" },
        ],
      },
      {
        id: "onc-04",
        name: "Onclod Sport 04",
        variants: [
          { id: "onc-04-g", colorName: "Yashil", colorHex: "#16A34A", price: 990000, image: "/04.jpg" },
          { id: "onc-04-b", colorName: "Qora", colorHex: "#111827", price: 990000, image: "/05.jpg" },
          { id: "onc-04-w", colorName: "Oq", colorHex: "#ffffff", price: 1010000, image: "/06.jpg" },
        ],
      },
      {
        id: "onc-05",
        name: "Onclod Classic 05",
        variants: [
          { id: "onc-05-w", colorName: "Oq", colorHex: "#ffffff", price: 780000, image: "/01.jpg" },
          { id: "onc-05-br", colorName: "Jigarrang", colorHex: "#92400E", price: 800000, image: "/02.jpg" },
          { id: "onc-05-b", colorName: "Qora", colorHex: "#111827", price: 780000, image: "/03.jpg" },
        ],
      },
      {
        id: "onc-06",
        name: "Onclod Air 06",
        badge: "Chegirma",
        variants: [
          { id: "onc-06-w", colorName: "Oq", colorHex: "#ffffff", price: 870000, image: "/04.jpg" },
          { id: "onc-06-p", colorName: "Pushti", colorHex: "#F472B6", price: 870000, image: "/05.jpg" },
          { id: "onc-06-b", colorName: "Qora", colorHex: "#111827", price: 870000, image: "/06.jpg" },
        ],
      },
    ],
    []
  );

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const p of products) init[p.id] = p.variants[0]?.id ?? "";
    return init;
  });

  const [cart, setCart] = useState<Record<string, number>>({});
  const [openProductId, setOpenProductId] = useState<string | null>(null);

  const openProduct = products.find((p) => p.id === openProductId) ?? null;

  const cartItems = useMemo(() => {
    const items: Array<{ product: Product; variant: Variant; qty: number }> = [];
    for (const [variantId, qty] of Object.entries(cart)) {
      if (!qty) continue;
      const product = products.find((p) => p.variants.some((v) => v.id === variantId));
      if (!product) continue;
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) continue;
      items.push({ product, variant, qty });
    }
    return items;
  }, [cart, products]);

  const total = useMemo(() => {
    return cartItems.reduce((sum, it) => sum + it.variant.price * it.qty, 0);
  }, [cartItems]);

  function getSelectedVariant(p: Product) {
    const vid = selected[p.id];
    return p.variants.find((v) => v.id === vid) ?? p.variants[0];
  }

  function addToCart(p: Product) {
    const v = getSelectedVariant(p);
    setCart((prev) => ({ ...prev, [v.id]: (prev[v.id] ?? 0) + 1 }));

    const el = document.getElementById("order-form");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function changeQty(variantId: string, delta: number) {
    setCart((prev) => {
      const next = { ...prev };
      const cur = next[variantId] ?? 0;
      const val = cur + delta;
      if (val <= 0) delete next[variantId];
      else next[variantId] = val;
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-[#06162b] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06162b]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-yellow-400/90" />
            <div>
              <p className="text-sm text-white/70">Onclod krasofkalar</p>
              <h1 className="text-base font-semibold leading-tight">Sotuv landing</h1>
            </div>
          </div>

          <a
            href="#order-form"
            className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:opacity-90"
          >
            Buyurtma berish
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <p className="text-sm text-white/70">Tez yetkazish • Rang tanlash • Buyurtma forma</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
            Onclod krasofkalarini onlayn sotish uchun tayyor landing.
          </h2>
          <p className="mt-5 max-w-2xl text-white/75">
            6 tur mahsulot. Har birida ranglar, narxlar. Ko‘z ikon orqali katta ko‘rish. Karzinka bosilganda buyurtma
            formasiga o‘tadi.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-medium text-white hover:bg-white/10"
            >
              Mahsulotlarni ko‘rish
            </a>
            <a
              href="#order-form"
              className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-medium text-black hover:opacity-90"
            >
              Buyurtma berish
            </a>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-6 pb-14">
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-semibold">Mahsulotlar</h3>
          <p className="text-sm text-white/60">
            Jami: {cartItems.length ? cartItems.reduce((s, i) => s + i.qty, 0) : 0} dona
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const v = getSelectedVariant(p);
            return (
              <div
                key={p.id}
                className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.07]"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <div className="aspect-[4/3] w-full">
                    <img
                      src={v.image}
                      alt={p.name + " - " + v.colorName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {p.badge && (
                    <div className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-medium text-black">
                      {p.badge}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setOpenProductId(p.id)}
                    className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/40 p-2 text-white hover:bg-black/60"
                    aria-label="Katta ko‘rish"
                    title="Katta ko‘rish"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold">{p.name}</h4>
                  <p className="mt-1 text-white/70">
                    Narx: <span className="font-medium text-white">{formatUZS(v.price)}</span>
                  </p>

                  <div className="mt-4">
                    <p className="text-sm text-white/70">
                      Rang tanlang: <span className="text-white">{v.colorName}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.variants.map((vv) => {
                        const active = vv.id === selected[p.id];
                        return (
                          <button
                            key={vv.id}
                            type="button"
                            onClick={() => setSelected((prev) => ({ ...prev, [p.id]: vv.id }))}
                            className={[
                              "flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition",
                              active ? "border-yellow-400 bg-yellow-400/10" : "border-white/15 hover:bg-white/10",
                            ].join(" ")}
                            aria-label={vv.colorName}
                            title={vv.colorName}
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-white/20"
                              style={{ backgroundColor: vv.colorHex }}
                            />
                            {vv.colorName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className="flex-1 rounded-xl bg-yellow-400 px-4 py-3 font-medium text-black hover:opacity-90"
                    >
                      Karzinkaga
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenProductId(p.id)}
                      className="rounded-xl border border-white/15 px-4 py-3 font-medium text-white hover:bg-white/10"
                    >
                      Ko‘rish uchun
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="order-form" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Karzinka</h3>
            <p className="mt-2 text-sm text-white/70">Buyurtma qilishdan oldin sonini tekshiring.</p>

            <div className="mt-5 space-y-3">
              {cartItems.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white/60">
                  Hozircha karzinka bo‘sh. Yuqoridan mahsulot tanlab “Karzinkaga” bosing.
                </div>
              ) : (
                cartItems.map((it) => (
                  <div
                    key={it.variant.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div>
                      <p className="font-medium">{it.product.name}</p>
                      <p className="text-sm text-white/70">
                        Rang: {it.variant.colorName} • {formatUZS(it.variant.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeQty(it.variant.id, -1)}
                        className="h-9 w-9 rounded-xl border border-white/15 hover:bg-white/10"
                        aria-label="Kamaytirish"
                      >
                        -
                      </button>
                      <span className="w-7 text-center">{it.qty}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(it.variant.id, +1)}
                        className="h-9 w-9 rounded-xl border border-white/15 hover:bg-white/10"
                        aria-label="Ko'paytirish"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
              <span className="text-white/70">Jami:</span>
              <span className="text-lg font-semibold">{formatUZS(total)}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Buyurtma formasi</h3>
            <p className="mt-2 text-sm text-white/70">
              Hozircha demo: tugmani bosganda konsolga chiqaradi. Keyin Telegram/CRM’ga ulab beriladi.
            </p>

            <form
              className="mt-5 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const payload = {
                  name: String(form.get("name") || ""),
                  phone: String(form.get("phone") || ""),
                  address: String(form.get("address") || ""),
                  note: String(form.get("note") || ""),
                  items: cartItems.map((i) => ({
                    product: i.product.name,
                    color: i.variant.colorName,
                    price: i.variant.price,
                    qty: i.qty,
                  })),
                  total,
                };
                console.log("ORDER_PAYLOAD:", payload);
                alert("Buyurtma qabul qilindi (demo). Konsolni tekshiring.");
              }}
            >
              <input
                name="name"
                required
                className="rounded-xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/40"
                placeholder="Ism"
              />
              <input
                name="phone"
                required
                className="rounded-xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/40"
                placeholder="Telefon (masalan: +998...)"
              />
              <input
                name="address"
                className="rounded-xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/40"
                placeholder="Manzil (ixtiyoriy)"
              />
              <textarea
                name="note"
                rows={3}
                className="rounded-xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/40"
                placeholder="Izoh (ixtiyoriy)"
              />

              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="rounded-xl bg-yellow-400 px-6 py-3 font-medium text-black hover:opacity-90 disabled:opacity-40"
              >
                Buyurtmani yuborish
              </button>

              <p className="text-xs text-white/50">
                Eslatma: haqiqiy yuborish uchun keyingi bosqichda API route + Telegram/Sheets integratsiya qilamiz.
              </p>
            </form>
          </div>
        </div>
      </section>

      {openProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenProductId(null)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#071a33] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-semibold">{openProduct.name}</h4>
                <p className="mt-1 text-sm text-white/70">Ranglarni tanlang, narxlar shu yerda ko‘rinadi.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenProductId(null)}
                className="rounded-xl border border-white/15 p-2 hover:bg-white/10"
                aria-label="Yopish"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="aspect-[4/3] w-full">
                  <img
                    src={getSelectedVariant(openProduct).image}
                    alt={openProduct.name + " - " + getSelectedVariant(openProduct).colorName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/70">Variantlar</p>
                <div className="mt-3 space-y-2">
                  {openProduct.variants.map((vv) => {
                    const active = vv.id === selected[openProduct.id];
                    return (
                      <button
                        key={vv.id}
                        type="button"
                        onClick={() => setSelected((prev) => ({ ...prev, [openProduct.id]: vv.id }))}
                        className={[
                          "w-full rounded-2xl border p-4 text-left transition",
                          active ? "border-yellow-400 bg-yellow-400/10" : "border-white/15 hover:bg-white/10",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className="h-5 w-5 rounded-full border border-white/20"
                              style={{ backgroundColor: vv.colorHex }}
                            />
                            <div>
                              <p className="font-medium">{vv.colorName}</p>
                              <p className="text-sm text-white/70">{vv.image}</p>
                            </div>
                          </div>
                          <p className="font-semibold">{formatUZS(vv.price)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(openProduct)}
                  className="mt-4 w-full rounded-xl bg-yellow-400 px-6 py-3 font-medium text-black hover:opacity-90"
                >
                  Karzinkaga qo‘shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Onclod landing
      </footer>
    </main>
  );
}
