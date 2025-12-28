// tracking.js

async function renderTimeline(orderId) {
  if (!orderId) return;
  const title = document.getElementById("trackingTitle");
  const timeline = document.getElementById("timeline");

  try {
    const res = await fetch(
      `https://globaljet-rr9l.onrender.com/track/${orderId}`
    );
    const result = await res.json();

    if (!result.success || !result.data) {
      if (timeline) {
        timeline.innerHTML = `<p style="color:red; font-weight:bold; text-align:center">${
          result.error || "Tracking info not found."
        }</p>`;
      }
      return;
    }

    const data = result.data;

    // Update header
    if (title) {
      title.textContent = `Tracking for Package ID #${data.tracking_id}`;
    }

    if (!timeline) return;

    // Define all steps exactly like your HTML
    const steps = [
      {
        label: "Order Placed",
        description: "Delivery order created",
        date: data.created_at || "Done",
        key: "order_placed",
      },
      {
        label: "Picked Up",
        description: `Package collected from ${
          data.origin || "sender's address"
        }`,
        date: "Done",
        key: "picked_up",
      },
      // {
      //   label: "In Transit",
      //   description: "Moving through logistics network",
      //   date: "TBA",
      //   key: "in_transit",
      // },
      // {
      //   label: "Arrived at Hub",
      //   description: "Package reached regional distribution center",
      //   date: "TBA",
      //   key: "arrived_hub",
      // },
      {
        label: "Out for Delivery",
        description: "Courier is delivering the package",
        date: "Done",
        key: "out_for_delivery",
      },
      {
        label: "Delivery Attempted",
        description: "Courier attempted delivery",
        date: "Done",
        key: "delivery_attempted",
      },
      {
        label: "Delivered",
        description: `Package successfully delivered to ${
          data.destination || "Destination Address"
        }`,
        date: data.updated_at || "Done",
        key: "delivered",
      },
    ];

    // Map API status to step progress
    // Example mapping (adjust depending on your API's status field)
    const statusOrder = [
      "pending", // only Order Placed active
      "picked", // first 2 steps active
      "out", // first 3 steps active
      "attempted", // first 4 steps active
      "delivered", // all 5 steps active
    ];

    const activeIndex = statusOrder.indexOf(data.status.toLowerCase());

    // Generate timeline HTML
    timeline.innerHTML = steps
      .map(
        (step, index) => `
        <div class="d-item ${index <= activeIndex ? "active" : ""}">
          <div class="d-text">
            <div class="d-icon"><i class="fa fa-check"></i></div>
            <h4>${step.label}</h4>
            ${step.description ? step.description : ""}
          </div>
          <div class="d-date">${step.date}</div>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error(err.error);
  }
}

// Function for button page
function handleTrackButton() {
  const btn = document.getElementById("trackBtn");
  if (!btn) return;

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const orderId = document.getElementById("order_id").value.trim();
    if (!orderId) {
      alert("Please enter your tracking number");
      return;
    }

    window.location.href = `track-result.html?order=${encodeURIComponent(
      orderId
    )}`;
  });
}

// Auto-run
document.addEventListener("DOMContentLoaded", () => {
  handleTrackButton();

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order");
  if (orderId) {
    renderTimeline(orderId);
  }
});
