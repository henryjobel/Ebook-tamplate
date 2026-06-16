import React, { useEffect, useMemo, useState } from "react";

const emptyProduct = {
  title: "",
  type: "ebook",
  price: "",
  originalPrice: "",
  description: "",
  stock: "",
  sku: "",
  shippingCharge: "",
  deliveryOptions: "Inside Dhaka, Outside Dhaka, Courier",
  deliveryNote: ""
};

const navItems = [
  ["overview", "Overview"],
  ["cms", "CMS"],
  ["products", "Products"],
  ["delivery", "Delivery"],
  ["settings", "Settings"]
];

export default function AdminDashboard({ apiUrl, money }) {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [login, setLogin] = useState({ email: "admin@example.com", password: "admin123" });
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [product, setProduct] = useState(emptyProduct);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
    const pending = orders.filter((order) => order.status === "pending").length;
    const confirmed = orders.filter((order) => order.status === "approved").length;
    const physical = products.filter((item) => item.type === "physical").length;
    const ebooks = products.filter((item) => item.type === "ebook").length;
    const active = products.filter((item) => item.status === "active").length;
    const lowStock = products.filter((item) => item.type === "physical" && Number(item.stock || 0) <= 5).length;
    const bkash = orders.filter((order) => order.method === "bkash").length;
    const nagad = orders.filter((order) => order.method === "nagad").length;
    return { revenue, pending, confirmed, physical, ebooks, active, lowStock, bkash, nagad };
  }, [orders, products]);

  useEffect(() => {
    if (token) loadDashboard();
  }, [token]);

  async function authed(path, options = {}) {
    return fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
      }
    });
  }

  async function loadDashboard() {
    const [settingsRes, ordersRes, productsRes] = await Promise.all([
      authed("/api/admin/settings"),
      authed("/api/admin/orders"),
      authed("/api/admin/products")
    ]);

    if (!settingsRes.ok || !ordersRes.ok) {
      localStorage.removeItem("adminToken");
      setToken("");
      return;
    }

    setSettings(await settingsRes.json());
    setOrders((await ordersRes.json()).orders || []);
    if (productsRes.ok) {
      setProducts((await productsRes.json()).products || []);
    } else {
      setProducts([]);
      setMessage("Products API পাওয়া যাচ্ছে না। Backend restart দিন।");
    }
  }

  async function doLogin(event) {
    event.preventDefault();
    setMessage("");
    const res = await fetch(`${apiUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });
    const result = await res.json();
    if (!res.ok) return setMessage(result.message || "Login failed");
    localStorage.setItem("adminToken", result.token);
    setToken(result.token);
  }

  async function createProduct(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const res = await authed("/api/admin/products", {
      method: "POST",
      body: formData
    });
    const result = await res.json();
    setLoading(false);

    if (!res.ok) return setMessage(result.message || "Product save failed");
    setProduct(emptyProduct);
    event.currentTarget.reset();
    setMessage("Product added successfully");
    loadDashboard();
  }

  async function updateOrder(order, payload) {
    const res = await authed(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: order.status, ...payload })
    });
    if (res.ok) loadDashboard();
  }

  async function updateProductStatus(id, status) {
    const res = await authed(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (res.ok) loadDashboard();
  }

  async function saveSettings(event) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);
    if (settings?.content) {
      formData.set("contentJson", JSON.stringify(settings.content));
    }
    const res = await authed("/api/admin/settings", {
      method: "PUT",
      body: formData
    });
    const result = await res.json();
    if (!res.ok) return setMessage(result.message || "Settings save failed");
    setSettings(result);
    setMessage("Settings saved successfully");
  }

  if (!token) {
    return (
      <main className="grid min-h-screen bg-[#eef1f5] px-5 py-10 lg:grid-cols-[1fr_520px]">
        <section className="hidden items-center justify-center bg-[#111827] p-12 text-white lg:flex">
          <div className="max-w-xl">
            <p className="text-sm font-black uppercase text-orange-300">Store operations</p>
            <h1 className="mt-4 text-5xl font-black leading-tight">Manage products, orders, delivery and landing content from one place.</h1>
            <div className="mt-10 grid grid-cols-3 gap-3">
              <LoginFeature title="Products" text="Digital and physical inventory" />
              <LoginFeature title="Orders" text="Payment and delivery flow" />
              <LoginFeature title="CMS" text="Landing page controls" />
            </div>
          </div>
        </section>
        <section className="grid place-items-center">
          <form className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl" onSubmit={doLogin}>
            <p className="text-sm font-black uppercase text-orange-600">Admin login</p>
            <h2 className="mt-2 text-3xl font-black">Ecommerce Dashboard</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">Sign in to manage ebook products, physical products, orders and delivery.</p>
            <div className="mt-7 grid gap-4">
              <input placeholder="Email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} />
              <input type="password" placeholder="Password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} />
              <button className="btn-primary h-12 w-full">Login</button>
            </div>
            {message && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{message}</p>}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f0f1] text-[#1d2327]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 bg-[#1d2327] text-white xl:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-5">
            <p className="text-xs font-black uppercase text-[#72aee6]">WordPress style</p>
            <h1 className="mt-1 text-2xl font-black">Store Admin</h1>
          </div>
          <nav className="mt-4 grid gap-1 px-3">
            {navItems.map(([id, label]) => (
              <button
                className={`flex items-center justify-between rounded-md px-4 py-3 text-left text-sm font-black transition ${tab === id ? "bg-[#2271b1] text-white" : "text-slate-300 hover:bg-[#2c3338] hover:text-white"}`}
                key={id}
                onClick={() => setTab(id)}
              >
                <span>{label}</span>
                {id === "delivery" && stats.pending > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#2271b1]">{stats.pending}</span>}
              </button>
            ))}
          </nav>
          <div className="mx-3 mb-4 mt-auto rounded-md border border-white/10 p-4">
            <p className="text-sm font-bold text-slate-300">Active products</p>
            <p className="mt-2 text-3xl font-black">{stats.active}</p>
            <a className="mt-4 inline-flex text-sm font-black text-[#72aee6]" href="#/">View storefront</a>
          </div>
        </div>
      </aside>

      <section className="xl:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-black uppercase text-orange-600">Dashboard</p>
              <h2 className="text-3xl font-black tracking-normal">{tabLabel(tab)}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={loadDashboard}>Refresh</button>
              <a className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" href="#/">View Store</a>
              <button className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white" onClick={() => { localStorage.removeItem("adminToken"); setToken(""); }}>Logout</button>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-auto xl:hidden">
            {navItems.map(([id, label]) => (
              <button className={`rounded-full px-4 py-2 text-sm font-black ${tab === id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`} key={id} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-5 lg:p-7">
          {tab === "overview" && (
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                <Metric title="Total revenue" value={money(stats.revenue)} helper={`${orders.length} total orders`} tone="dark" />
                <Metric title="Pending orders" value={stats.pending} helper={`${stats.confirmed} confirmed`} tone="orange" />
                <Metric title="Product mix" value={`${stats.ebooks}/${stats.physical}`} helper="ebooks / physical" />
                <Metric title="Low stock" value={stats.lowStock} helper="physical products at 5 or less" tone={stats.lowStock ? "red" : "green"} />
              </div>

              <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
                <Panel title="Recent orders" action={<button className="table-action" onClick={() => setTab("delivery")}>Manage delivery</button>}>
                  <OrderTable orders={orders.slice(0, 7)} money={money} onUpdate={updateOrder} apiUrl={apiUrl} />
                </Panel>
                <Panel title="Store health">
                  <div className="grid gap-3">
                    <HealthRow label="bKash orders" value={stats.bkash} />
                    <HealthRow label="Nagad orders" value={stats.nagad} />
                    <HealthRow label="Active products" value={stats.active} />
                    <HealthRow label="Pending fulfillment" value={orders.filter((order) => ["processing", "packed", "shipped"].includes(order.deliveryStatus)).length} />
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {tab === "cms" && (
            <div className="grid gap-6">
              <Panel title="CMS" subtitle="Landing page content management.">
                <div className="grid gap-4 lg:grid-cols-3">
                  <CmsCard title="Landing Page CMS" text="Hero, logo, section copy, FAQ, testimonials, bonus, author and image controls." href="#/admin/cms" />
                  <CmsCard title="Preview Storefront" text="Check the public landing page after editing content." href="#/" />
                  <CmsCard title="Product Content" text="Use Products tab for ebook or physical product catalog content." onClick={() => setTab("products")} />
                </div>
              </Panel>
            </div>
          )}

          {tab === "products" && (
            <div className="grid gap-6 2xl:grid-cols-[460px_1fr]">
              <Panel title="Create product" subtitle="Choose digital ebook or physical product, then fill the relevant delivery fields.">
                <ProductForm product={product} setProduct={setProduct} createProduct={createProduct} loading={loading} message={message} />
              </Panel>
              <Panel title="Products" subtitle={`${products.length} products in catalog`}>
                <ProductTable products={products} money={money} apiUrl={apiUrl} updateProductStatus={updateProductStatus} />
              </Panel>
            </div>
          )}

          {tab === "delivery" && (
            <Panel title="Delivery & Order Management" subtitle="Verify payment, update courier status, tracking number and digital download delivery.">
              <OrderTable orders={orders} money={money} onUpdate={updateOrder} apiUrl={apiUrl} detailed />
            </Panel>
          )}

          {tab === "settings" && (
            <Panel title="Settings" subtitle="Store payment, ebook, upload and delivery configuration.">
              <SettingsForm settings={settings} saveSettings={saveSettings} message={message} />
            </Panel>
          )}
        </div>
      </section>
    </main>
  );
}

function tabLabel(tab) {
  return {
    overview: "Overview",
    cms: "CMS",
    products: "Products",
    delivery: "Delivery",
    settings: "Settings"
  }[tab] || "Dashboard";
}

function CmsCard({ title, text, href, onClick }) {
  const className = "block rounded-md border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#2271b1] hover:shadow-md";
  const content = (
    <>
      <h3 className="text-lg font-black text-[#1d2327]">{title}</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{text}</p>
      <span className="mt-4 inline-flex text-sm font-black text-[#2271b1]">Open</span>
    </>
  );

  if (href) return <a className={className} href={href}>{content}</a>;
  return <button className={className} type="button" onClick={onClick}>{content}</button>;
}

function SettingsForm({ settings, saveSettings, message }) {
  if (!settings) return <EmptyState title="Settings loading" text="Please wait while admin settings load." />;

  return (
    <form className="grid gap-6" onSubmit={saveSettings}>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-black">Store product default</h3>
          <label className="field-label">Default ebook title
            <input name="title" defaultValue={settings.ebook?.title || ""} />
          </label>
          <label className="field-label">Default subtitle
            <input name="subtitle" defaultValue={settings.ebook?.subtitle || ""} />
          </label>
          <label className="field-label">Default description
            <textarea name="description" defaultValue={settings.ebook?.description || ""} />
          </label>
          <label className="field-label">Default price
            <input name="price" type="number" defaultValue={settings.ebook?.price || ""} />
          </label>
        </div>

        <div className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-black">Payment settings</h3>
          <label className="field-label">bKash number
            <input name="bkashNumber" defaultValue={settings.payment?.bkashNumber || ""} />
          </label>
          <label className="field-label">Nagad number
            <input name="nagadNumber" defaultValue={settings.payment?.nagadNumber || ""} />
          </label>
          <label className="field-label">Payment instructions
            <textarea name="instructions" defaultValue={settings.payment?.instructions || ""} />
          </label>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <label className="field-label rounded-md border border-slate-200 bg-white p-4">Default cover upload
          <input name="coverImage" type="file" accept="image/*" />
        </label>
        <label className="field-label rounded-md border border-slate-200 bg-white p-4">Default ebook file
          <input name="ebookFile" type="file" accept=".pdf,.epub,.zip" />
        </label>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h3 className="font-black">Delivery note</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
            Product-specific physical delivery settings are managed from Products. Order delivery status is managed from Delivery.
          </p>
        </div>
      </div>

      <button className="btn-primary h-12 w-fit min-w-44">Save settings</button>
      {message && <p className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}
    </form>
  );
}

function ProductForm({ product, setProduct, createProduct, loading, message }) {
  return (
    <form className="grid gap-4" onSubmit={createProduct}>
      <label className="field-label">Product type
        <div className="grid grid-cols-2 gap-2">
          {[
            ["ebook", "eBook"],
            ["physical", "Physical"]
          ].map(([value, label]) => (
            <button
              className={`rounded-lg border px-4 py-3 text-sm font-black ${product.type === value ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-200 bg-white text-slate-600"}`}
              type="button"
              key={value}
              onClick={() => setProduct({ ...product, type: value })}
            >
              {label}
            </button>
          ))}
        </div>
        <input type="hidden" name="type" value={product.type} />
      </label>

      <label className="field-label">Product title
        <input name="title" required value={product.title} onChange={(event) => setProduct({ ...product, title: event.target.value })} />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">SKU
          <input name="sku" value={product.sku} onChange={(event) => setProduct({ ...product, sku: event.target.value })} />
        </label>
        <label className="field-label">Product image
          <input name="productImage" type="file" accept="image/*" />
        </label>
      </div>

      <label className="field-label">Description
        <textarea name="description" value={product.description} onChange={(event) => setProduct({ ...product, description: event.target.value })} />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">Sale price
          <input name="price" type="number" required value={product.price} onChange={(event) => setProduct({ ...product, price: event.target.value })} />
        </label>
        <label className="field-label">Original price
          <input name="originalPrice" type="number" value={product.originalPrice} onChange={(event) => setProduct({ ...product, originalPrice: event.target.value })} />
        </label>
      </div>

      {product.type === "ebook" ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <label className="field-label">Digital file
            <input name="productFile" type="file" accept=".pdf,.epub,.zip" />
          </label>
          <p className="mt-2 text-xs font-bold text-blue-700">Digital products do not need stock or courier delivery.</p>
        </div>
      ) : (
        <div className="grid gap-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field-label">Stock quantity
              <input name="stock" type="number" value={product.stock} onChange={(event) => setProduct({ ...product, stock: event.target.value })} />
            </label>
            <label className="field-label">Shipping charge
              <input name="shippingCharge" type="number" value={product.shippingCharge} onChange={(event) => setProduct({ ...product, shippingCharge: event.target.value })} />
            </label>
          </div>
          <label className="field-label">Delivery options
            <input name="deliveryOptions" value={product.deliveryOptions} onChange={(event) => setProduct({ ...product, deliveryOptions: event.target.value })} />
          </label>
          <label className="field-label">Delivery note
            <textarea name="deliveryNote" value={product.deliveryNote} onChange={(event) => setProduct({ ...product, deliveryNote: event.target.value })} />
          </label>
        </div>
      )}

      <button className="btn-primary h-12" disabled={loading}>{loading ? "Saving product..." : "Create product"}</button>
      {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}
    </form>
  );
}

