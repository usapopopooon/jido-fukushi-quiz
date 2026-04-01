import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartScreen from '../StartScreen';

afterEach(cleanup);

vi.mock('../../hooks/usePWAInstall', () => ({
  usePWAInstall: () => ({ isInstallable: false, install: vi.fn() }),
}));

describe('StartScreen', () => {
  it('renders app title', () => {
    render(<StartScreen onStart={vi.fn()} />);
    expect(screen.getAllByText('児童福祉 制度クイズ').length).toBeGreaterThanOrEqual(1);
  });

  it('renders service filter buttons', () => {
    render(<StartScreen onStart={vi.fn()} />);
    expect(screen.getAllByText('児童発達支援').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('放課後等デイサービス').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('居宅訪問').length).toBeGreaterThanOrEqual(1);
  });

  it('renders difficulty filter buttons', () => {
    render(<StartScreen onStart={vi.fn()} />);
    expect(screen.getAllByText('初級').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('中級').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('上級').length).toBeGreaterThanOrEqual(1);
  });

  it('shows question count of 100 when all selected', () => {
    render(<StartScreen onStart={vi.fn()} />);
    expect(screen.getAllByText('100問').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onStart with services and difficulties when start button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<StartScreen onStart={onStart} />);
    const buttons = screen.getAllByText('クイズを始める');
    await user.click(buttons[0]);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalledWith(
      expect.arrayContaining(['児童発達支援', '放課後等デイサービス', '居宅訪問']),
      expect.arrayContaining(['初級', '中級', '上級']),
    );
  });

  it('updates question count when filtering by difficulty', async () => {
    const user = userEvent.setup();
    render(<StartScreen onStart={vi.fn()} />);

    // Deselect 中級 and 上級 to get only 初級
    const medButtons = screen.getAllByText('中級');
    await user.click(medButtons[0]);
    const advButtons = screen.getAllByText('上級');
    await user.click(advButtons[0]);

    const countElements = screen.getAllByText(/^\d+問$/);
    const count = parseInt(countElements[0].textContent!);
    expect(count).toBeLessThan(100);
    expect(count).toBeGreaterThan(0);
  });

  it('disables start button when no services selected', async () => {
    const user = userEvent.setup();
    render(<StartScreen onStart={vi.fn()} />);

    // Click first すべて (service toggle) to deselect all services
    const allButtons = screen.getAllByText('すべて');
    await user.click(allButtons[0]);
    const startButtons = screen.getAllByText('クイズを始める');
    expect(startButtons[0]).toBeDisabled();
  });

  it('disables start button when no difficulty selected', async () => {
    const user = userEvent.setup();
    render(<StartScreen onStart={vi.fn()} />);

    // Click second すべて (difficulty toggle) to deselect all difficulties
    const allButtons = screen.getAllByText('すべて');
    await user.click(allButtons[1]);
    const startButtons = screen.getAllByText('クイズを始める');
    expect(startButtons[0]).toBeDisabled();
  });
});
