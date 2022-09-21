import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddDna from './AddDna';
import { disabilityExpectation, waitForFetch } from './utils/test';

// Basically several tests are written in one, to imitate users behavior
test('Add DNA string', async () => {
  render(<AddDna />);
  const dnaInput = screen.getByPlaceholderText(/dna string*/i);
  const saveButton = screen.getByText(/save/i);

  // type request failing sequence
  fireEvent.change(dnaInput, { target: { value: 'TACG' } });

  // add
  fireEvent.click(saveButton);

  // checks disabled/enabled
  await waitForFetch([dnaInput, saveButton]);

  // check error text present
  const errorText = screen.getByText(/Something went wrong/i);
  expect(errorText).toBeVisible();

  // type correct sequence
  fireEvent.change(dnaInput, { target: { value: 'TACG' } });

  // add
  fireEvent.click(saveButton);

  await waitFor(() => disabilityExpectation([dnaInput, saveButton], true));

  // remove error text during fetch execution
  expect(errorText).not.toBeVisible();

  await waitFor(() => disabilityExpectation([dnaInput, saveButton], false));
});
