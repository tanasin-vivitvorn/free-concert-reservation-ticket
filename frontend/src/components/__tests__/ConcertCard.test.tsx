import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ConcertCard } from '../ConcertCard'

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiUser: () => <span data-testid="user-icon">👤</span>,
}))

describe('ConcertCard Component', () => {
  const defaultProps = {
    name: 'Test Concert',
    description: 'A test concert description',
    seat: 100,
    date: '2024-12-31T18:00:00Z',
  }

  it('renders concert information correctly', () => {
    render(<ConcertCard {...defaultProps} />)
    
    expect(screen.getByText('Test Concert')).toBeInTheDocument()
    expect(screen.getByText('A test concert description')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('displays seat count with proper formatting', () => {
    render(<ConcertCard {...defaultProps} seat={1000} />)
    expect(screen.getByText('1,000')).toBeInTheDocument()
  })

  it('shows reserve button when onReserve is provided', () => {
    const onReserve = jest.fn()
    render(<ConcertCard {...defaultProps} onReserve={onReserve} />)
    
    const reserveButton = screen.getByRole('button', { name: /reserve/i })
    expect(reserveButton).toBeInTheDocument()
    
    fireEvent.click(reserveButton)
    expect(onReserve).toHaveBeenCalledTimes(1)
  })

  it('shows cancel button when onDelete is provided', () => {
    const onDelete = jest.fn()
    render(<ConcertCard {...defaultProps} onDelete={onDelete} />)
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    expect(cancelButton).toBeInTheDocument()
    
    fireEvent.click(cancelButton)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('prioritizes onDelete over onReserve when both are provided', () => {
    const onDelete = jest.fn()
    const onReserve = jest.fn()
    render(<ConcertCard {...defaultProps} onDelete={onDelete} onReserve={onReserve} />)
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reserve/i })).not.toBeInTheDocument()
  })

  it('renders user icon', () => {
    render(<ConcertCard {...defaultProps} />)
    expect(screen.getByTestId('user-icon')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<ConcertCard {...defaultProps} />)
    const card = screen.getByText('Test Concert').closest('div')?.parentElement
    expect(card).toHaveClass('bg-white', 'border', 'border-[#ededed]', 'rounded-sm', 'shadow')
  })

  it('disables reserve button for past events', () => {
    const onReserve = jest.fn()
    const pastDate = '2020-01-01T18:00:00Z' // Past date
    render(<ConcertCard {...defaultProps} date={pastDate} onReserve={onReserve} />)
    
    const reserveButton = screen.getByRole('button', { name: /หมดเวลาแล้ว/i })
    expect(reserveButton).toBeDisabled()
  })

  it('shows "หมดเวลาแล้ว" text for past events', () => {
    const onReserve = jest.fn()
    const pastDate = '2020-01-01T18:00:00Z' // Past date
    render(<ConcertCard {...defaultProps} date={pastDate} onReserve={onReserve} />)
    
    expect(screen.getByText('หมดเวลาแล้ว')).toBeInTheDocument()
  })
}) 