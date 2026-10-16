import "./OrderTracker.css";

const steps = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Delivered",
];

function OrderTracker({ status = "Pending" }) {
  const normalizedStatus = status.trim().toLowerCase();

  const currentStep = steps.findIndex(
    (step) => step.toLowerCase() === normalizedStatus
  );

  // Default to Pending if an unknown status is received.
  const activeStep = currentStep === -1 ? 0 : currentStep;

  return (
    <section
      className="order-tracker card border-0 shadow-sm rounded-4"
      aria-label={`Order status: ${steps[activeStep]}`}
    >
      <div className="card-body p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="text-uppercase text-secondary small fw-semibold mb-1">
              Order progress
            </p>
            <h6 className="mb-0 fw-bold text-dark">
              Current status:{" "}
              <span className="text-success">{steps[activeStep]}</span>
            </h6>
          </div>

          <span className="badge rounded-pill tracker-status-badge">
            Step {activeStep + 1} of {steps.length}
          </span>
        </div>

        <div className="tracker-steps">
          {steps.map((step, index) => {
            const isComplete = index < activeStep;
            const isCurrent = index === activeStep;
            const isUpcoming = index > activeStep;

            return (
              <div
                key={step}
                className={`tracker-item ${
                  isComplete
                    ? "is-complete"
                    : isCurrent
                    ? "is-current"
                    : "is-upcoming"
                }`}
              >
                <div className="tracker-indicator">
                  <div
                    className="tracker-circle"
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`${step}: ${
                      isComplete
                        ? "completed"
                        : isCurrent
                        ? "current"
                        : "upcoming"
                    }`}
                  >
                    {isComplete ? (
                      <span aria-hidden="true">✓</span>
                    ) : isCurrent ? (
                      <span className="tracker-current-dot" aria-hidden="true" />
                    ) : (
                      <span className="tracker-step-number" aria-hidden="true">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {index < steps.length - 1 && (
                    <div className="tracker-line" aria-hidden="true" />
                  )}
                </div>

                <span className="tracker-label">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default OrderTracker;