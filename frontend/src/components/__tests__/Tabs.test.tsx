import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Tabs } from '../Tabs'

describe('Tabs Component', () => {
  const mockTabs = [
    { label: 'Tab 1', value: 'tab1' },
    { label: 'Tab 2', value: 'tab2' },
    { label: 'Tab 3', value: 'tab3' },
  ]

  const mockOnTabChange = jest.fn()

  beforeEach(() => {
    mockOnTabChange.mockClear()
  })

  it('renders all tabs', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" onTabChange={mockOnTabChange} />)
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('highlights active tab', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab2" onTabChange={mockOnTabChange} />)
    
    const activeTab = screen.getByText('Tab 2')
    expect(activeTab).toHaveClass('border-b-4', 'border-[#1ca4ef]', 'text-[#1ca4ef]', 'font-bold')
  })

  it('calls onTabChange when tab is clicked', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" onTabChange={mockOnTabChange} />)
    
    fireEvent.click(screen.getByText('Tab 2'))
    expect(mockOnTabChange).toHaveBeenCalledWith('tab2')
  })

  it('applies correct styling to inactive tabs', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" onTabChange={mockOnTabChange} />)
    
    const inactiveTab = screen.getByText('Tab 2')
    expect(inactiveTab).toHaveClass('text-gray-500')
  })

  it('renders with empty tabs array', () => {
    render(<Tabs tabs={[]} activeTab="" onTabChange={mockOnTabChange} />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(nav.children).toHaveLength(0)
  })

  it('handles single tab', () => {
    const singleTab = [{ label: 'Single Tab', value: 'single' }]
    render(<Tabs tabs={singleTab} activeTab="single" onTabChange={mockOnTabChange} />)
    
    expect(screen.getByText('Single Tab')).toBeInTheDocument()
    expect(screen.getByText('Single Tab')).toHaveClass('border-b-4', 'border-[#1ca4ef]')
  })
}) 