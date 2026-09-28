import { useEffect, useRef, useState } from "react";

// PayPal Sandbox / Test Mode button - frontend only, no backend order
// verification. Uses PayPal's public sandbox test client ID ("sb"),
// which lets anyone demo the checkout flow without a PayPal developer
// account. No real money is ever charged. Since there's no backend
// capture/verification step, "paid" status here is a client-side demo
// only (tracked in localStorage) - it does not persist server-side or
// sync across devices.
const PAYPAL_SANDBOX_CLIENT_ID =
  "ATwgRlwg0Bzf2OnJPf9hobQA-pwIIcPntXQv9Jxss_ZyIUmjY5PYCB1sWYTXrB8fbMt3XtQpvRGRlNK5";

let sdkPromise = null;

function loadPayPalSdk() {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_SANDBOX_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
    document.body.appendChild(script);
  });

  return sdkPromise;
}

// amountInr is converted to a nominal USD figure purely so PayPal
// Sandbox (which processes in USD) has a valid, non-zero amount to
// show in its test checkout - this is not a real currency conversion.
function PayPalButton({ amountInr, onSuccess }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const demoUsdAmount = Math.max(amountInr / 83, 0.5).toFixed(2);

    loadPayPalSdk()
      .then((paypal) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = "";

        paypal
          .Buttons({
            style: {
              layout: "horizontal",
              height: 38,
              tagline: false,
              shape: "pill",
            },
            createOrder: (data, actions) =>
              actions.order.create({
                purchase_units: [{ amount: { value: demoUsdAmount } }],
              }),
            onApprove: (data, actions) =>
              actions.order.capture().then(() => {
                if (!cancelled) onSuccess();
              }),
            onError: (err) => {
              console.error(err);
              if (!cancelled)
                setError("Sandbox payment failed. Please try again.");
            },
          })
          .render(containerRef.current);

        if (!cancelled) setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load PayPal Sandbox.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountInr]);

  return (
    <div>
      {loading && (
        <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0" }}>
          Loading PayPal Sandbox...
        </p>
      )}
      {error && (
        <p style={{ fontSize: 12, color: "#EF4444", margin: "4px 0" }}>
          {error}
        </p>
      )}
      <div ref={containerRef} style={{ maxWidth: 260 }} />
    </div>
  );
}

export default PayPalButton;
