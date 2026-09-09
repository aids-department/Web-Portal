function Table({ className = "", children, ...rest }) {
  return (
    <table className={`w-full border-collapse ${className}`} {...rest}>
      {children}
    </table>
  );
}

function Head({ children, ...rest }) {
  return (
    <thead {...rest}>
      <tr className="border-b-2 border-navy">{children}</tr>
    </thead>
  );
}

function HeadCell({ className = "", children, ...rest }) {
  return (
    <th
      className={`text-left py-2.5 text-table-head tracking-label uppercase text-ds-ink-soft ${className}`}
      {...rest}
    >
      {children}
    </th>
  );
}

function Row({ className = "", children, ...rest }) {
  return (
    <tr className={`border-b border-ds-row ${className}`} {...rest}>
      {children}
    </tr>
  );
}

function Cell({ className = "", children, ...rest }) {
  return (
    <td className={`py-3 text-body text-ds-ink ${className}`} {...rest}>
      {children}
    </td>
  );
}

function RankChip({ rank, className = "" }) {
  const style =
    rank === 1
      ? "bg-ds-red text-white"
      : rank === 2
        ? "bg-ds-blue-tint text-ds-blue"
        : "text-ds-ink-soft";
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 text-label font-semibold ${style} ${className}`}
    >
      {rank}
    </span>
  );
}

function Figure({ className = "", children, ...rest }) {
  return (
    <td className={`py-3 text-right text-figure text-navy tabular-nums ${className}`} {...rest}>
      {children}
    </td>
  );
}

Table.Head = Head;
Table.HeadCell = HeadCell;
Table.Row = Row;
Table.Cell = Cell;
Table.RankChip = RankChip;
Table.Figure = Figure;

export default Table;