function ProductTable({ products, money, apiUrl, updateProductStatus }) {
  if (products.length === 0) {
    return <EmptyState title="No products yet" text="Create an ebook or physical product to start managing inventory." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="grid min-w-[820px] grid-cols-[1.4fr_120px_120px_120px_180px] bg-slate-50 px-4 py-3 text-xs font-black uppercase text-slate-500">
        <span>Product</span>
        <span>Type</span>
        <span>Price</span>
        <span>Stock</span>
        <span>Status</span>
      </div>
      {products.map((item) => (
        <div className="grid min-w-[820px] grid-cols-[1.4fr_120px_120px_120px_180px] items-center border-t border-slate-200 bg-white px-4 py-3" key={item.id}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-900">
              {item.imageUrl && <img className="h-full w-full object-cover" src={`${apiUrl}${item.imageUrl}`} alt={item.title} />}
            </div>
            <div className="min-w-0">
              <p className="truncate font-black">{item.title}</p>
              <p className="truncate text-xs font-bold text-slate-500">{item.sku || "No SKU"}</p>
            </div>
          </div>
          <StatusChip tone={item.type === "physical" ? "blue" : "purple"}>{item.type}</StatusChip>
          <p className="font-black text-slate-800">{money(item.price)}</p>
          <p className="font-bold text-slate-600">{item.type === "physical" ? item.stock : "Digital"}</p>
          <div className="flex items-center gap-2">
            <StatusChip tone={item.status === "active" ? "green" : item.status === "archived" ? "red" : "neutral"}>{item.status}</StatusChip>
            <select className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold" value={item.status} onChange={(event) => updateProductStatus(item.id, event.target.value)}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderTable({ orders, money, onUpdate, apiUrl, detailed = false }) {
  if (orders.length === 0) {
    return <EmptyState title="No orders yet" text="Orders will appear here after customers submit checkout details." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="grid min-w-[980px] grid-cols-[1.2fr_1fr_120px_130px_160px_180px] bg-slate-50 px-4 py-3 text-xs font-black uppercase text-slate-500">
        <span>Customer</span>
        <span>Payment</span>
        <span>Amount</span>
        <span>Status</span>
        <span>Delivery</span>
        <span>Actions</span>
      </div>
      {orders.map((order) => (
        <div className="grid min-w-[980px] grid-cols-[1.2fr_1fr_120px_130px_160px_180px] items-center border-t border-slate-200 bg-white px-4 py-3" key={order.id}>
          <div>
            <p className="font-black">{order.name}</p>
            <p className="text-xs font-bold text-slate-500">{order.phone}</p>
            <p className="text-xs font-bold text-slate-400">{order.email || "No email"}</p>
          </div>
          <div>
            <p className="text-sm font-black uppercase text-slate-700">{order.method}</p>
            <p className="max-w-[180px] truncate text-xs font-bold text-slate-500">{order.transactionId}</p>
          </div>
          <p className="font-black text-orange-700">{money(order.amount)}</p>
          <StatusChip tone={order.status === "approved" ? "green" : order.status === "rejected" ? "red" : "orange"}>{order.status}</StatusChip>
          <StatusChip tone={deliveryTone(order.deliveryStatus)}>{order.deliveryStatus || "not_required"}</StatusChip>
          <div className="flex flex-wrap gap-2">
            {detailed ? (
              <>
                <select className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold" value={order.status} onChange={(event) => onUpdate(order, { status: event.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="approved">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold" value={order.deliveryStatus || "not_required"} onChange={(event) => onUpdate(order, { deliveryStatus: event.target.value })}>
                  <option value="not_required">Digital</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <input className="h-9 px-2 py-1 text-xs" placeholder="Tracking" defaultValue={order.trackingNumber || ""} onBlur={(event) => onUpdate(order, { trackingNumber: event.target.value })} />
              </>
            ) : (
              <button className="table-action" onClick={() => onUpdate(order, { status: "approved" })}>Confirm</button>
            )}
            {order.downloadToken && (
              <a className="table-action" href={`${apiUrl}/api/download/${order.downloadToken}`}>Download</a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Metric({ title, value, helper, tone = "neutral" }) {
  const tones = {
    dark: "bg-[#111827] text-white",
    orange: "bg-orange-500 text-white",
    green: "bg-emerald-600 text-white",
    red: "bg-red-600 text-white",
    neutral: "bg-white text-slate-950"
  };

  return (
    <div className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${tones[tone]}`}>
      <p className={`text-xs font-black uppercase ${tone === "neutral" ? "text-slate-500" : "text-white/70"}`}>{title}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
      <p className={`mt-2 text-sm font-bold ${tone === "neutral" ? "text-slate-500" : "text-white/70"}`}>{helper}</p>
    </div>
  );
}

function Panel({ title, subtitle, action, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-black">{title}</h2>
          {subtitle && <p className="mt-1 text-sm font-bold text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="overflow-x-auto p-5">{children}</div>
    </section>
  );
}

function HealthRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}

function StatusChip({ children, tone = "neutral" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-violet-50 text-violet-700",
    neutral: "bg-slate-100 text-slate-600"
  };
  return <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-black uppercase ${tones[tone]}`}>{children}</span>;
}

function deliveryTone(status) {
  if (status === "delivered") return "green";
  if (status === "shipped" || status === "packed") return "blue";
  if (status === "processing") return "orange";
  return "neutral";
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="font-black text-slate-700">{title}</p>
      <p className="mt-2 text-sm font-bold text-slate-500">{text}</p>
    </div>
  );
}

function LoginFeature({ title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/8 p-4">
      <p className="font-black">{title}</p>
      <p className="mt-2 text-sm font-semibold text-white/60">{text}</p>
    </div>
  );
}
