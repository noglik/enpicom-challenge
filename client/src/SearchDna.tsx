import { useState, FormEvent, FC } from 'react';
import { DnaSequenceInput } from './components/DnaSequenceInput';
import './SearchDna.css';

export const NO_RECORDS_TEXT = 'No DNA sequnces found for this search criteria';

type DnaRecords = Array<{ id: number, sequence: string }>;

const DnaRecordTable: FC<{ records: DnaRecords}> = ({ records }) =>
  records.length > 0 ? 
    (<div className="table-container" role="table" aria-label="DNA records">
      <div className="row header" role="rowgroup">
        <div className="cell" role="columnheader">ID</div>
        <div className="cell long" role="columnheader">Sequence</div>
      </div>
      {records.map((rec) => (<div key={rec.id} className="row" role="rowgroup">
        <div className="cell" role="cell" title={`${rec.id}`}>{rec.id}</div>
        <div className="cell long" role="cell" title={rec.sequence}>{rec.sequence}</div>
      </div>))}
    </div>)
    : (<p>{NO_RECORDS_TEXT}</p>);

const SearchDna = () => {
  const [records, setRecords] = useState<DnaRecords | undefined>();
  const [error, setError] = useState<Error|undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);

    const formData = new FormData(e.currentTarget);
    const query = new URLSearchParams(Object.fromEntries(formData) as Record<string, string>);

    fetch(`/api/dna?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        const errorMessage = (data && data.message) || res.statusText;
        return Promise.reject(Error(errorMessage));
      }

      setRecords(data);
      setLoading(false);
      return Promise.resolve();
    })
    .catch((err: Error) => {
      setRecords(undefined);
      setLoading(false);
      setError(err)
    })
  } 

  return (
    <div id="save-dna">
      <h4>Search for DNA string</h4>
      <form onSubmit={handleSubmit}>
        <DnaSequenceInput isLoading={loading} />
        <input type="text" name="levenshtein" placeholder="Levenshtein distance" className="inp inp-right" disabled={loading} pattern="^\d+$" />
        <button type="submit" className="btn" disabled={loading}>Search</button>
      </form>
      { error ? <p className="err">{error.message}</p> : null }
      { records ? (<DnaRecordTable records={records} />) : null }
    </div>
  );
}

export default SearchDna;
