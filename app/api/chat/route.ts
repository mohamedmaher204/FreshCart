import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";

// ─── Webhook helper ──────────────────────────────────────────────────────────
async function fireWebhook(payload: Record<string, unknown>) {
  const url = process.env.CHATBOT_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch { /* non-blocking */ }
}

// ─── Types ───────────────────────────────────────────────────────────────────
type Intent =
  | "PRODUCT_SEARCH"
  | "DISCOUNTS"
  | "PAYMENT"
  | "ORDER_TRACK"
  | "DELIVERY"
  | "GREETING"
  | "CONTACT"
  | "CATEGORIES"
  | "KEYWORD_SEARCH"   // ← NEW: free-text product search from DB
  | "FALLBACK";

type Lang = "en" | "ar";

interface IntentMatch {
  intent: Intent;
  category?: string;
  keyword?: string;
}

// ─── Stop words (filtered before keyword search) ─────────────────────────────
const STOP_WORDS = new Set([
  // English
  "a","an","the","is","are","there","do","does","have","has","can","i","you",
  "me","my","we","it","in","on","of","for","to","and","or","with","what",
  "which","show","find","get","tell","give","want","need","please","any",
  "some","all","how","where","when","who",
  // Arabic — question & filler words
  "في","من","على","إلى","الى","هل","ما","هو","هي","هذا","هذه","هناك",
  "عندي","عندك","عندكم","أريد","اريد","أبي","ابحث","اعرض","لي","لك",
  "يا","انا","ان","اي","اللي","عن","مع","بس","بعض","كل","فيه","فيها",
  "ممكن","يوجد","توجد","موجود","موجوده","موجودة","هناك","عنده","عندها",
  "فين","وين","اللي","بيع","بيعوا","عرض","اعرفني","قولي","شوف",
]);

// ─── Category aliases (EN + AR) ──────────────────────────────────────────────
const CATEGORY_ALIASES: Record<string, string[]> = {
  Electronics: [
    "electronics","إلكترونيات","الكترونيات",
    "laptop","لاب توب","لابتوب","نوت بوك","notebook",
    "phone","phones","تليفون","تليفونات",
    "موبايل","موبايلات","mobile","mobiles",
    "جوال","جوالات","جوالي",  // ← KEY FIX
    "iphone","آيفون","ايفون","samsung","سامسونج","android",
    "tablet","تابلت","آيباد","ايباد","ipad",
    "computer","كمبيوتر","pc","desktop",
    "tv","تلفزيون","شاشة","monitor","screen",
    "headphone","سماعة","سماعات","earphone","airpods",
    "charger","شاحن","powerbank","باور بانك",
    "camera","كاميرا",
  ],
  Fashion: [
    "fashion","أزياء","ازياء","clothes","ملابس",
    "shirt","قميص","dress","فستان","بلوزة",
    "shoes","جزمة","حذاء","احذية","sneakers",
    "تيشرت","t-shirt","jeans","جينز","jacket","جاكيت",
    "bag","شنطة","حقيبة","watch","ساعة",
  ],
  "Home & Garden": [
    "home","منزل","بيت","furniture","أثاث","اثاث",
    "kitchen","مطبخ","garden","حديقة","ديكور",
    "sofa","كنبة","bed","سرير","curtain","ستارة",
  ],
  Grocery: [
    "grocery","بقالة","food","أكل","اكل",
    "fresh","طازج","fruit","فاكهة","خضروات","vegetables",
    "juice","عصير","water","مياه",
  ],
  Sports: [
    "sports","رياضة","sport","gym","جيم","fitness","exercise",
    "basketball","كرة السلة","كرة سلة",
    "football","soccer","كرة القدم","كرة قدم","كرة",
    "tennis","تنس","swimming","سباحة",
    "yoga","يوغا","running","جري",
  ],
  Beauty: [
    "beauty","جمال","makeup","مكياج","perfume","عطر",
    "skincare","كريم","عناية","lipstick","احمر شفاه",
    "shampoo","شامبو","lotion","لوشن",
  ],
};

// ─── Extract searchable keywords from raw message ────────────────────────────
function extractKeywords(message: string): string {
  // Keep Arabic + Latin letters and numbers, remove punctuation
  return message
    .replace(/[^\w\u0600-\u06FF\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()))
    .join(" ")
    .trim();
}

