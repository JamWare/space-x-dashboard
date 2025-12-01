import { format, formatDistance, formatRelative } from 'date-fns';

/**
 * Format a date string in a human-readable format
 * @param dateString - ISO date string
 * @param formatStr - Optional format string (default: 'PPP')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatStr: string = 'PPP'): string {
  try {
    const date = new Date(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date string with time
 * @param dateString - ISO date string
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, 'PPP p');
}

/**
 * Format a date string relative to now (e.g., "2 hours ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date string relative to now with more context
 * @param dateString - ISO date string
 * @returns Relative date string (e.g., "last Friday at 10:00 AM")
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatRelative(date, new Date());
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
}

/**
 * Check if a date is in the future
 * @param dateString - ISO date string
 * @returns True if date is in the future
 */
export function isFuture(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return date > new Date();
  } catch (error) {
    return false;
  }
}

/**
 * Check if a date is in the past
 * @param dateString - ISO date string
 * @returns True if date is in the past
 */
export function isPast(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return date < new Date();
  } catch (error) {
    return false;
  }
}
