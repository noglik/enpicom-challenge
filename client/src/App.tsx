import React, { FormEvent, useState } from 'react';
import './App.css';

const App = () => {
  const [error, setError] = useState<Error|undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const target = e.target as typeof e.target & {
      sequence: {value: string};
    };
    const sequence = target.sequence.value;

    fetch(`/api/dna`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sequence,
      })
    })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        const errorMessage = (data && data.message) || res.statusText;
        return Promise.reject(Error(errorMessage));
      }

      setError(undefined);
      return Promise.resolve();
    })
    .catch((err: Error) => {
      setError(err)
    })
    setLoading(false);
  } 

  return (
    <div className="App">
      <div id="save-dna">
        <h4>Add DNA string</h4>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type="text" name="sequence" placeholder="DNA string*" className="inp" />
          <button type="submit" className="btn" disabled={loading}>Save</button>
        </form>
        {error ? <p className="err">{error.message}</p> : null}
      </div>
    </div>
  );
}

export default App;