// ─── Intent detector ─────────────────────────────────────────────────────────
function detectIntent(message: string): IntentMatch {
  const lower = message.toLowerCase();

  // 1. Greeting
  if (/^(hi|hello|hey|مرحبا|أهلا|اهلا|هاي|السلام|سلام|صباح|مساء)\b/.test(lower)) {
    return { intent: "GREETING" };
  }

  // 2. Order tracking
  if (/(order|طلب|طلباتي|track|تتبع|status|حالة|وصل طلبي|فين طلبي)/.test(lower)) {
    return { intent: "ORDER_TRACK" };
  }

  // 3. Discounts / offers
  if (/(discount|خصم|خصومات|offer|عروض|sale|تخفيض|promo|كوبون|coupon|deal|اوفر)/.test(lower)) {
    return { intent: "DISCOUNTS" };
  }

  // 4. Payment methods
  if (/(pay|دفع|payment|طرق الدفع|visa|mastercard|credit|كارت|بطاقة|cash|كاش|online)/.test(lower)) {
    return { intent: "PAYMENT" };
  }

  // 5. Delivery / shipping
  if (/(deliver|توصيل|shipping|شحن|how long|كام يوم|كم يوم|days|return|استرجاع|refund|رجعه)/.test(lower)) {
    return { intent: "DELIVERY" };
  }

  // 6. Contact / support
  if (/(contact|تواصل|support|دعم|help|مساعده|مساعدة|phone|email|complaint|شكوى)/.test(lower)) {
    return { intent: "CONTACT" };
  }

  // 7. Categories list
  if (/(categor|قسم|أقسام|اقسام|sections|كل المنتجات|عندكم ايه|ايه عندكم|بتبيعوا ايه)/.test(lower)) {
    return { intent: "CATEGORIES" };
  }

  // 8. Category-specific product search
  for (const [cat, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some((a) => lower.includes(a))) {
      return { intent: "PRODUCT_SEARCH", category: cat };
    }
  }

  // 9. Explicit product-search trigger words (no specific category)
  if (/(product|منتج|منتجات|show me|اعرض|find|بحث|available|متاح|buy|اشتري|عايز|عاوز|ابغى|شوفلي|في عندكم)/.test(lower)) {
    const kw = extractKeywords(message);
    return { intent: "PRODUCT_SEARCH", keyword: kw || undefined };
  }

  // 10. ← KEY FIX: Any unrecognised message → try keyword DB search
  const kw = extractKeywords(message);
  if (kw.length > 0) {
    return { intent: "KEYWORD_SEARCH", keyword: kw };
  }

  return { intent: "FALLBACK" };
}

// ─── Format product list ──────────────────────────────────────────────────────
function formatProductList(
  products: Array<{ title: string; price: number; priceAfterDiscount?: number | null; category: string }>,
  lang: Lang,
  query?: string
): string {
  if (products.length === 0) {
    return lang === "en"
      ? `Sorry, I couldn't find any products matching **"${query}"**. 😔\n\nTry browsing our [Products page](/products) or ask about a category!`
      : `عذراً، لم أجد منتجات تطابق **"${query}"**. 😔\n\nجرب تصفح [صفحة المنتجات](/products) أو اسألني عن قسم معين!`;
  }

  const lines = products.slice(0, 5).map((p) => {
    const price =
      p.priceAfterDiscount && p.priceAfterDiscount < p.price
        ? `~~$${p.price}~~ **$${p.priceAfterDiscount}** 🔥`
        : `**$${p.price}**`;
    return `• ${p.title} — ${price} _(${p.category})_`;
  });

  const header = lang === "en"
    ? `🛍️ Here are products matching **"${query}"**:\n\n`
    : `🛍️ المنتجات المتعلقة بـ **"${query}"**:\n\n`;

  const footer = products.length > 5
    ? lang === "en"
      ? `\n\n_...and ${products.length - 5} more. [See all](/products)_`
      : `\n\n_...و ${products.length - 5} منتج آخر. [شاهد الكل](/products)_`
    : "";

  return header + lines.join("\n") + footer;
}

