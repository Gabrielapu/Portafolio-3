export default function useThousandSeparator(date) {
  if (date === null || date === undefined) {
    return 'No date';
  }
  return date.charAt(0).toUpperCase() + date.slice(1)
}