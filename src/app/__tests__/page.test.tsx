// src/app/__tests__/page.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../page'; // This imports your homepage component

describe('Homepage', () => {
  it('renders the main page content', () => {
    render(<Page />);

    // IMPORTANT: Change the text below to find some text
    // that is actually on your homepage (src/app/page.tsx).
    const headingElement = screen.getByText(/Deploy/i);

    expect(headingElement).toBeInTheDocument();
  });
});