/**
 * Generates an .ics file content for calendar events
 */
export function generateIcsFile(event: {
  title: string;
  description: string;
  location: string;
  startTime: number;
  endTime: number;
  url?: string;
}): string {
  // Format dates according to iCalendar spec (UTC format)
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  };

  const start = formatDate(event.startTime);
  const end = formatDate(event.endTime);
  
  // Escape special characters in text fields
  const escapeText = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  // Generate a unique ID for the event
  const uid = `${Date.now()}-${Math.floor(Math.random() * 1000000)}@yposfgold.com`;
  
  // Build the .ics content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YPO SF Gold//Events Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDate(Date.now())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    ...(event.url ? [`URL:${event.url}`] : []),
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return icsContent;
}

/**
 * Triggers a download of an .ics file
 */
export function downloadIcsFile(event: {
  title: string;
  description: string;
  location: string;
  startTime: number;
  endTime: number;
  url?: string;
}): void {
  const icsContent = generateIcsFile(event);
  
  // Create a blob with the .ics content
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  // Create a download link and trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 