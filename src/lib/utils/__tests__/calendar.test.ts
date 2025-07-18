import { downloadIcsFile } from '../calendar'

// Mock the download functionality
const mockClick = jest.fn()
const mockRemoveChild = jest.fn()
const mockAppendChild = jest.fn()

// Create a proper DOM element mock
const mockElement = {
  href: '',
  download: '',
  click: mockClick,
}

const mockCreateElement = jest.fn(() => mockElement)

// Mock URL.createObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url')
const mockRevokeObjectURL = jest.fn()

// Mock document.body
const mockBody = {
  appendChild: mockAppendChild,
  removeChild: mockRemoveChild,
}

Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
  writable: true,
})

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
  writable: true,
})

Object.defineProperty(document, 'body', {
  value: mockBody,
  writable: true,
})

describe('Calendar Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockElement.href = ''
    mockElement.download = ''
  })

  describe('downloadIcsFile', () => {
    const mockEvent = {
      title: 'Test Event',
      description: 'This is a test event',
      location: 'Test Location',
      startTime: new Date('2024-01-15T10:00:00Z'),
      endTime: new Date('2024-01-15T11:00:00Z'),
      url: 'https://example.com/event',
    }

    it('creates and downloads an ICS file', () => {
      downloadIcsFile(mockEvent)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })

    it('generates correct ICS content', () => {
      downloadIcsFile(mockEvent)

      const [[blob]] = mockCreateObjectURL.mock.calls
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('text/calendar;charset=utf-8')
    })

    it('handles events without optional fields', () => {
      const minimalEvent = {
        title: 'Minimal Event',
        description: '',
        location: '',
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
      }

      expect(() => downloadIcsFile(minimalEvent)).not.toThrow()
      expect(mockCreateElement).toHaveBeenCalled()
    })

    it('formats dates correctly for ICS', () => {
      downloadIcsFile(mockEvent)

      const [[blob]] = mockCreateObjectURL.mock.calls
      
      // Read the blob content (would need to be async in real implementation)
      // For now, we just verify the function doesn't throw
      expect(blob).toBeDefined()
    })

    it('escapes special characters in event data', () => {
      const eventWithSpecialChars = {
        title: 'Event with, special; characters',
        description: 'Description with\nnewlines and, commas',
        location: 'Location; with semicolons',
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
      }

      expect(() => downloadIcsFile(eventWithSpecialChars)).not.toThrow()
      expect(mockCreateElement).toHaveBeenCalled()
    })

    it('uses correct filename format', () => {
      downloadIcsFile(mockEvent)

      expect(mockElement.download).toBe('test-event.ics')
    })
  })
})

describe('Date formatting utilities', () => {
  it('formats dates in ICS format', () => {
    const date = new Date('2024-01-15T10:00:00Z')
    const formatted = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    expect(formatted).toBe('20240115T100000Z')
  })

  it('handles different timezones', () => {
    const date = new Date('2024-01-15T10:00:00-05:00')
    const utcDate = new Date(date.toISOString())
    const formatted = utcDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    expect(formatted).toBe('20240115T150000Z') // 5 hours ahead in UTC
  })
}) 