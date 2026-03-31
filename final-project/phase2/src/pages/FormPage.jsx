import { useState } from 'react';
import { z } from 'zod';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import FormResponse from '../components/FormResponse.jsx';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  bookingDate: z.string().min(1, 'Booking date is required'),
  guests: z.coerce.number().min(1, 'Guests must be at least 1').max(10, 'Guests cannot exceed 10'),
});

function FormPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bookingDate: '',
    guests: 1,
  });

  const [errors, setErrors] = useState({});
  const [responseData, setResponseData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? value : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
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
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      setSubmitError('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-root">
      <Header />

      <main className="form-page">
        <section className="form-hero">
          <div className="section-content">
            <p className="eyebrow">Routed Form Page</p>
            <h1>Booking Form</h1>
            <p className="form-intro">
              Fill in the form below and submit it to httpbin. The returned response
              will appear on this page.
            </p>
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
                  placeholder="Ahmed Bahgat"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ahmed@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                  required
                />
                {errors.bookingDate && <p className="error-text">{errors.bookingDate}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="guests">Number of guests</label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                />
                {errors.guests && <p className="error-text">{errors.guests}</p>}
              </div>

              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>

              {submitError && <p className="error-text submit-error">{submitError}</p>}
            </form>
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
