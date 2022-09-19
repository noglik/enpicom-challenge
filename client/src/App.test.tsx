import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('Add DNA string', async () => {
  render(<App />);

  // type failing sequence
  const dnaInput = screen.getByPlaceholderText(/dna string*/i);
  fireEvent.change(dnaInput, { target: { value: 'TACG' } });

  // add
  const saveButton = screen.getByText(/save/i);
  fireEvent.click(saveButton);

  // check button disabled
  await waitFor(() => {
    expect(saveButton).toBeDisabled();
  })
  expect(dnaInput).toBeDisabled();

  // check button enabled after fetch completed
  await waitFor(() => {
    expect(saveButton).not.toBeDisabled();
  });
  expect(dnaInput).not.toBeDisabled();

  // check error text present
  const errorText = screen.getByText(/Something went wrong/i);
  expect(errorText).toBeVisible();

  // type correct sequence
  fireEvent.change(dnaInput, { target: { value: 'TACG' } });

  // add
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(saveButton).toBeDisabled();
  })
  expect(dnaInput).toBeDisabled();
  // error text not visible
  expect(errorText).not.toBeVisible();

  await waitFor(() => {
    expect(saveButton).not.toBeDisabled();
  });
  expect(dnaInput).not.toBeDisabled();
});
