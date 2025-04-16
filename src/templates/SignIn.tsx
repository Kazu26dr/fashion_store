import { useCallback, useState, useEffect } from "react";
import { TextInput, PrimaryButton } from "../components/UIkit";
import { signIn, resetError } from "../redux/users/operations";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [setPassword]
  );
  
  const error = useSelector((state: RootState) => state.users.error);


  return (
    <div className="c-section-signin-container">
      <h2 className="u-text__headline u-text__center">Sign In</h2>
      <div className="c-container">
        <TextInput
          fullWidth={true}
          label={"メールアドレス"}
          multiline={false}
          required={true}
          rows={1}
          value={email}
          type={"email"}
          onChange={onChangeEmail}
          autoComplete="email"
        />
        <TextInput
          fullWidth={true}
          label={"パスワード"}
          multiline={false}
          required={true}
          rows={1}
          value={password}
          type={"password"}
          onChange={onChangePassword}
        />
        <p style={{ color: "red" }}>
          {error}
        </p>
        <div className="module-spacer--extra-small" />
        <div className="center">
          <PrimaryButton
            label={"Sign in"}
            onClick={() => dispatch(signIn({ email, password, navigate }))}
          />
        </div>
        <br />
        <div className="center">
          <p>
            <Link className="u-text__link-none u-text__link-black" to="/signup">
              新規登録はこちら
            </Link>
          </p>
          <p>
          <Link
            className="u-text__link-none u-text__link-black"
            to="/signin/reset"
          >
            パスワードを忘れた方はこちら
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
