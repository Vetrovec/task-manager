export default function FormattedDate({ date }: { date: Date }) {
  return <time dateTime={date.toISOString()}>{date.toLocaleString()}</time>;
}
