const Card = ({ className = "", children }) => (
  <div className={`glass-panel rounded-[28px] ${className}`}>{children}</div>
);

export default Card;

