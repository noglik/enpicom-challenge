import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import SearchDna, { NO_RECORDS_TEXT } from './SearchDna';
import { waitForFetch, disabilityExpectation } from './utils/test';
import { records } from './mocks/handlers';

// Basically several tests are written in one, to imitate users behavior
test('SearchDna', async () => {
  render(<SearchDna />);
  const dnaInput = screen.getByPlaceholderText(/dna string*/i);
  const levenshteinInput = screen.getByPlaceholderText(/levenshtein/i);
  const searchButton = screen.getByRole('button', { name: "Search" });

  // error response
  fireEvent.change(dnaInput, { target: { value: 'TACGG' } });

  fireEvent.click(searchButton);

  await waitForFetch([dnaInput, levenshteinInput, searchButton]);

  const errorMessage = screen.getByText(/not valid!/i);
  expect(errorMessage).toBeVisible();

  // no records response
  fireEvent.change(dnaInput, { target: { value: 'TACG' } });

  fireEvent.click(searchButton);

  await waitFor(() => disabilityExpectation([dnaInput, levenshteinInput, searchButton], true));

  expect(errorMessage).not.toBeVisible();

  await waitFor(() => disabilityExpectation([dnaInput, levenshteinInput, searchButton], false));

  const emptyMessage = screen.getByText(NO_RECORDS_TEXT);
  expect(emptyMessage).toBeVisible();

  // success sequence
  fireEvent.change(dnaInput, { target: { value: 'ACTG' } });

  fireEvent.click(searchButton);

  await waitForFetch([dnaInput, levenshteinInput, searchButton]);

  expect(emptyMessage).not.toBeVisible();
  const table = screen.getByRole('table');
  records.forEach((rec) => {
    expect(within(table).getByText(rec.id)).toBeVisible();
    expect(within(table).getByText(rec.sequence)).toBeVisible();
  });

  // using levenshtein
  fireEvent.change(dnaInput, { target: { value: 'ACTG' } });
  fireEvent.change(levenshteinInput, { target: { value: 2 } });

  fireEvent.click(searchButton);

  await waitForFetch([dnaInput, levenshteinInput, searchButton]);

  expect(within(table).getByText(records[0].id)).toBeVisible();
  expect(within(table).getByText(records[0].sequence)).toBeVisible();
});
