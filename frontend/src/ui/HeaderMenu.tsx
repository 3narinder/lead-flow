import { HiOutlineUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import ButtonIcon from "./ButtonIcon";
import Logout from "./Logout";

const HeaderMenu = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-1" aria-label="Account navigation">
      <ButtonIcon
        aria-label="Account"
        title="Account"
        onClick={() => navigate("/account")}
      >
        <HiOutlineUser />
      </ButtonIcon>

      <Logout />
    </nav>
  );
};

export default HeaderMenu;
