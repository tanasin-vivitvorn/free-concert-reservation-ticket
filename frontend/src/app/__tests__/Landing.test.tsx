import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Landing from '../landing/page'
import { AuthProvider } from '../../components/AuthProvider'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => null),
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

describe('Landing Page', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockLocalStorage.getItem.mockReturnValue(null) // Not authenticated by default
  })

  it('renders landing page with correct title', () => {
    renderWithAuth(<Landing />)
    expect(screen.getByText('Free Concert Ticket Booking')).toBeInTheDocument()
  })

  it('renders description text', () => {
    renderWithAuth(<Landing />)
    expect(screen.getByText(/ระบบจองบัตรคอนเสิร์ตฟรีสำหรับทุกคน/)).toBeInTheDocument()
  })

  it('renders login button when not authenticated', () => {
    renderWithAuth(<Landing />)
    expect(screen.getByRole('button', { name: /เข้าสู่ระบบ/i })).toBeInTheDocument()
  })

  it('renders register button when not authenticated', () => {
    renderWithAuth(<Landing />)
    expect(screen.getByRole('button', { name: /สมัครสมาชิก/i })).toBeInTheDocument()
  })

  it('renders user page button', () => {
    renderWithAuth(<Landing />)
    expect(screen.getByRole('button', { name: /เข้าสู่หน้า User/i })).toBeInTheDocument()
  })

  it('renders admin page button', () => {
    renderWithAuth(<Landing />)
    expect(screen.getByRole('button', { name: /เข้าสู่หน้า Admin/i })).toBeInTheDocument()
  })

  it('navigates to login when user button is clicked and not authenticated', () => {
    renderWithAuth(<Landing />)
    
    fireEvent.click(screen.getByRole('button', { name: /เข้าสู่หน้า User/i }))
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('navigates to login when admin button is clicked and not authenticated', () => {
    renderWithAuth(<Landing />)
    
    fireEvent.click(screen.getByRole('button', { name: /เข้าสู่หน้า Admin/i }))
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('shows authenticated user interface when logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ 
      id: 1, 
      username: 'testuser', 
      email: 'test@example.com', 
      role: 'user' 
    }))
    
    renderWithAuth(<Landing />)
    expect(screen.getByText('ยินดีต้อนรับ, testuser!')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /เข้าสู่หน้า User/i })).toHaveLength(2)
    expect(screen.getByRole('button', { name: /ออกจากระบบ/i })).toBeInTheDocument()
  })

  it('shows admin interface when user is admin', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ 
      id: 1, 
      username: 'admin', 
      email: 'admin@example.com', 
      role: 'admin' 
    }))
    
    renderWithAuth(<Landing />)
    expect(screen.getByText('ยินดีต้อนรับ, admin!')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /เข้าสู่หน้า Admin/i })).toHaveLength(2)
  })

  it('renders footer with copyright', () => {
    renderWithAuth(<Landing />)
    expect(screen.getByText('© 2024 Free Concert Ticket Booking')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    renderWithAuth(<Landing />)
    const mainContainer = screen.getByText('Free Concert Ticket Booking').closest('div')
    expect(mainContainer?.parentElement).toHaveClass('min-h-screen', 'flex', 'flex-col')
  })
}) 