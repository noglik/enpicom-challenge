import { waitFor } from '@testing-library/react';

export const disabilityExpectation = (elements: Array<HTMLElement>, disabled: boolean) => elements.forEach((el) => {
  if (disabled) {
    expect(el).toBeDisabled();
  } else {
    expect(el).not.toBeDisabled();
  }
})

export const waitForFetch = async (elements: Array<HTMLElement>) => {
  await waitFor(() => disabilityExpectation(elements, true));

  await waitFor(() => disabilityExpectation(elements, false));
}

