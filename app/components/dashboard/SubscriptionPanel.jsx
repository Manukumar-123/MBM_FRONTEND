"use client";

import { useState } from "react";
import Button from "../ui/Button";

const FEATURES = [
  "Unlimited uploads", "Pitch Alley access", "Ask the Universe requests",
  "Custom QR codes", "Priority support", "Advanced analytics",
];

function formatMoney(cents, currency = "INR") {
  const symbol = currency === "INR" ? "₹" : "$";
  return `${symbol}${(cents / 100).toFixed(2)}`;
}

export default function SubscriptionPanel({ initialSubscription, initialBillingHistory }) {
  const [subscription, setSubscription] = useState(initialSubscription);
  const [billingHistory] = useState(initialBillingHistory);

  function handleChangePlan(plan) {
    setSubscription((prev) => ({ ...prev, plan, status: "active" }));
  }

  function handleCancel() {
    if (!confirm("Cancel your subscription? You'll keep access until the current period ends.")) return;
    setSubscription((prev) => ({ ...prev, status: "canceled" }));
  }

  const isPro = subscription.plan === "creator_pro";

  return (
    <div>
      <h1 className="text-[22px] font-bold font-display mb-1">Subscription &amp; billing</h1>
      <p className="text-gray-400 text-[13.5px] mb-6">Manage your plan, payment method and past invoices.</p>

      <div className="relative overflow-hidden bg-gradient-to-br from-surface to-[#08090F] border border-borderline rounded-2xl p-6 mb-6">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(360px 200px at 95% -10%, rgba(47,211,240,0.14), transparent 70%)" }} />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 bg-cyan/10 border border-cyan/30 text-cyan text-[11px] font-bold px-2.5 py-1 rounded-full mb-2.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 7.1L12 17.8 5.8 21.3 7 14.2 2 9.3l7.1-1z" /></svg>
            CURRENT PLAN
          </span>
          <div className="text-xl font-bold font-display mb-1">{isPro ? "Creator Pro" : "Free"}</div>
          <div className="text-[13px] text-gray-400 mb-5">
            {subscription.status === "canceled"
              ? "Canceled — access continues until the end of the billing period"
              : subscription.renewsAt
              ? <>Renews {new Date(subscription.renewsAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at <b className="text-cyan-200" style={{ color: "#7FE3F5" }}>{formatMoney(subscription.priceCents, subscription.currency)}/month</b></>
              : "No active billing cycle"}
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-2.5 mb-6">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-[12.5px] text-gray-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7FE3F5" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>
                {f}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {!isPro && (
              <Button shape="rect" onClick={() => handleChangePlan("creator_pro")}>
                Upgrade to Creator Pro
              </Button>
            )}
            {isPro && (
              <>
                <Button shape="rect" variant="secondary" onClick={() => handleChangePlan("free")}>
                  Downgrade to Free
                </Button>
                {subscription.status !== "canceled" && (
                  <Button shape="rect" variant="danger" onClick={handleCancel}>
                    Cancel subscription
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {subscription.paymentMethod?.last4 && (
        <>
          <h2 className="text-sm font-bold mb-3">Payment method</h2>
          <div className="flex items-center gap-3 bg-surface border border-borderline-soft rounded-2xl p-4 mb-6">
            <div className="w-10 h-7 rounded bg-gradient-to-br from-[#2A2622] to-[#4A4033] grid place-items-center text-cyan-200" style={{ color: "#7FE3F5" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
            </div>
            <div>
              <div className="text-[13.5px] font-semibold">{subscription.paymentMethod.brand} ending in {subscription.paymentMethod.last4}</div>
              <div className="text-xs text-gray-600">Expires {subscription.paymentMethod.expiry}</div>
            </div>
            <button className="ml-auto bg-surface border border-borderline rounded-lg px-3 py-1.5 text-xs font-bold hover:border-cyan hover:text-cyan">Update</button>
          </div>
        </>
      )}

      <h2 className="text-sm font-bold mb-3">Billing history</h2>
      <div className="bg-surface border border-borderline-soft rounded-2xl overflow-hidden">
        {billingHistory.length === 0 ? (
          <div className="p-5 text-sm text-gray-500">No invoices yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11.5px] text-gray-600">
                <th className="px-4 py-2.5 border-b border-borderline-soft font-semibold">Date</th>
                <th className="px-4 py-2.5 border-b border-borderline-soft font-semibold">Description</th>
                <th className="px-4 py-2.5 border-b border-borderline-soft font-semibold">Amount</th>
                <th className="px-4 py-2.5 border-b border-borderline-soft font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((b, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 border-b border-borderline-soft last:border-0">{new Date(b.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-3 border-b border-borderline-soft last:border-0">{b.description}</td>
                  <td className="px-4 py-3 border-b border-borderline-soft last:border-0">{formatMoney(b.amountCents)}</td>
                  <td className="px-4 py-3 border-b border-borderline-soft last:border-0">
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-teal/15 text-teal capitalize">{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
