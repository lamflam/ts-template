import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './app';

describe('index', () => {
    test('main', () => {
        render(<App />);
        screen.getByText('Template');
        screen.getByText('Template page');
        userEvent.hover(screen.getByText('Template'));
    });
});
