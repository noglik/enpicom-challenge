import { render, screen, fireEvent } from '@testing-library/react';
import { DnaSequenceInput } from './DnaSequenceInput';

test('DnaSequenceInput validation', async () => {
  render(<DnaSequenceInput isLoading={false} />);
  const dnaInput = screen.getByPlaceholderText(/dna string*/i);

  // empty input
  expect(dnaInput).toBeInvalid();

  // invalid sequence
  fireEvent.change(dnaInput, { target: { value: 'not_valid_dna_sequence' } });

  expect(dnaInput).toBeInvalid();

  // valid sequence
  fireEvent.change(dnaInput, { target: { value: 'ACTG' } });

  expect(dnaInput).toBeValid();
});
