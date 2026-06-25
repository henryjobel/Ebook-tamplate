import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  MousePointerClick,
  Package,
  Plus,
  Save,
  Settings,
  ShoppingBag,
  Upload,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { API_URL, Content, DEFAULT_CONTENT, DEFAULT_EBOOK, DEFAULT_PAYMENT, Ebook, Payment } from "../lib/api";
import { cn } from "../components/ui/utils";

type AdminView = "overview" | "orders" | "products" | "settings" | "cms-core" | "cms-v2";
type AdminState = {
  ebook: Ebook;
  payment: Payment;
  content: Content & Record<string, any>;
  orders: any[];
  products: any[];
};

const emptyState: AdminState = {
  ebook: DEFAULT_EBOOK,
  payment: DEFAULT_PAYMENT,
  content: DEFAULT_CONTENT as Content & Record<string, any>,
  orders: [],
  products: []
};

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "products", label: "Products", icon: Package },
  { id: "cms-v2", label: "CMS Content", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "cms-core", label: "Legacy CMS", icon: FileText }
] as const;

const primaryButtonClass =
  "bg-green text-[#062014] shadow-[0_8px_22px_-10px_rgba(0,208,132,0.9)] hover:bg-green-deep hover:text-white";
const softActionButtonClass =
  "border-[#cbd9d2] bg-white text-[#15392f] hover:border-green hover:bg-green/10 hover:text-[#0b2a22]";
const dangerActionButtonClass =
  "border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800";
const panelCardClass =
  "overflow-hidden rounded-2xl border-[#d8e7df] bg-white shadow-[0_24px_80px_-58px_rgba(17,47,40,0.85)]";

function authed(token: string, path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...options, headers });
}

async function readJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

function mergeAdminPayload(payload: any): Partial<AdminState> {
  return {
    ebook: { ...DEFAULT_EBOOK, ...(payload.ebook || {}) },
    payment: { ...DEFAULT_PAYMENT, ...(payload.payment || {}) },
    content: {
      ...(DEFAULT_CONTENT as any),
      ...(payload.content || {}),
      v2: { ...(DEFAULT_CONTENT as any).v2, ...(payload.content?.v2 || {}) }
    }
  };
}

function formatTk(value: any) {
  return `৳${Number(value || 0).toLocaleString("en-US")}`;
}

