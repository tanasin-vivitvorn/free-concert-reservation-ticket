import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '../Button'

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('applies default button styles', () => {
    render(<Button>Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-sm')
  })

  it('can be disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border', 'border-indigo-600', 'text-indigo-600')
    
    rerender(<Button variant="danger">Danger</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-100', 'text-red-600')
  })
}) 