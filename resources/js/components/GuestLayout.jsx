import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function GuestLayout() {
  const {token} = useStateContext();
  const navigate = useNavigate();

  if(token) {
    return navigate('/');
  }

  return (
    <div className="login-signup-form">
      <div className="form">
        <Outlet />
      </div>
    </div>
  );
}
