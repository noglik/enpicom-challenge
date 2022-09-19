import React, { FormEvent, useState } from 'react';
import './App.css';

const App = () => {
  const [error, setError] = useState<Error|undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    const formData = new FormData(e.currentTarget);

    fetch(`/api/dna`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        const errorMessage = (data && data.message) || res.statusText;
        return Promise.reject(Error(errorMessage));
      }

      setLoading(false);
      return Promise.resolve();
    })
    .catch((err: Error) => {
      setLoading(false);
      setError(err)
    })
  } 

  return (
    <div className="App">
      <div id="save-dna">
        <h4>Add DNA string</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" name="sequence" placeholder="DNA string*(ACTG)" required className="inp" disabled={loading} pattern="^[ACTG]{1,255}$" />
          <button type="submit" className="btn" disabled={loading}>Save</button>
        </form>
        {error ? <p className="err">{error.message}</p> : null}
      </div>
    </div>
  );
}

export default App;
