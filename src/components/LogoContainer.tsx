import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to="/">
      <img
        src="/assets/svg/logo.svg"
        alt="wwe"
        className="h-10 w-10 object-contain"
      />
    </Link>
  );
};
