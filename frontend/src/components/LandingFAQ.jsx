import { useState } from "react";
import { ChevronDown, QuestionCircleFill } from "react-bootstrap-icons";

const faqs = [
  {
    q: "How is my water bill calculated under the tiered structure?",
    a: "Your water bill is divided into Tier 1 and Tier 2. Tier 1 applies a standard base rate up to a designated monthly consumption threshold (e.g., 1,500 L). Any water consumed beyond that threshold is billed at Tier 2 rates to promote conservation.",
  },
  {
    q: "How are my daily meter readings entered into the system?",
    a: "Readings are recorded and entered directly by your Community Admin. You can track your daily consumption trends under the 'Usage History' tab.",
  },
  {
    q: "How do support tickets get resolved?",
    a: "When you raise a concern, local hardware or billing issues automatically route to your Community Admin's dashboard. Platform bugs or technical issues route directly to the Super Admin.",
  },
  {
    q: "Can I download my past water invoices?",
    a: "Yes, you can view the complete breakdown or download formal tax invoice PDFs directly from the 'My Invoices' section.",
  },
];

export default function LandingFAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="py-5" style={{ background: "#F8FAFC" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div className="text-center mb-4">
          <QuestionCircleFill size={32} color="#0EA5E9" className="mb-2" />
          <h2 style={{ fontWeight: 700, color: "#0F172A" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-muted">
            Common questions about usage, billing, and support
          </p>
        </div>

        <div className="d-flex flex-column gap-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <button
                className="w-100 p-3 text-start border-0 d-flex justify-content-between align-items-center fw-semibold"
                style={{
                  background: openIdx === index ? "#F1F5F9" : "#fff",
                  color: "#0F172A",
                }}
                onClick={() => setOpenIdx(openIdx === index ? null : index)}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  style={{
                    transform:
                      openIdx === index ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {openIdx === index && (
                <div
                  className="p-3 text-muted border-top"
                  style={{ fontSize: "14px", lineHeight: "1.6" }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
