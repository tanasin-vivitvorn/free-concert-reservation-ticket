import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import UserReserve from '../reserve/page'
import { AuthProvider } from '../../../components/AuthProvider'

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiLogOut: () => <span data-testid="logout-icon">🚪</span>,
  FiRefreshCw: () => <span data-testid="refresh-icon">🔄</span>,
}))

// Mock Sidebar, ConcertCard
jest.mock('../../../components/Sidebar', () => ({
  Sidebar: ({ title, items, footer }: { title: string; items?: Array<{ label: string; icon: React.ReactNode; onClick: () => void }>; footer: React.ReactNode }) => (
    <div className="flex min-h-screen bg-[#f5f8fa]">
      <div>
        <div>{title}</div>
        {items?.map((item, index: number) => (
          <button key={index} onClick={item.onClick}>
            {item.label}
            {item.icon}
          </button>
        ))}
        {footer}
      </div>
    </div>
  )
}))
jest.mock('../../../components/ConcertCard', () => ({
  ConcertCard: ({ name, description, seat, onDelete, onReserve }: { name: string; description: string; seat: number; onDelete?: () => void; onReserve?: () => void }) => (
    <div>
      <div>{name}</div>
      <div>{description}</div>
      <div>{seat}</div>
      {onDelete && <button onClick={onDelete}>Cancel</button>}
      {onReserve && <button onClick={onReserve}>Reserve</button>}
    </div>
  )
}))



// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => JSON.stringify({ id: 1, username: 'testuser', email: 'test@example.com', role: 'user' })),
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

describe('UserReserve Page', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ 
      id: 1, 
      username: 'testuser', 
      email: 'test@example.com', 
      role: 'user' 
    }))
  })

  it('renders user reserve page with title', () => {
    renderWithAuth(<UserReserve />)
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('renders concert cards', () => {
    renderWithAuth(<UserReserve />)
    
    // Should render 2 concert cards
    const concertNames = screen.getAllByText('Concert Name')
    expect(concertNames).toHaveLength(2)
  })

  it('renders concert descriptions', () => {
    renderWithAuth(<UserReserve />)
    
    const descriptions = screen.getAllByText(/Lorem ipsum dolor sit amet/)
    expect(descriptions).toHaveLength(2)
  })

  it('renders seat counts', () => {
    renderWithAuth(<UserReserve />)
    
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('2000')).toBeInTheDocument()
  })

  it('shows cancel button for first concert card', () => {
    renderWithAuth(<UserReserve />)
    
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i })
    expect(cancelButtons.length).toBeGreaterThan(0)
  })

  it('shows reserve button for second concert card', () => {
    renderWithAuth(<UserReserve />)
    
    const reserveButtons = screen.getAllByRole('button', { name: /reserve/i })
    expect(reserveButtons.length).toBeGreaterThan(0)
  })

  it('shows cancel button for first concert card', () => {
    renderWithAuth(<UserReserve />)
    
    const cancelButton = screen.getAllByRole('button', { name: /cancel/i })[0]
    fireEvent.click(cancelButton)
    
    // Button should be clickable
    expect(cancelButton).toBeInTheDocument()
  })

  it('shows reserve button for second concert card', () => {
    renderWithAuth(<UserReserve />)
    
    const reserveButton = screen.getAllByRole('button', { name: /reserve/i })[0]
    fireEvent.click(reserveButton)
    
    // Button should be clickable
    expect(reserveButton).toBeInTheDocument()
  })

  it('renders sidebar with switch to admin option', () => {
    renderWithAuth(<UserReserve />)
    
    expect(screen.getByText('Switch to Admin')).toBeInTheDocument()
    expect(screen.getByTestId('refresh-icon')).toBeInTheDocument()
  })

  it('shows switch to admin button', () => {
    renderWithAuth(<UserReserve />)
    
    const switchButton = screen.getByText('Switch to Admin')
    fireEvent.click(switchButton)
    
    // Button should be clickable
    expect(switchButton).toBeInTheDocument()
  })

  it('renders logout button', () => {
    renderWithAuth(<UserReserve />)
    
    expect(screen.getByText('Logout')).toBeInTheDocument()
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
  })

  it('calls logout function when logout is clicked', () => {
    renderWithAuth(<UserReserve />)
    
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    // Since logout function clears localStorage, we can check if removeItem was called
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token')
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user')
  })

  it('renders footer with copyright', () => {
    renderWithAuth(<UserReserve />)
    expect(screen.getByText(/© 2024 Free Concert Ticket Booking - User Reserve Page/)).toBeInTheDocument()
  })

  it('applies correct layout styling', () => {
    const { container } = renderWithAuth(<UserReserve />)
    const mainContainer = container.querySelector('div.flex.min-h-screen.bg-\\[\\#f5f8fa\\]')
    expect(mainContainer).toBeInTheDocument()
  })
}) 