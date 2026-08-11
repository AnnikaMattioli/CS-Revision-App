import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) throw new Error("Add STRIPE_SECRET_KEY to .env.local before provisioning Stripe.");
if (!secretKey.startsWith("sk_test_")) throw new Error("Refusing to provision with anything other than a Stripe test secret key.");
if (process.env.STRIPE_MODE && process.env.STRIPE_MODE !== "test") throw new Error("Set STRIPE_MODE=test before provisioning.");

const stripe = new Stripe(secretKey, { appInfo: { name: "Bytewise Revision", version: "0.1.0" } });
const catalogue = [
  {
    family: "student_plus",
    name: "Student Plus",
    description: "Personalised revision, advanced feedback and progress insights for Computer Science students.",
    prices: [
      { planId: "student_plus_monthly", interval: "month", amount: 599, env: "STRIPE_STUDENT_PLUS_MONTHLY_PRICE_ID" },
      { planId: "student_plus_annual", interval: "year", amount: 4_900, env: "STRIPE_STUDENT_PLUS_ANNUAL_PRICE_ID" },
    ],
  },
  {
    family: "teacher_pro",
    name: "Teacher Pro",
    description: "Advanced class management, assignment tools and learning analytics for Computer Science teachers.",
    prices: [
      { planId: "teacher_pro_monthly", interval: "month", amount: 2_499, env: "STRIPE_TEACHER_PRO_MONTHLY_PRICE_ID" },
      { planId: "teacher_pro_annual", interval: "year", amount: 19_900, env: "STRIPE_TEACHER_PRO_ANNUAL_PRICE_ID" },
    ],
  },
];

async function findOrCreateProduct(definition) {
  const products = await stripe.products.list({ active: true, limit: 100 });
  const existing = products.data.find((product) => product.metadata.bytewise_catalogue === "v1" && product.metadata.bytewise_family === definition.family);
  if (existing) return existing;
  return stripe.products.create({
    name: definition.name,
    description: definition.description,
    metadata: { bytewise_catalogue: "v1", bytewise_family: definition.family },
  }, { idempotencyKey: `bytewise-v1-product-${definition.family}` });
}

async function findOrCreatePrice(product, definition) {
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100, type: "recurring" });
  const existing = prices.data.find((price) =>
    price.metadata.bytewise_plan_id === definition.planId &&
    price.currency === "gbp" &&
    price.unit_amount === definition.amount &&
    price.recurring?.interval === definition.interval,
  );
  if (existing) return existing;
  return stripe.prices.create({
    product: product.id,
    currency: "gbp",
    unit_amount: definition.amount,
    recurring: { interval: definition.interval },
    nickname: definition.planId,
    metadata: { bytewise_catalogue: "v1", bytewise_plan_id: definition.planId },
  }, { idempotencyKey: `bytewise-v1-price-${definition.planId}-${definition.amount}` });
}

const output = [];
const provisioned = new Map();
for (const definition of catalogue) {
  const product = await findOrCreateProduct(definition);
  const familyPrices = [];
  for (const priceDefinition of definition.prices) {
    const price = await findOrCreatePrice(product, priceDefinition);
    familyPrices.push(price.id);
    output.push(`${priceDefinition.env}=${price.id}`);
  }
  provisioned.set(definition.family, { product: product.id, prices: familyPrices });
}

async function findOrCreatePortal(family, name, envName) {
  const existing = (await stripe.billingPortal.configurations.list({ limit: 100 })).data.find((configuration) => configuration.active && configuration.metadata?.bytewise_portal_family === family);
  if (existing) { output.push(`${envName}=${existing.id}`); return; }
  const item = provisioned.get(family);
  const configuration = await stripe.billingPortal.configurations.create({
    name,
    default_return_url: `${(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/billing`,
    business_profile: { headline: "Manage your Bytewise subscription", privacy_policy_url: `${(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/privacy`, terms_of_service_url: `${(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/terms` },
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ["address", "name"] },
      subscription_cancel: { enabled: true, mode: "at_period_end", cancellation_reason: { enabled: true, options: ["too_expensive", "missing_features", "unused", "other"] } },
      subscription_update: { enabled: true, default_allowed_updates: ["price"], proration_behavior: "create_prorations", products: [{ product: item.product, prices: item.prices }], schedule_at_period_end: { conditions: [{ type: "decreasing_item_amount" }] } },
    },
    metadata: { bytewise_catalogue: "v1", bytewise_portal_family: family },
  }, { idempotencyKey: `bytewise-v1-portal-${family}` });
  output.push(`${envName}=${configuration.id}`);
}

await findOrCreatePortal("student_plus", "Bytewise Student billing", "STRIPE_STUDENT_PORTAL_CONFIGURATION_ID");
await findOrCreatePortal("teacher_pro", "Bytewise Teacher billing", "STRIPE_TEACHER_PORTAL_CONFIGURATION_ID");

console.log("Stripe test catalogue and customer portals are ready. Add or update these non-secret values in .env.local:");
console.log(output.join("\n"));