// ─── Main POST handler ────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string = (body.message || "").trim();
    const lang: Lang = body.lang === "ar" ? "ar" : "en";

    if (!message) {
      return NextResponse.json(
        { reply: lang === "en" ? "Please type a message." : "من فضلك اكتب رسالة." },
        { status: 400 }
      );
    }

    // Session (for order tracking)
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;

    const { intent, category, keyword } = detectIntent(message);

    // Fire webhook (non-blocking)
    fireWebhook({ message, lang, intent, keyword, userId: userId || null, timestamp: new Date().toISOString() });

    let reply = "";

    switch (intent) {

      // ── Greeting ───────────────────────────────────────────────────────────
      case "GREETING":
        reply = lang === "en"
          ? "Hello! 👋 Welcome to FreshCart. I can help you with:\n\n• **Products** — search by name or category\n• **Deals** — current discounts\n• **Payment** — accepted methods\n• **Delivery** — shipping times\n• **Orders** — track your orders\n\nWhat would you like to know?"
          : "مرحباً! 👋 أهلاً بك في FreshCart. أقدر أساعدك في:\n\n• **المنتجات** — ابحث باسم أو قسم\n• **العروض** — الخصومات الحالية\n• **الدفع** — طرق الدفع المتاحة\n• **التوصيل** — مواعيد الشحن\n• **الطلبات** — تتبع طلباتك\n\nبماذا يمكنني مساعدتك؟";
        break;

      // ── Product search (by category ± keyword) ─────────────────────────────
      case "PRODUCT_SEARCH": {
        const where: any = {};
        if (category) where.category = category;
        if (keyword && !category) {
          where.OR = [
            { title:       { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
            { category:    { contains: keyword, mode: "insensitive" } },
            { brand:       { contains: keyword, mode: "insensitive" } },
          ];
        }

        const products = await prisma.product.findMany({
          where,
          take: 20,
          orderBy: { sold: "desc" },
          select: { title: true, price: true, priceAfterDiscount: true, category: true },
        });
        reply = formatProductList(products, lang, category || keyword || message);
        break;
      }

      // ── FREE KEYWORD search (the main fix for "there are BASKETBALL") ───────
      case "KEYWORD_SEARCH": {
        const kw = keyword || message;
        // Split keywords and build a multi-OR query so "blue basketball shoes" works
        const tokens = kw.split(/\s+/).filter(Boolean);
        const orConditions = tokens.flatMap((t) => [
          { title:       { contains: t, mode: "insensitive" as const } },
          { description: { contains: t, mode: "insensitive" as const } },
          { category:    { contains: t, mode: "insensitive" as const } },
          { brand:       { contains: t, mode: "insensitive" as const } },
        ]);

        const products = await prisma.product.findMany({
          where: { OR: orConditions },
          take: 20,
          orderBy: { sold: "desc" },
          select: { title: true, price: true, priceAfterDiscount: true, category: true },
        });
        reply = formatProductList(products, lang, kw);
        break;
      }

      // ── Discounts ──────────────────────────────────────────────────────────
      case "DISCOUNTS": {
        const products = await prisma.product.findMany({
          where: { priceAfterDiscount: { not: null } },
          take: 20,
          orderBy: { sold: "desc" },
          select: { title: true, price: true, priceAfterDiscount: true, category: true },
        });

        if (products.length === 0) {
          reply = lang === "en"
            ? "No active discounts right now. Check back soon! 😊"
            : "لا توجد خصومات نشطة حالياً. تابعنا قريباً! 😊";
        } else {
          const header = lang === "en" ? "🔥 Current Deals & Discounts:\n\n" : "🔥 العروض والخصومات الحالية:\n\n";
          const lines = products.slice(0, 5).map((p) => {
            const saved = p.price - (p.priceAfterDiscount ?? p.price);
            const pct   = Math.round((saved / p.price) * 100);
            return `• **${p.title}** — ~~$${p.price}~~ → **$${p.priceAfterDiscount}** _(Save ${pct}%!)_`;
          });
          reply = header + lines.join("\n");
        }
        break;
      }

      // ── Payment ────────────────────────────────────────────────────────────
      case "PAYMENT":
        reply = lang === "en"
          ? "💳 Accepted payment methods:\n\n• **Visa / Mastercard** — secure online payment\n• **Cash on Delivery** — pay when order arrives\n• **Stripe** — fast & encrypted checkout\n\nAll transactions are SSL-encrypted. 🔒"
          : "💳 طرق الدفع المتاحة:\n\n• **فيزا / ماستركارد** — دفع إلكتروني آمن\n• **الدفع عند الاستلام** — ادفع لما يوصل طلبك\n• **Stripe** — دفع إلكتروني سريع ومشفر\n\nجميع المعاملات مشفرة بـ SSL. 🔒";
        break;

      // ── Delivery ───────────────────────────────────────────────────────────
      case "DELIVERY":
        reply = lang === "en"
          ? "🚚 Delivery & Shipping:\n\n• Standard: **2–5 business days**\n• Free shipping on orders over **$50**\n• Returns within **14 days**\n• Damaged item? Contact support immediately."
          : "🚚 التوصيل والشحن:\n\n• المعتاد: **من 2 إلى 5 أيام عمل**\n• شحن مجاني للطلبات فوق **50 دولار**\n• الاسترجاع خلال **14 يوم**\n• منتج تالف؟ تواصل مع الدعم فوراً.";
        break;

      // ── Order tracking ─────────────────────────────────────────────────────
      case "ORDER_TRACK": {
        if (!userId) {
          reply = lang === "en"
            ? "🔐 Please **log in** first to track your orders. After logging in, visit **My Orders** or ask me again!"
            : "🔐 يجب **تسجيل الدخول** أولاً لتتبع طلباتك. بعد الدخول، تفضل بزيارة **طلباتي** أو اسألني مجدداً!";
        } else {
          const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: { id: true, totalPrice: true, isPaid: true, isDelivered: true, createdAt: true },
          });
          if (orders.length === 0) {
            reply = lang === "en"
              ? "You have no orders yet. Start shopping now! 🛒"
              : "ليس لديك طلبات بعد. ابدأ التسوق الآن! 🛒";
          } else {
            const lines = orders.map((o) => {
              const date   = new Date(o.createdAt).toLocaleDateString();
              const status = o.isDelivered
                ? lang === "en" ? "✅ Delivered"   : "✅ تم التوصيل"
                : o.isPaid
                ? lang === "en" ? "📦 Processing"  : "📦 قيد المعالجة"
                : lang === "en" ? "⏳ Pending"     : "⏳ في الانتظار";
              return `• Order #${o.id.slice(-6)} — **$${o.totalPrice.toFixed(2)}** — ${status} _(${date})_`;
            });
            const header = lang === "en" ? "📦 Your latest orders:\n\n" : "📦 آخر طلباتك:\n\n";
            const footer = lang === "en" ? "\n\nVisit **My Orders** for full details." : "\n\nزر **طلباتي** للتفاصيل الكاملة.";
            reply = header + lines.join("\n") + footer;
          }
        }
        break;
      }

      // ── Categories ─────────────────────────────────────────────────────────
      case "CATEGORIES": {
        const cats = await prisma.product.findMany({
          distinct: ["category"],
          select: { category: true },
          orderBy: { category: "asc" },
        });
        const list = cats.map((c) => `• ${c.category}`).join("\n");
        reply = lang === "en"
          ? `🗂️ Our product categories:\n\n${list}\n\nJust ask about any category to see its products!`
          : `🗂️ أقسام المنتجات لدينا:\n\n${list}\n\nاسألني عن أي قسم لمشاهدة منتجاته!`;
        break;
      }

      // ── Contact ────────────────────────────────────────────────────────────
      case "CONTACT":
        reply = lang === "en"
          ? "📞 Our support team is available **24/7**!\n\n• **Email:** support@freshcart.com\n• **Phone:** +1 (800) FRESH-01\n• Or click the **Contact Support** button below."
          : "📞 فريق الدعم متاح **24/7**!\n\n• **البريد:** support@freshcart.com\n• **الهاتف:** 01 FRESH 800 1+\n• أو اضغط على زر **تواصل مع الدعم** أدناه.";
        break;

      // ── Fallback (this should rarely fire now) ─────────────────────────────
      default:
        reply = lang === "en"
          ? "🤔 I'm not sure I understood that.\n\nYou can ask me about:\n• **Products** — by name or category\n• **Discounts** — current deals\n• **Payment** — accepted methods\n• **Delivery** — shipping info\n• **Orders** — track your orders"
          : "🤔 لم أفهم سؤالك تماماً.\n\nيمكنك سؤالي عن:\n• **المنتجات** — بالاسم أو القسم\n• **الخصومات** — العروض الحالية\n• **الدفع** — طرق الدفع\n• **التوصيل** — الشحن والمواعيد\n• **الطلبات** — تتبع طلباتك";
    }

    return NextResponse.json({ reply, intent });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again.", intent: "FALLBACK" },
      { status: 500 }
    );
  }
}
