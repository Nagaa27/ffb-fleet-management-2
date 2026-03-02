// src/molecules/__tests__/FormField.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormField } from '../FormField';

describe('FormField', () => {
  it('renders label text', () => {
    render(
      <FormField label="Name" htmlFor="name">
        <input id="name" />
      </FormField>,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(
      <FormField label="Email" required>
        <input />
      </FormField>,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator by default', () => {
    render(
      <FormField label="Optional">
        <input />
      </FormField>,
    );
    expect(screen.queryByText('*')).toBeNull();
  });

  it('renders children', () => {
    render(
      <FormField label="Field">
        <span data-testid="child">Child content</span>
      </FormField>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
