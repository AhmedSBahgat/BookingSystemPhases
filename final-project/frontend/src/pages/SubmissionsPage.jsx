import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function SubmissionsPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("Loading saved bookings...");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();
        setBookings(data);
        setMessage("");
      } catch (error) {
        setMessage("Failed to load saved bookings.");
      }
    }

    fetchBookings();
  }, []);

  return (
    <div className="app-root">
      <Header />

      <main>
        <section className="hero-section">
          <div className="section-content">
            <h1>Saved Bookings</h1>
            <p>This page reads booking data from the database through the backend API.</p>
          </div>
        </section>

        <section className="section">
          <div className="content-card">
            {message && <p>{message}</p>}

            {!message && bookings.length === 0 && <p>No bookings found.</p>}

            {bookings.length > 0 && (
              <div className="bookings-grid">
                {bookings.map((booking) => (
                  <article className="booking-card" key={booking.id}>
                    <h2>{booking.full_name}</h2>
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Date:</strong> {booking.booking_date}</p>
                    <p><strong>Guests:</strong> {booking.guests}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default SubmissionsPage;
