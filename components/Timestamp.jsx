import { DateTime } from "luxon";

export default function Timestamp({timestamp}) {
  return (
    <h3>{DateTime.fromSeconds(timestamp).toRelative()}</h3>
  )
}
