import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import UserHistory from '../history/page'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock services
const mockGetUserReservations = jest.fn()
const mockGetConcertById = jest.fn()

jest.mock('../../../../services/reservationService', () => ({
  reservationService: {
    getUserReservations: mockGetUserReservations,
  },
}))

jest.mock('../../../../services/concertService', () => ({
  concertService: {
    getConcertById: mockGetConcertById,
  },
}))

// Mock components
jest.mock('../../../../components/Sidebar', () => {
  return function MockSidebar({ children }: { children: React.ReactNode }) {
    return <div data-testid="sidebar">{children}</div>
  }
})

jest.mock('../../../../components/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="protected-route">{children}</div>
  }
})

jest.mock('../../../../components/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser', role: 'user' },
    logout: jest.fn(),
  }),
}))

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiLogOut: () => <span data-testid="logout-icon">🚪</span>,
  FiRefreshCw: () => <span data-testid="refresh-icon">🔄</span>,
  FiClock: () => <span data-testid="clock-icon">⏰</span>,
  FiCalendar: () => <span data-testid="calendar-icon">📅</span>,
}))

const renderWithAuth = (component: React.ReactElement) => {
  return render(component)
}

describe('UserHistory Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders user history page with title', () => {
    renderWithAuth(<UserHistory />)
    expect(screen.getByText('ประวัติการจอง')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    renderWithAuth(<UserHistory />)
    expect(screen.getByText('กำลังโหลดประวัติการจอง...')).toBeInTheDocument()
  })

  it('shows empty state when no reservations', async () => {
    mockGetUserReservations.mockResolvedValue([])

    renderWithAuth(<UserHistory />)

    await waitFor(() => {
      expect(screen.getByText('ยังไม่มีประวัติการจอง')).toBeInTheDocument()
    })
  })

  it('shows reservations when data is loaded', async () => {
    const mockReservations = [
      {
        id: 1,
        userId: 1,
        concertId: 1,
        canceled: false,
      },
    ]

    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      description: 'Test Description',
      seat: 100,
      date: '2024-12-31T18:00:00Z',
    }

    mockGetUserReservations.mockResolvedValue(mockReservations)
    mockGetConcertById.mockResolvedValue(mockConcert)

    renderWithAuth(<UserHistory />)

    await waitFor(() => {
      expect(screen.getByText('Test Concert')).toBeInTheDocument()
    })
  })

  it('shows correct status for canceled reservations', async () => {
    const mockReservations = [
      {
        id: 1,
        userId: 1,
        concertId: 1,
        canceled: true,
      },
    ]

    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      description: 'Test Description',
      seat: 100,
      date: '2024-12-31T18:00:00Z',
    }

    mockGetUserReservations.mockResolvedValue(mockReservations)
    mockGetConcertById.mockResolvedValue(mockConcert)

    renderWithAuth(<UserHistory />)

    await waitFor(() => {
      expect(screen.getByText('ยกเลิกแล้ว')).toBeInTheDocument()
    })
  })

  it('shows correct status for past events', async () => {
    const mockReservations = [
      {
        id: 1,
        userId: 1,
        concertId: 1,
        canceled: false,
      },
    ]

    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      description: 'Test Description',
      seat: 100,
      date: '2020-01-01T18:00:00Z', // Past date
    }

    mockGetUserReservations.mockResolvedValue(mockReservations)
    mockGetConcertById.mockResolvedValue(mockConcert)

    renderWithAuth(<UserHistory />)

    await waitFor(() => {
      expect(screen.getByText('จบแล้ว')).toBeInTheDocument()
    })
  })

  it('shows correct status for upcoming events', async () => {
    const mockReservations = [
      {
        id: 1,
        userId: 1,
        concertId: 1,
        canceled: false,
      },
    ]

    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      description: 'Test Description',
      seat: 100,
      date: '2025-12-31T18:00:00Z', // Future date
    }

    mockGetUserReservations.mockResolvedValue(mockReservations)
    mockGetConcertById.mockResolvedValue(mockConcert)

    renderWithAuth(<UserHistory />)

    await waitFor(() => {
      expect(screen.getByText('กำลังจะมาถึง')).toBeInTheDocument()
    })
  })

  it('shows error message when API fails', async () => {
    mockGetUserReservations.mockRejectedValue(new Error('API Error'))

    renderWithAuth(<UserHistory />)

    await waitFor(() => {
      expect(screen.getByText('ไม่สามารถโหลดข้อมูลได้')).toBeInTheDocument()
    })
  })

  it('renders footer text', () => {
    renderWithAuth(<UserHistory />)
    expect(screen.getByText(/© 2024 Free Concert Ticket Booking - User History Page/)).toBeInTheDocument()
  })
}) 