function AdminLogin({ onLogin }: { onLogin: (token: string, payload: any) => void }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await readJson(res);
      localStorage.setItem("adminToken", data.token);
      onLogin(data.token, data);
      toast.success("Admin login successful");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,208,132,0.18),transparent_32%),linear-gradient(135deg,#f3f7f5,#edf4f0)] px-4 py-10 text-[#11261f]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <Card className="w-full overflow-hidden rounded-2xl border-[#d8e7df] bg-white/95 shadow-[0_30px_90px_-55px_rgba(17,47,40,0.9)] backdrop-blur">
          <CardHeader className="bg-[#0b1f1b] p-6 text-white">
            <Badge className="mb-3 w-fit border border-green/30 bg-green/15 text-green">Admin Studio</Badge>
            <CardTitle className="text-2xl">Frontend-v2 Admin</CardTitle>
            <CardDescription className="text-white/60">Storefront content, products, orders and delivery control.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-4" onSubmit={submit}>
              <Field label="Email">
                <Input className="h-11 border-[#d6e1db] bg-white focus-visible:border-green focus-visible:ring-green/20" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Password">
                <Input className="h-11 border-[#d6e1db] bg-white focus-visible:border-green focus-visible:ring-green/20" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <Button className={cn("w-full", primaryButtonClass)} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

function AdminLayout({
  active,
  setActive,
  onLogout,
  children
}: {
  active: AdminView;
  setActive: (view: AdminView) => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const activeItem = navItems.find((item) => item.id === active);
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(0,208,132,0.13),transparent_28%),linear-gradient(180deg,#f6faf8,#edf4f0)] text-[#10251f]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-[#0b1f1b] text-white lg:flex lg:flex-col">
        <div className="relative overflow-hidden border-b border-white/10 px-6 py-6">
          <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-green/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.22em] text-green/80">Ebook Store</p>
            <h1 className="mt-1 text-xl font-semibold">Admin Studio</h1>
            <p className="mt-2 text-xs leading-5 text-white/45">Content, commerce, delivery and product control.</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cn(
                  "group flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm text-white/65 transition hover:bg-white/10 hover:text-white",
                  active === item.id && "bg-green text-[#062014] shadow-[0_14px_32px_-18px_rgba(0,208,132,0.9)] hover:bg-green hover:text-[#062014]"
                )}
              >
                <span className={cn("flex size-8 items-center justify-center rounded-lg bg-white/8 text-white/70 transition group-hover:bg-white/12 group-hover:text-white", active === item.id && "bg-[#062014]/10 text-[#062014] group-hover:bg-[#062014]/10 group-hover:text-[#062014]")}>
                  <Icon className="size-4" />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-3">
          <a className="flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white" href="/">
            <ChevronRight className="size-4" />
            View Storefront
          </a>
          <button onClick={onLogout} className="flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white">
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-[#dce5df] bg-[#f4f7f5]/90 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6f8178]">Current workspace</p>
              <h2 className="text-lg font-semibold text-[#15392f]">{activeItem?.label || "Admin"}</h2>
            </div>
            <div className="w-full lg:hidden">
              <Select value={active} onValueChange={(value) => setActive(value as AdminView)}>
                <SelectTrigger className="border-[#d6e1db] bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {navItems.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <a className="hidden rounded-xl border border-[#d6e1db] bg-white px-4 py-2 text-sm font-medium text-[#15392f] shadow-sm transition hover:border-green hover:bg-green/10 lg:inline-flex" href="/">
              View storefront
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[13px] font-semibold text-[#31473f]">{label}</Label>
      {children}
    </div>
  );
}

function TextField({ label, value, onChange, type = "text" }: { label: string; value: any; onChange: (value: any) => void; type?: string }) {
  return (
    <Field label={label}>
      <Input
        className="border-[#d6e1db] bg-white focus-visible:border-green focus-visible:ring-green/20"
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </Field>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: any; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <Textarea
        className="min-h-24 border-[#d6e1db] bg-white focus-visible:border-green focus-visible:ring-green/20"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function FileField({ label, name }: { label: string; name: string }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3 rounded-md border border-dashed border-[#becdc4] bg-white px-3 py-3 transition hover:border-green/70 hover:bg-green/5">
        <Upload className="size-4 text-[#557067]" />
        <Input className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" type="file" name={name} />
      </div>
    </Field>
  );
}

function StringListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  return (
    <Card className="rounded-lg border-[#dbe6df] bg-[#fbfdfc] shadow-none">
      <CardHeader className="border-b border-[#edf2ef] pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base text-[#15392f]">{label}</CardTitle>
          <Button type="button" variant="outline" size="sm" className={softActionButtonClass} onClick={() => onChange([...(items || []), ""])}>
            <Plus className="size-4" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {!(items || []).length && <p className="text-sm text-[#6f8178]">No items yet.</p>}
        {(items || []).map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input className="border-[#d6e1db] bg-white focus-visible:border-green focus-visible:ring-green/20" value={item} onChange={(e) => onChange(items.map((v, i) => (i === index ? e.target.value : v)))} />
            <Button type="button" variant="outline" size="icon" className={dangerActionButtonClass} onClick={() => onChange(items.filter((_, i) => i !== index))}>
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

type Column = { key: string; label: string; type?: "text" | "textarea" | "number" | "boolean" | "select"; options?: string[] };

function ObjectListEditor({
  label,
  items,
  columns,
  newItem,
  onChange
}: {
  label: string;
  items: any[];
  columns: Column[];
  newItem: any;
  onChange: (items: any[]) => void;
}) {
  const rows = items || [];
  return (
    <Card className="rounded-lg border-[#dbe6df] bg-[#fbfdfc] shadow-none">
      <CardHeader className="border-b border-[#edf2ef] pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base text-[#15392f]">{label}</CardTitle>
            <CardDescription className="mt-1 text-xs">{rows.length} item{rows.length === 1 ? "" : "s"}</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" className={softActionButtonClass} onClick={() => onChange([...rows, { ...newItem }])}>
            <Plus className="size-4" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {!rows.length && <p className="text-sm text-[#6f8178]">No items yet.</p>}
        {rows.map((row, index) => (
          <div key={index} className="rounded-lg border border-[#dce5df] bg-white p-4 shadow-[0_8px_24px_-22px_rgba(17,47,40,0.5)]">
            <div className="mb-3 flex items-center justify-between">
              <Badge variant="outline" className="border-green/30 bg-green/10 text-[#15392f]">Item {index + 1}</Badge>
              <Button type="button" variant="outline" size="sm" className={dangerActionButtonClass} onClick={() => onChange(rows.filter((_, i) => i !== index))}>
                Remove
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {columns.map((col) => {
                const setValue = (value: any) => onChange(rows.map((item, i) => (i === index ? { ...item, [col.key]: value } : item)));
                if (col.type === "boolean") {
                  return (
                    <div key={col.key} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <Label>{col.label}</Label>
                      <Switch checked={Boolean(row[col.key])} onCheckedChange={setValue} />
                    </div>
                  );
                }
                if (col.type === "select") {
                  return (
                    <Field key={col.key} label={col.label}>
                      <Select value={row[col.key] || col.options?.[0]} onValueChange={setValue}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(col.options || []).map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                  );
                }
                if (col.type === "textarea") {
                  return <TextAreaField key={col.key} label={col.label} value={row[col.key]} onChange={setValue} />;
                }
                return <TextField key={col.key} label={col.label} value={row[col.key]} type={col.type === "number" ? "number" : "text"} onChange={setValue} />;
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PanelShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-[#d8e7df] bg-white shadow-[0_24px_80px_-62px_rgba(17,47,40,0.75)]">
        <div className="relative bg-[#0b1f1b] p-5 text-white sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-green/25 blur-3xl" />
          <div className="relative">
            <Badge className="mb-3 border border-green/30 bg-green/15 text-green">Admin workspace</Badge>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{description}</p>}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-xl border-[#dbe6df] bg-white shadow-[0_20px_70px_-48px_rgba(17,47,40,0.65)]">
      <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white pb-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#15392f] text-green shadow-[0_12px_30px_-18px_rgba(17,47,40,0.8)]">
            <Layers className="size-4" />
          </span>
          <div>
        <CardTitle className="text-base text-[#15392f]">{title}</CardTitle>
        {description && <CardDescription className="text-sm">{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}

function CmsTabsList({ tabs }: { tabs: { value: string; label: string }[] }) {
  return (
    <TabsList className="h-auto w-full flex-wrap justify-start rounded-xl border border-[#dce7e1] bg-white/90 p-1.5 shadow-[0_12px_35px_-28px_rgba(17,47,40,0.75)] backdrop-blur">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="min-h-10 flex-none rounded-lg px-4 text-sm text-[#486258] data-[state=active]:bg-[#15392f] data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

function CmsStudioHeader({ ebook, v2 }: { ebook: Ebook; v2: any }) {
  const contentScore = [
    v2.heroHeadline,
    v2.pains?.length,
    v2.benefits?.length,
    v2.chapters?.length,
    v2.reviews?.length,
    v2.bonuses?.length
  ].filter(Boolean).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8e7df] bg-[#0b1f1b] text-white shadow-[0_28px_90px_-55px_rgba(17,47,40,0.9)]">
      <div className="relative p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-green/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-orange/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="border border-green/30 bg-green/15 text-green">Live V2 editor</Badge>
              <Badge className="border border-white/15 bg-white/10 text-white">Frontend-v2</Badge>
            </div>
            <p className="text-sm text-white/55">Landing CMS</p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">{v2.brandName || "CMS Content"}</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">{v2.heroHeadline || "Hero headline not set"}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
            <StudioMetric label="Price" value={formatTk(ebook.price)} />
            <StudioMetric label="Sections" value={contentScore} />
            <StudioMetric label="Reviews" value={v2.reviews?.length || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioMetric({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function CmsPreviewRail({ ebook, v2 }: { ebook: Ebook; v2: any }) {
  const sections = [
    ["Hero", v2.heroHeadline],
    ["Pain", v2.pains?.length ? `${v2.pains.length} cards` : ""],
    ["Benefits", v2.benefits?.length ? `${v2.benefits.length} points` : ""],
    ["Chapters", v2.chapters?.length ? `${v2.chapters.length} chapters` : ""],
    ["Proof", v2.reviews?.length ? `${v2.reviews.length} reviews` : ""],
    ["Pricing", `${formatTk(ebook.price)} offer`]
  ];

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-6 space-y-4">
        <Card className="overflow-hidden rounded-2xl border-[#d8e7df] shadow-[0_24px_80px_-55px_rgba(17,47,40,0.85)]">
          <div className="bg-navy p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <Badge className="bg-green text-[#062014]">Preview</Badge>
              <Eye className="size-4 text-white/60" />
            </div>
            <h3 className="mt-4 text-xl font-semibold leading-tight">{v2.heroHeadline || "Hero headline"}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-white/60">{v2.heroSubheadline || "Subheadline preview"}</p>
            <div className="mt-4 rounded-xl bg-green px-4 py-3 text-sm font-semibold text-[#062014]">
              {v2.heroCta || "CTA button"}
            </div>
          </div>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between rounded-xl bg-[#f3f7f5] px-3 py-2">
              <span className="text-sm text-[#60746b]">Offer price</span>
              <span className="font-semibold text-[#15392f]">{formatTk(ebook.price)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#f3f7f5] px-3 py-2">
              <span className="text-sm text-[#60746b]">Bonus stack</span>
              <span className="font-semibold text-[#15392f]">{v2.bonuses?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#d8e7df] shadow-[0_24px_80px_-55px_rgba(17,47,40,0.85)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-[#15392f]">
              <MousePointerClick className="size-4 text-green-deep" />
              Page Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-[#edf2ef] bg-white px-3 py-2">
                <span className="text-sm font-medium text-[#15392f]">{label}</span>
                <span className="max-w-36 truncate text-xs text-[#6f8178]">{value || "Missing"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}

function OverviewPanel({ state }: { state: AdminState }) {
  const stats = useMemo(() => {
    const revenue = state.orders.filter((o) => o.status === "approved").reduce((sum, o) => sum + Number(o.amount || 0), 0);
    const pending = state.orders.filter((o) => o.status === "pending").length;
    const approved = state.orders.filter((o) => o.status === "approved").length;
    const physical = state.products.filter((p) => p.type === "physical").length;
    return { revenue, pending, approved, physical };
  }, [state.orders, state.products]);

  return (
    <PanelShell title="Overview" description="Live summary from the shared backend.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat title="Approved Revenue" value={formatTk(stats.revenue)} icon={BarChart3} />
        <Stat title="Pending Orders" value={stats.pending} icon={ShoppingBag} />
        <Stat title="Approved Orders" value={stats.approved} icon={Check} />
        <Stat title="Physical Products" value={stats.physical} icon={Package} />
      </div>
      <Card className={panelCardClass}>
        <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
          <CardTitle className="text-[#15392f]">Recent Orders</CardTitle>
          <CardDescription>Latest payment submissions from customers.</CardDescription>
        </CardHeader>
        <CardContent className="p-5"><OrdersTable orders={state.orders.slice(0, 5)} readonly /></CardContent>
      </Card>
    </PanelShell>
  );
}

function Stat({ title, value, icon: Icon }: { title: string; value: any; icon: any }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#d8e7df] bg-white shadow-[0_20px_70px_-55px_rgba(17,47,40,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_90px_-58px_rgba(17,47,40,0.9)]">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-[#60746b]">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <div className="rounded-xl bg-[#0b1f1b] p-3 text-green shadow-[0_14px_32px_-20px_rgba(17,47,40,0.8)]"><Icon className="size-5" /></div>
      </CardContent>
    </Card>
  );
}

function OrdersTable({ orders, readonly, onPatch }: { orders: any[]; readonly?: boolean; onPatch?: (id: string, body: any) => void }) {
  if (!orders.length) return <p className="text-sm text-[#60746b]">No orders yet.</p>;
  return (
    <Table className="[&_td]:border-[#edf2ef] [&_th]:text-[#60746b]">
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Delivery</TableHead>
          <TableHead>Download</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id || order.id}>
            <TableCell>
              <div className="font-medium">{order.name}</div>
              <div className="text-xs text-[#60746b]">{order.phone}</div>
            </TableCell>
            <TableCell>
              <div>{order.method}</div>
              <div className="text-xs text-[#60746b]">{order.transactionId}</div>
            </TableCell>
            <TableCell>{formatTk(order.amount)}</TableCell>
            <TableCell>
              {readonly ? <StatusBadge value={order.status} /> : (
                <Select value={order.status} onValueChange={(status) => onPatch?.(order._id, { status })}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="approved">approved</SelectItem>
                    <SelectItem value="rejected">rejected</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </TableCell>
            <TableCell>
              {readonly ? (order.deliveryStatus || "not_required") : (
                <div className="space-y-2">
                  <Select value={order.deliveryStatus || "not_required"} onValueChange={(deliveryStatus) => onPatch?.(order._id, { deliveryStatus })}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_required">not_required</SelectItem>
                      <SelectItem value="processing">processing</SelectItem>
                      <SelectItem value="shipped">shipped</SelectItem>
                      <SelectItem value="delivered">delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Tracking no." defaultValue={order.trackingNumber || ""} onBlur={(e) => onPatch?.(order._id, { trackingNumber: e.target.value })} />
                </div>
              )}
            </TableCell>
            <TableCell>
              {order.downloadToken ? (
                <Button variant="outline" size="sm" className={softActionButtonClass} asChild>
                  <a href={`${API_URL}/api/download/${order.downloadToken}`} target="_blank" rel="noreferrer"><Download className="size-4" /> Link</a>
                </Button>
              ) : <span className="text-xs text-[#60746b]">Not ready</span>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusBadge({ value }: { value: string }) {
  const classes: Record<string, string> = {
    approved: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-rose-100 text-rose-800"
  };
  return <Badge className={classes[value] || ""}>{value}</Badge>;
}

function OrdersPanel({ state, patchOrder }: { state: AdminState; patchOrder: (id: string, body: any) => void }) {
  return (
    <PanelShell title="Orders" description="Approve payments, update delivery state, and open secure download links.">
      <Card className={panelCardClass}>
        <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
          <CardTitle className="text-[#15392f]">Order Queue</CardTitle>
          <CardDescription>Change payment and delivery status directly from the table.</CardDescription>
        </CardHeader>
        <CardContent className="p-5"><OrdersTable orders={state.orders} onPatch={patchOrder} /></CardContent>
      </Card>
    </PanelShell>
  );
}

function ProductsPanel({ state, createProduct, patchProduct }: { state: AdminState; createProduct: (form: HTMLFormElement) => void; patchProduct: (id: string, body: any) => void }) {
  return (
    <PanelShell title="Products" description="Add ebooks or physical products backed by MongoDB and Cloudinary uploads.">
      <Card className={panelCardClass}>
        <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
          <CardTitle className="text-[#15392f]">Create Product</CardTitle>
          <CardDescription>Add a digital ebook or a physical product with delivery settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 p-5 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); createProduct(e.currentTarget); }}>
            <Field label="Product type">
              <select name="type" className="h-9 w-full rounded-md border bg-white px-3 text-sm">
                <option value="ebook">ebook</option>
                <option value="physical">physical</option>
              </select>
            </Field>
            <Field label="Title"><Input name="title" required /></Field>
            <Field label="Price"><Input name="price" type="number" defaultValue="0" /></Field>
            <Field label="Original price"><Input name="originalPrice" type="number" defaultValue="0" /></Field>
            <Field label="Stock"><Input name="stock" type="number" defaultValue="0" /></Field>
            <Field label="SKU"><Input name="sku" /></Field>
            <Field label="Shipping charge"><Input name="shippingCharge" type="number" defaultValue="0" /></Field>
            <Field label="Delivery options (comma separated)"><Input name="deliveryOptions" placeholder="Courier, Same day, Digital download" /></Field>
            <Field label="Description"><Textarea name="description" /></Field>
            <Field label="Delivery note"><Textarea name="deliveryNote" /></Field>
            <FileField label="Product image" name="productImage" />
            <FileField label="Digital file" name="productFile" />
            <div className="md:col-span-2"><Button className={primaryButtonClass}><Plus className="size-4" /> Create product</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card className={panelCardClass}>
        <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
          <CardTitle className="text-[#15392f]">Product List</CardTitle>
          <CardDescription>Manage product publishing status.</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          {!state.products.length ? <p className="text-sm text-[#60746b]">No products yet.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Type</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {state.products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-xs text-[#60746b]">{product.sku || product.originalFileName || "No SKU"}</div>
                    </TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>{formatTk(product.price)}</TableCell>
                    <TableCell>
                      <Select value={product.status} onValueChange={(status) => patchProduct(product._id, { status })}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="active">active</SelectItem><SelectItem value="draft">draft</SelectItem><SelectItem value="archived">archived</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PanelShell>
  );
}

function SettingsPanel({ state, setState, saveSettings }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>>; saveSettings: (form: HTMLFormElement) => void }) {
  const setEbook = (key: string, value: any) => setState((s) => ({ ...s, ebook: { ...s.ebook, [key]: value } }));
  const setPayment = (key: string, value: any) => setState((s) => ({ ...s, payment: { ...s.payment, [key]: value } }));
  return (
    <PanelShell title="Settings" description="Main ebook, payment and upload settings.">
      <form onSubmit={(e) => { e.preventDefault(); saveSettings(e.currentTarget); }}>
        <Card className={panelCardClass}>
          <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
            <CardTitle className="text-[#15392f]">Main Ebook</CardTitle>
            <CardDescription>Offer copy, price, cover and protected ebook file.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            <TextField label="Title" value={state.ebook.title} onChange={(v) => setEbook("title", v)} />
            <TextField label="Subtitle" value={state.ebook.subtitle} onChange={(v) => setEbook("subtitle", v)} />
            <TextField label="Price" type="number" value={state.ebook.price} onChange={(v) => setEbook("price", v)} />
            <TextField label="Original price" type="number" value={state.ebook.originalPrice} onChange={(v) => setEbook("originalPrice", v)} />
            <div className="md:col-span-2"><TextAreaField label="Description" value={state.ebook.description} onChange={(v) => setEbook("description", v)} /></div>
            <FileField label="Cover image" name="coverImage" />
            <FileField label="Ebook PDF/file" name="ebookFile" />
          </CardContent>
        </Card>
        <Card className={cn("mt-5", panelCardClass)}>
          <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
            <CardTitle className="text-[#15392f]">Payment</CardTitle>
            <CardDescription>Numbers and customer payment instructions shown at checkout.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            <TextField label="bKash number" value={state.payment.bkashNumber} onChange={(v) => setPayment("bkashNumber", v)} />
            <TextField label="Nagad number" value={state.payment.nagadNumber} onChange={(v) => setPayment("nagadNumber", v)} />
            <div className="md:col-span-2"><TextAreaField label="Instructions" value={state.payment.instructions} onChange={(v) => setPayment("instructions", v)} /></div>
          </CardContent>
        </Card>
        <Button className={cn("mt-5", primaryButtonClass)}><Save className="size-4" /> Save settings</Button>
      </form>
    </PanelShell>
  );
}

function CmsCorePanel({ state, setState, saveSettings }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>>; saveSettings: (form: HTMLFormElement) => void }) {
  const c = state.content;
  const setContent = (key: string, value: any) => setState((s) => ({ ...s, content: { ...s.content, [key]: value } }));
  return (
    <CmsForm title="Legacy CMS" description="Old storefront fields. Frontend-v2 content is edited from CMS Content." onSave={saveSettings}>
      <Tabs defaultValue="brand" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start">
          {["brand", "hero", "sections", "proof", "seo"].map((tab) => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="brand"><FieldGrid>
          <TextField label="Brand name" value={c.brandName} onChange={(v) => setContent("brandName", v)} />
          <TextField label="Trust line" value={c.trustLine} onChange={(v) => setContent("trustLine", v)} />
          <TextField label="Sticky CTA" value={c.stickyCta} onChange={(v) => setContent("stickyCta", v)} />
          <FileField label="Logo" name="logoImage" />
          <FileField label="Favicon" name="faviconImage" />
        </FieldGrid></TabsContent>
        <TabsContent value="hero"><FieldGrid>
          <TextField label="Hero kicker" value={c.heroKicker} onChange={(v) => setContent("heroKicker", v)} />
          <TextField label="Hero headline" value={c.heroHeadline} onChange={(v) => setContent("heroHeadline", v)} />
          <TextAreaField label="Hero subheadline" value={c.heroSubheadline} onChange={(v) => setContent("heroSubheadline", v)} />
          <TextField label="Hero CTA" value={c.heroCta} onChange={(v) => setContent("heroCta", v)} />
          <FileField label="Hero banner image" name="heroBannerImage" />
        </FieldGrid></TabsContent>
        <TabsContent value="sections" className="space-y-4">
          <TextField label="Who for title" value={c.whoForTitle} onChange={(v) => setContent("whoForTitle", v)} />
          <StringListEditor label="Who for" items={c.whoFor || []} onChange={(v) => setContent("whoFor", v)} />
          <TextField label="Pains title" value={c.painsTitle} onChange={(v) => setContent("painsTitle", v)} />
          <StringListEditor label="Pains" items={c.pains || []} onChange={(v) => setContent("pains", v)} />
          <ObjectListEditor label="Before / After" items={c.beforeAfter || []} newItem={{ before: "", after: "" }} columns={[{ key: "before", label: "Before" }, { key: "after", label: "After" }]} onChange={(v) => setContent("beforeAfter", v)} />
          <ObjectListEditor label="Inside" items={c.inside || []} newItem={{ title: "", text: "" }} columns={[{ key: "title", label: "Title" }, { key: "text", label: "Text", type: "textarea" }]} onChange={(v) => setContent("inside", v)} />
          <ObjectListEditor label="Bonuses" items={c.bonuses || []} newItem={{ title: "", text: "", value: 0 }} columns={[{ key: "title", label: "Title" }, { key: "text", label: "Text" }, { key: "value", label: "Value", type: "number" }]} onChange={(v) => setContent("bonuses", v)} />
        </TabsContent>
        <TabsContent value="proof" className="space-y-4">
          <FieldGrid>
            <TextField label="Author name" value={c.authorName} onChange={(v) => setContent("authorName", v)} />
            <TextAreaField label="Author bio" value={c.authorBio} onChange={(v) => setContent("authorBio", v)} />
            <FileField label="Author image" name="authorImage" />
            <TextField label="Rating title" value={c.ratingTitle} onChange={(v) => setContent("ratingTitle", v)} />
            <TextField label="Guarantee title" value={c.guaranteeTitle} onChange={(v) => setContent("guaranteeTitle", v)} />
            <TextAreaField label="Guarantee text" value={c.guaranteeText} onChange={(v) => setContent("guaranteeText", v)} />
          </FieldGrid>
          <StringListEditor label="Author badges" items={c.authorBadges || []} onChange={(v) => setContent("authorBadges", v)} />
          <ObjectListEditor label="Testimonials" items={c.testimonials || []} newItem={{ name: "", city: "", text: "" }} columns={[{ key: "name", label: "Name" }, { key: "city", label: "City" }, { key: "text", label: "Text", type: "textarea" }]} onChange={(v) => setContent("testimonials", v)} />
          <ObjectListEditor label="FAQ" items={c.faqs || []} newItem={{ q: "", a: "" }} columns={[{ key: "q", label: "Question" }, { key: "a", label: "Answer", type: "textarea" }]} onChange={(v) => setContent("faqs", v)} />
        </TabsContent>
        <TabsContent value="seo"><FieldGrid>
          <TextField label="SEO title" value={c.seoTitle} onChange={(v) => setContent("seoTitle", v)} />
          <TextAreaField label="SEO description" value={c.seoDescription} onChange={(v) => setContent("seoDescription", v)} />
          <TextField label="SEO keywords" value={c.seoKeywords} onChange={(v) => setContent("seoKeywords", v)} />
          <TextField label="Canonical URL" value={c.seoCanonical} onChange={(v) => setContent("seoCanonical", v)} />
          <FileField label="SEO image" name="seoImage" />
          <TextField label="Final headline" value={c.finalHeadline} onChange={(v) => setContent("finalHeadline", v)} />
          <TextAreaField label="Final text" value={c.finalText} onChange={(v) => setContent("finalText", v)} />
          <TextAreaField label="Footer text" value={c.footerText} onChange={(v) => setContent("footerText", v)} />
        </FieldGrid></TabsContent>
      </Tabs>
    </CmsForm>
  );
}

function CmsV2Panel({ state, setState, saveSettings }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>>; saveSettings: (form: HTMLFormElement) => void }) {
  const v2 = state.content.v2;
  const setV2 = (key: string, value: any) => setState((s) => ({ ...s, content: { ...s.content, v2: { ...s.content.v2, [key]: value } } }));
  const setAuthor = (key: string, value: any) => setV2("author", { ...v2.author, [key]: value });
  const setFooter = (key: string, value: any) => setV2("footer", { ...v2.footer, [key]: value });
  const cmsTabs = [
    { value: "hero", label: "Hero" },
    { value: "content", label: "Sections" },
    { value: "author", label: "Author" },
    { value: "proof", label: "Proof" },
    { value: "pricing", label: "Pricing" },
    { value: "footer", label: "Footer" }
  ];

  return (
    <CmsForm title="CMS Content" description="Frontend-v2 landing page fields. Edit the live site content here." onSave={saveSettings}>
      <CmsStudioHeader ebook={state.ebook} v2={v2} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Tabs defaultValue="hero" className="min-w-0 space-y-4">
          <CmsTabsList tabs={cmsTabs} />
          <TabsContent value="hero" className="space-y-4">
          <SectionCard title="Brand Bar" description="Header logo text, trust line, and mobile sticky button copy.">
            <FieldGrid>
              <TextField label="Brand name" value={v2.brandName} onChange={(v) => setV2("brandName", v)} />
              <TextField label="Sticky CTA" value={v2.stickyCta} onChange={(v) => setV2("stickyCta", v)} />
              <TextField label="Trust line" value={v2.trustLine} onChange={(v) => setV2("trustLine", v)} />
              <FileField label="Logo image" name="logoImage" />
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Hero Section" description="The first screen headline, supporting text, CTA, and guarantee badge.">
            <FieldGrid>
              <TextField label="Hero pill" value={v2.heroPill} onChange={(v) => setV2("heroPill", v)} />
              <TextField label="Guarantee badge" value={v2.heroGuaranteeBadge} onChange={(v) => setV2("heroGuaranteeBadge", v)} />
              <TextField label="Hero headline" value={v2.heroHeadline} onChange={(v) => setV2("heroHeadline", v)} />
              <TextField label="Hero CTA" value={v2.heroCta} onChange={(v) => setV2("heroCta", v)} />
              <div className="md:col-span-2">
                <TextAreaField label="Hero subheadline" value={v2.heroSubheadline} onChange={(v) => setV2("heroSubheadline", v)} />
              </div>
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Final CTA" description="The closing conversion section and countdown timer.">
            <FieldGrid>
              <TextField label="Final headline" value={v2.finalHeadline} onChange={(v) => setV2("finalHeadline", v)} />
              <TextField label="Final CTA button" value={v2.finalCtaButtonText} onChange={(v) => setV2("finalCtaButtonText", v)} />
              <TextField label="Countdown seconds" type="number" value={v2.countdownSeconds} onChange={(v) => setV2("countdownSeconds", v)} />
              <div className="md:col-span-2">
                <TextAreaField label="Final subtext" value={v2.finalSubtext} onChange={(v) => setV2("finalSubtext", v)} />
              </div>
            </FieldGrid>
          </SectionCard>
          </TabsContent>
          <TabsContent value="content" className="space-y-4">
          <SectionCard title="Pain Points" description="Problem cards shown after the hero.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="Pains title" value={v2.painsTitle} onChange={(v) => setV2("painsTitle", v)} />
                <TextAreaField label="Pains subtitle" value={v2.painsSubtitle} onChange={(v) => setV2("painsSubtitle", v)} />
              </FieldGrid>
              <ObjectListEditor label="Pain cards" items={v2.pains || []} newItem={{ emoji: "", text: "" }} columns={[{ key: "emoji", label: "Emoji" }, { key: "text", label: "Text", type: "textarea" }]} onChange={(v) => setV2("pains", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Benefits" description="Dark section with checkmarked value points.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="Benefits label" value={v2.benefitsLabel} onChange={(v) => setV2("benefitsLabel", v)} />
                <TextField label="Benefits title" value={v2.benefitsTitle} onChange={(v) => setV2("benefitsTitle", v)} />
              </FieldGrid>
              <StringListEditor label="Benefits" items={v2.benefits || []} onChange={(v) => setV2("benefits", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Inside The Book" description="Chapter preview and locked chapter curiosity blocks.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="Inside title" value={v2.insideTitle} onChange={(v) => setV2("insideTitle", v)} />
                <TextAreaField label="Inside subtitle" value={v2.insideSubtitle} onChange={(v) => setV2("insideSubtitle", v)} />
              </FieldGrid>
              <ObjectListEditor label="Chapters" items={v2.chapters || []} newItem={{ title: "", text: "", locked: false }} columns={[{ key: "title", label: "Title" }, { key: "text", label: "Text", type: "textarea" }, { key: "locked", label: "Locked", type: "boolean" }]} onChange={(v) => setV2("chapters", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Conversion Banners" description="CTA strips between content sections.">
            <ObjectListEditor label="CTA banners" items={v2.ctaBanners || []} newItem={{ title: "", subtitle: "", variant: "navy", buttonText: "" }} columns={[{ key: "title", label: "Title" }, { key: "subtitle", label: "Subtitle" }, { key: "variant", label: "Variant", type: "select", options: ["navy", "light"] }, { key: "buttonText", label: "Button text" }]} onChange={(v) => setV2("ctaBanners", v)} />
          </SectionCard>
          </TabsContent>
          <TabsContent value="author" className="space-y-4">
          <SectionCard title="Author Profile" description="Photo, positioning, bio, and trust stats.">
            <FieldGrid>
              <TextField label="Author name" value={v2.author?.name} onChange={(v) => setAuthor("name", v)} />
              <TextField label="Author role" value={v2.author?.role} onChange={(v) => setAuthor("role", v)} />
              <TextAreaField label="Author bio" value={v2.author?.bio} onChange={(v) => setAuthor("bio", v)} />
              <FileField label="Author photo" name="v2AuthorImage" />
              <div className="md:col-span-2">
                <ObjectListEditor label="Author stats" items={v2.author?.stats || []} newItem={{ value: "", label: "" }} columns={[{ key: "value", label: "Value" }, { key: "label", label: "Label" }]} onChange={(stats) => setAuthor("stats", stats)} />
              </div>
            </FieldGrid>
          </SectionCard>
          </TabsContent>
          <TabsContent value="proof" className="space-y-4">
          <SectionCard title="Testimonials" description="Video-style cards and written review cards.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="Testimonials title" value={v2.testimonialsTitle} onChange={(v) => setV2("testimonialsTitle", v)} />
                <TextField label="Rating summary" value={v2.ratingSummary} onChange={(v) => setV2("ratingSummary", v)} />
              </FieldGrid>
              <ObjectListEditor label="Video testimonials" items={v2.videoTestimonials || []} newItem={{ name: "", location: "", quote: "", imageUrl: "" }} columns={[{ key: "name", label: "Name" }, { key: "location", label: "Location" }, { key: "quote", label: "Quote", type: "textarea" }, { key: "imageUrl", label: "Image URL" }]} onChange={(v) => setV2("videoTestimonials", v)} />
              <ObjectListEditor label="Reviews" items={v2.reviews || []} newItem={{ name: "", text: "", rating: 5 }} columns={[{ key: "name", label: "Name" }, { key: "text", label: "Text", type: "textarea" }, { key: "rating", label: "Rating", type: "number" }]} onChange={(v) => setV2("reviews", v)} />
            </div>
          </SectionCard>

          <SectionCard title="FAQ & Guarantee" description="Buying objections, answers, and refund promise.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="FAQ title" value={v2.faqTitle} onChange={(v) => setV2("faqTitle", v)} />
                <TextField label="Guarantee title" value={v2.guaranteeTitle} onChange={(v) => setV2("guaranteeTitle", v)} />
                <div className="md:col-span-2">
                  <TextAreaField label="Guarantee text" value={v2.guaranteeText} onChange={(v) => setV2("guaranteeText", v)} />
                </div>
              </FieldGrid>
              <ObjectListEditor label="FAQ" items={v2.faqs || []} newItem={{ q: "", a: "" }} columns={[{ key: "q", label: "Question" }, { key: "a", label: "Answer", type: "textarea" }]} onChange={(v) => setV2("faqs", v)} />
            </div>
          </SectionCard>
          </TabsContent>
          <TabsContent value="pricing" className="space-y-4">
          <SectionCard title="Bonus Stack" description="Free bonuses shown inside the price card.">
            <ObjectListEditor label="Bonuses" items={v2.bonuses || []} newItem={{ title: "", text: "", value: 0 }} columns={[{ key: "title", label: "Title" }, { key: "text", label: "Text" }, { key: "value", label: "Value", type: "number" }]} onChange={(v) => setV2("bonuses", v)} />
          </SectionCard>
          <SectionCard title="Order Bumps" description="Optional add-ons customers can select before checkout.">
            <ObjectListEditor label="Upsells" items={v2.upsells || []} newItem={{ id: "", title: "", desc: "", price: 0, oldPrice: 0, popular: false }} columns={[{ key: "id", label: "ID" }, { key: "title", label: "Title" }, { key: "desc", label: "Description", type: "textarea" }, { key: "price", label: "Price", type: "number" }, { key: "oldPrice", label: "Old price", type: "number" }, { key: "popular", label: "Popular", type: "boolean" }]} onChange={(v) => setV2("upsells", v)} />
          </SectionCard>
          </TabsContent>
          <TabsContent value="footer" className="space-y-4">
          <SectionCard title="Footer Copy" description="Business description, contact email, and copyright line.">
            <FieldGrid>
              <TextAreaField label="Footer description" value={v2.footer?.description} onChange={(v) => setFooter("description", v)} />
              <TextField label="Email" value={v2.footer?.email} onChange={(v) => setFooter("email", v)} />
              <TextField label="Copyright" value={v2.footer?.copyright} onChange={(v) => setFooter("copyright", v)} />
            </FieldGrid>
          </SectionCard>
          <SectionCard title="Footer Navigation" description="Policy links and social profiles.">
            <div className="space-y-4">
              <ObjectListEditor label="Footer links" items={v2.footer?.links || []} newItem={{ label: "", href: "#" }} columns={[{ key: "label", label: "Label" }, { key: "href", label: "Href" }]} onChange={(v) => setFooter("links", v)} />
              <ObjectListEditor label="Social links" items={v2.footer?.socials || []} newItem={{ label: "", href: "#" }} columns={[{ key: "label", label: "Label" }, { key: "href", label: "Href" }]} onChange={(v) => setFooter("socials", v)} />
            </div>
          </SectionCard>
          </TabsContent>
        </Tabs>
        <CmsPreviewRail ebook={state.ebook} v2={v2} />
      </div>
    </CmsForm>
  );
}

function CmsForm({ title, description, onSave, children }: { title: string; description: string; onSave: (form: HTMLFormElement) => void; children: React.ReactNode }) {
  return (
    <PanelShell title={title} description={description}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(e.currentTarget); }} className="space-y-5">
        <div className="space-y-5">{children}</div>
        <div className="sticky bottom-4 z-10 flex justify-end border-t border-[#dce7e1] bg-[#f4f7f5]/90 py-4 backdrop-blur">
          <Button className={cn("min-w-36", primaryButtonClass)}><Save className="size-4" /> Save CMS</Button>
        </div>
      </form>
    </PanelShell>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [active, setActive] = useState<AdminView>("cms-v2");
  const [state, setState] = useState<AdminState>(emptyState);
  const [loading, setLoading] = useState(Boolean(token));

  async function load(currentToken = token) {
    if (!currentToken) return;
    setLoading(true);
    try {
      const [settings, orders, products] = await Promise.all([
        authed(currentToken, "/api/admin/settings").then(readJson),
        authed(currentToken, "/api/admin/orders").then(readJson),
        authed(currentToken, "/api/admin/products").then(readJson)
      ]);
      setState((s) => ({ ...s, ...mergeAdminPayload(settings), orders: orders.orders || [], products: products.products || [] }));
    } catch (error: any) {
      toast.error(error.message || "Admin data load failed");
      localStorage.removeItem("adminToken");
      setToken("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onLogin(nextToken: string, payload: any) {
    setToken(nextToken);
    setState((s) => ({ ...s, ...mergeAdminPayload(payload) }));
    load(nextToken);
  }

  function logout() {
    localStorage.removeItem("adminToken");
    setToken("");
  }

  async function saveSettings(form: HTMLFormElement) {
    const formData = new FormData(form);
    formData.set("title", state.ebook.title);
    formData.set("subtitle", state.ebook.subtitle);
    formData.set("description", state.ebook.description || "");
    formData.set("price", String(state.ebook.price || 0));
    formData.set("originalPrice", String(state.ebook.originalPrice || 0));
    formData.set("bkashNumber", state.payment.bkashNumber || "");
    formData.set("nagadNumber", state.payment.nagadNumber || "");
    formData.set("instructions", state.payment.instructions || "");
    formData.set("contentJson", JSON.stringify(state.content));
    try {
      const data = await authed(token, "/api/admin/settings", { method: "PUT", body: formData }).then(readJson);
      setState((s) => ({ ...s, ...mergeAdminPayload(data) }));
      toast.success("Settings saved");
    } catch (error: any) {
      toast.error(error.message || "Save failed");
    }
  }

  async function patchOrder(id: string, body: any) {
    try {
      const data = await authed(token, `/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then(readJson);
      setState((s) => ({ ...s, orders: s.orders.map((o) => (o._id === id ? data.order : o)) }));
      toast.success("Order updated");
    } catch (error: any) {
      toast.error(error.message || "Order update failed");
    }
  }

  async function patchProduct(id: string, body: any) {
    try {
      const data = await authed(token, `/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then(readJson);
      setState((s) => ({ ...s, products: s.products.map((p) => (p._id === id ? data.product : p)) }));
      toast.success("Product updated");
    } catch (error: any) {
      toast.error(error.message || "Product update failed");
    }
  }

  async function createProduct(form: HTMLFormElement) {
    try {
      const data = await authed(token, "/api/admin/products", { method: "POST", body: new FormData(form) }).then(readJson);
      setState((s) => ({ ...s, products: [data.product, ...s.products] }));
      form.reset();
      toast.success("Product created");
    } catch (error: any) {
      toast.error(error.message || "Product create failed");
    }
  }

  if (!token) return <AdminLogin onLogin={onLogin} />;

  return (
    <AdminLayout active={active} setActive={setActive} onLogout={logout}>
      {loading ? <p className="text-sm text-[#60746b]">Loading admin data...</p> : (
        <>
          {active === "overview" && <OverviewPanel state={state} />}
          {active === "orders" && <OrdersPanel state={state} patchOrder={patchOrder} />}
          {active === "products" && <ProductsPanel state={state} createProduct={createProduct} patchProduct={patchProduct} />}
          {active === "settings" && <SettingsPanel state={state} setState={setState} saveSettings={saveSettings} />}
          {active === "cms-core" && <CmsCorePanel state={state} setState={setState} saveSettings={saveSettings} />}
          {active === "cms-v2" && <CmsV2Panel state={state} setState={setState} saveSettings={saveSettings} />}
        </>
      )}
    </AdminLayout>
  );
}
