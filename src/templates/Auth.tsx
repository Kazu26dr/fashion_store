import { useSelector, useDispatch } from "react-redux";
import { getIsSignedIn } from "../redux/users/selectors";
import { RootState } from "../redux/users/types";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { listenAuthState } from "../redux/users/operations";
import { AppDispatch } from "../redux/store/store";

const Auth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isSignedIn = useSelector((state: RootState) => getIsSignedIn(state));
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSignedIn) {   
      dispatch(listenAuthState(navigate));
    }       
  }, [isSignedIn, dispatch, navigate]);

  if (!isSignedIn) {   
   return <></>;
  } else {
    return <Outlet />;
  }
};

export default Auth;
