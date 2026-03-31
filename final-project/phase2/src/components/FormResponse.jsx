function FormResponse({ response }) {
  if (!response) return null;

  return (
    <section className="response-card">
      <h2>Server Response</h2>
      <p>The form was submitted successfully and httpbin returned this response.</p>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </section>
  );
}

export default FormResponse;
