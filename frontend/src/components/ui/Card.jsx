function Card({ className = "", children, ...rest }) {
  return (
    <div className={`bg-white border border-ds-edge ${className}`} {...rest}>
      {children}
    </div>
  );
}

function Media({ className = "", children, label = "Photograph", ...rest }) {
  return (
    <div
      className={`bg-ds-ink flex items-center justify-center text-on-navy-muted text-label tracking-label uppercase grayscale ${className}`}
      {...rest}
    >
      {children || label}
    </div>
  );
}

function Kicker({ className = "", children, ...rest }) {
  return (
    <p
      className={`text-kicker tracking-kicker uppercase text-ds-red ${className}`}
      {...rest}
    >
      {children}
    </p>
  );
}

function Title({ className = "", children, ...rest }) {
  return (
    <h3 className={`text-card-title text-navy ${className}`} {...rest}>
      {children}
    </h3>
  );
}

function Body({ className = "", children, ...rest }) {
  return (
    <p className={`text-body text-ds-ink-soft ${className}`} {...rest}>
      {children}
    </p>
  );
}

function Meta({ className = "", children, ...rest }) {
  return (
    <div
      className={`flex items-center justify-between border-t border-ds-row pt-3 text-label ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

Card.Media = Media;
Card.Kicker = Kicker;
Card.Title = Title;
Card.Body = Body;
Card.Meta = Meta;

export default Card;
