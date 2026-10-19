
import { useState, useEffect } from "react";
import "./ContactUs.css";
import toast from "react-hot-toast";
import { sendContactMessage } from "../../../services/contactService";


const images = [
  { src: "https://res.cloudinary.com/drky4ztad/image/upload/v1792434192/p1.png", alt: "Jay Gruh Udhyog" },
  { src: "https://res.cloudinary.com/drky4ztad/image/upload/v1792434198/p2.png", alt: "About our business" },
  { src: "https://res.cloudinary.com/drky4ztad/image/upload/v1792434202/p3.png", alt: "Our products" },
  { src: "https://res.cloudinary.com/drky4ztad/image/upload/v1792434212/p4.png", alt: "Quality and taste" },
];

function ContactUs() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [paused]);

  const moveSlide = (direction) => {
    setCurrentIndex(
      (prev) => (prev + direction + images.length) % images.length
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name) {
      toast.error("Name is required.");
      return;
    }

    if (name.length < 2) {
      toast.error("Enter a valid name.");
      return;
    }

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      toast.error(
        "Enter a valid 10-digit phone number."
      );
      return;
    }

    if (!subject) {
      toast.error("Please select an enquiry type.");
      return;
    }

    if (!message) {
      toast.error("Message is required.");
      return;
    }

    if (message.length < 5) {
      toast.error(
        "Message must contain at least 5 characters."
      );
      return;
    }

    try {
      setLoading(true);
      setSubmitted(false);

      const response = await sendContactMessage({
        name,
        email,
        phone,
        subject,
        message,
      });

      if (!response?.success) {
        throw new Error(
          response?.message ||
          "Message could not be sent."
        );
      }

      toast.success(
        "Your message has been sent successfully."
      );

      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Unable to send your message."
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="contact-page">

      {/* Hero Slideshow */}
      <section className="container-fluid py-4">
        <div className="container">
          <div
            className="contact-slider position-relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="d-flex contact-slides"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {images.map((image) => (
                <div className="contact-slide flex-shrink-0 " key={image.src}>
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="slider-arrow slider-prev"
              onClick={() => moveSlide(-1)}
              aria-label="Previous image"
            >
              &#10094;
            </button>

            <button
              type="button"
              className="slider-arrow slider-next"
              onClick={() => moveSlide(1)}
              aria-label="Next image"
            >
              &#10095;
            </button>

            <div className="slider-dots">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.src}
                  className={`slider-dot ${currentIndex === index ? "active" : ""
                    }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Page Heading */}
      <section className="container text-center py-4">
        <p className="contact-subtitle">WE WOULD LOVE TO HEAR FROM YOU</p>
        <h1 className="contact-heading">Contact Us</h1>
        <p className="contact-intro">
          Have a question about our homemade Papad, Shevya, Kurdai,
          Bibde or seasonal products? Get in touch with us.
        </p>
      </section>

      {/* Contact Information and Form */}
      <section className="container pb-5">
        <div className="row g-4">

          {/* Contact Details */}
          <div className="col-lg-5">
            <div className="contact-info h-100">
              <h2>Get In Touch</h2>
              <p className="text-light">
                Your trust, our quality, and taste you'll love —
                all at affordable prices.
              </p>

              <div className="contact-detail">
                <span className="contact-icon">📍</span>
                <div>
                  <h5>Our Location</h5>
                  <p>Pathardi, Maharashtra, India</p>
                </div>
              </div>

              <div className="contact-detail">
                <span className="contact-icon">📞</span>
                <div>
                  <h5>Phone Number</h5>
                  <p>+91 9552232344,+91 7972752787</p>
                </div>
              </div>

              <div className="contact-detail">
                <span className="contact-icon">✉️</span>
                <div>
                  <h5>Email Address</h5>
                  <p>jayeshkale7972@gmail.com</p>
                </div>
              </div>

              <div className="contact-detail">
                <span className="contact-icon">🕒</span>
                <div>
                  <h5>Business Hours</h5>
                  <p>Contact us for product availability and orders.</p>
                </div>
              </div>

              <div className="contact-tagline">
                Freshness, tradition and quality in every bite.
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="col-lg-7">
            <div className="contact-form-card">
              <h2>Send Us A Message</h2>
              <p className="text-secondary mb-4">
                Fill out the form below and tell us how we can help.
              </p>

              {submitted && (
                <div className="alert alert-success" role="status">
                  Your enquiry has been sent successfully. We will get back
                  to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="subject" className="form-label">
                      Subject *
                    </label>
                    <select
                      className="form-select"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select an enquiry</option>
                      <option value="Product Enquiry">Product Enquiry</option>
                      <option value="Bulk Order">Bulk Order</option>
                      <option value="Pricing">Pricing</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label htmlFor="message" className="form-label">
                      Your Message *
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn send-message-btn"
                      disabled={loading}
                      
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />

                          Sending...
                        </>
                      ) : (
                        <>
                          Submit Enquiry <span>&#10140;</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom Banner */}
      <section className="contact-bottom text-center py-5">
        <div className="container">
          <h2>Thank You For Choosing Jay Gruh Udhyog</h2>
          <p>
            Traditional taste, quality products and affordable prices.
          </p>
        </div>
      </section>

    </div>
  );
}

export default ContactUs;
