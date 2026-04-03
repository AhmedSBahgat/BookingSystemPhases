function FormResponse({ response }) {
  if (!response) return null;

  return (
    <section className="response-card">
      <h2>Save Result</h2>
      <p>Your form data was saved through the backend API into the database.</p>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </section>
  );
}

export default FormResponse;
