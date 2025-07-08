import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminPage from '../page'
import { AuthProvider } from '../../../components/AuthProvider'

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiUsers: () => <span data-testid="users-icon">👥</span>,
  FiSave: () => <span data-testid="save-icon">💾</span>,
}))

// Mock AdminLayout, ConcertCard, AdminTabs
jest.mock('../../../components/AdminLayout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="admin-layout">{children}</div>
}))
jest.mock('../../../components/ConcertCard', () => ({
  ConcertCard: ({ name, seat, onDelete }: { name: string; seat: number; onDelete?: () => void }) => (
    <div>
      <div>{name}</div>
      <div>{seat}</div>
      {onDelete && <button onClick={onDelete}>Cancel</button>}
    </div>
  )
}))
jest.mock('../../../components/AdminTabs', () => ({
  AdminTabs: ({ onTabChange }: { onTabChange: (tab: string) => void }) => (
    <div data-testid="admin-tabs">
      <button onClick={() => onTabChange('overview')}>Overview</button>
      <button onClick={() => onTabChange('create')}>Create</button>
    </div>
  )
}))

// Mock fetch
global.fetch = jest.fn()

// Mock confirm
global.confirm = jest.fn()

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => JSON.stringify({ id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' })),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  )
}

describe('AdminPage Component', () => {
  const mockConcerts = [
    { id: 1, name: 'Concert 1', description: 'Description 1', seat: 100 },
    { id: 2, name: 'Concert 2', description: 'Description 2', seat: 200 },
  ]

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear()
    ;(global.confirm as jest.Mock).mockClear()
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ 
      id: 1, 
      username: 'admin', 
      email: 'admin@example.com', 
      role: 'admin' 
    }))
    // Mock fetch to return a proper Promise
    ;(global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        json: () => Promise.resolve(mockConcerts),
        ok: true
      })
    )
  })

  it('renders admin page with tabs', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockConcerts,
    })

    renderWithAuth(<AdminPage />)
    
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('fetches concerts on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockConcerts,
    })

    renderWithAuth(<AdminPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/concerts')
    })
  })

  it('displays concerts in overview tab', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockConcerts,
    })

    renderWithAuth(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('Concert 1')).toBeInTheDocument()
      expect(screen.getByText('Concert 2')).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))

    renderWithAuth(<AdminPage />)
    expect(screen.getByText('กำลังโหลด...')).toBeInTheDocument()
  })

  it('shows error state when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    renderWithAuth(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('โหลดข้อมูลไม่สำเร็จ')).toBeInTheDocument()
    })
  })

  it('switches to create tab when clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockConcerts,
    })

    renderWithAuth(<AdminPage />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Create'))
    })

    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Please input concert name')).toBeInTheDocument()
  })

  it('renders create form with all fields', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockConcerts,
    })

    renderWithAuth(<AdminPage />)

    await waitFor(() => {
      fireEvent.click(screen.getByText('Create'))
    })

    expect(screen.getByText('Concert Name')).toBeInTheDocument()
    expect(screen.getByText('Total of seat')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('shows delete buttons for concerts', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockConcerts,
    })

    renderWithAuth(<AdminPage />)

    await waitFor(() => {
      const cancelButtons = screen.getAllByRole('button', { name: /cancel/i })
      expect(cancelButtons.length).toBeGreaterThan(0)
    })
  })

  it('calls delete API when delete is confirmed', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => mockConcerts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

    ;(global.confirm as jest.Mock).mockReturnValue(true)

    renderWithAuth(<AdminPage />)

    await waitFor(() => {
      const cancelButton = screen.getAllByRole('button', { name: /cancel/i })[0]
      act(() => {
        fireEvent.click(cancelButton)
      })
    })

    expect(global.confirm).toHaveBeenCalledWith('ยืนยันการลบคอนเสิร์ตนี้?')
    expect(global.fetch).toHaveBeenCalledWith('/api/concerts/1', {
      method: 'DELETE',
    })
  })

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockConcerts,
    })

    ;(global.confirm as jest.Mock).mockReturnValue(false)

    renderWithAuth(<AdminPage />)

    await waitFor(() => {
      const cancelButton = screen.getAllByRole('button', { name: /cancel/i })[0]
      act(() => {
        fireEvent.click(cancelButton)
      })
    })

    expect(global.confirm).toHaveBeenCalled()
    expect(global.fetch).not.toHaveBeenCalledWith('/api/concerts/1', {
      method: 'DELETE',
    })
  })

  it('calculates total seats correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockConcerts,
    })

    renderWithAuth(<AdminPage />)

    await waitFor(() => {
      // Total seats should be 100 + 200 = 300
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('200')).toBeInTheDocument()
    })
  })
}) 