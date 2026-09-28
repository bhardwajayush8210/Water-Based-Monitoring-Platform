import React from "react";

const PayBill = ({ amount, onSuccess }) => {
  const handlePayment = () => {
    const options = {
      key: "rzp_test_TGDUW4Hsmg1rps",

      amount: amount * 100,

      currency: "INR",

      name: "Water Billing System",

      description: "Water Bill Payment",

      handler: function (response) {
        console.log(response);

        alert("Payment Successful");

        if (onSuccess) {
          onSuccess();
        }
      },

      prefill: {
        name: "Resident",
        email: "resident@gmail.com",
        contact: "9999999999",
      },

      theme: {
        color: "#0EA5E9",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };

  return (
    <button className="wm-btn-primary-sm" onClick={handlePayment}>
      Pay ₹{Number(amount || 0).toFixed(2)}
    </button>
  );
};

export default PayBill;
