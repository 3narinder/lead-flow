import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";

const Logout = () => {
  const handleLogout = () => {
    // Add logout logic here
  };

  return (
    <ButtonIcon aria-label="Logout" title="Logout" onClick={handleLogout}>
      <HiArrowRightOnRectangle />
    </ButtonIcon>
  );
};

export default Logout;
