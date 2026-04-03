import { useState } from "react";
import { z } from "zod";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FormResponse from "../components/FormResponse";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  bookingDate: z.string().min(1, "Booking date is required"),
  guests: z.coerce.number().min(1, "Guests must be at least 1").max(10, "Guests cannot exceed 10"),
});

function FormPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bookingDate: "",
    guests: 1,
  });

  const [errors, setErrors] = useState({});
  const [responseData, setResponseData] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage("");
    setResponseData(null);

    const parsed = formSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Saving failed");
      }

      setResponseData(data);
      setSubmitMessage("Booking saved successfully.");
    } catch (error) {
      setSubmitMessage(error.message || "Saving failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-root">
      <Header />

      <main className="form-page">
        <section className="hero-section">
          <div className="section-content">
            <h1>Booking Form</h1>
            <p>Submit the form and save the data into the database through the backend API.</p>
          </div>
        </section>

        <section className="section">
          <div className="form-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="bookingDate">Booking date</label>
                <input
                  id="bookingDate"
                  name="bookingDate"
                  type="date"
                  value={formData.bookingDate}
                  onChange={handleChange}
                />
                {errors.bookingDate && <p className="error-text">{errors.bookingDate}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="guests">Guests</label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={handleChange}
                />
                {errors.guests && <p className="error-text">{errors.guests}</p>}
              </div>

              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Booking"}
              </button>
            </form>

            {submitMessage && <p className="status-text">{submitMessage}</p>}
          </div>
        </section>

        <section className="section">
          <FormResponse response={responseData} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default FormPage;
