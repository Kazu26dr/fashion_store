import { useCallback, useState, useEffect } from "react";
import { TextInput, PrimaryButton } from "../components/UIkit";
import { signUp, resetError } from "../redux/users/operations";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [setName]
  );

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

  const onChangeConfirmPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    },
    [setConfirmPassword]
  );

  const error = useSelector((state: RootState) => state.users.error);

  return (
    <div className="c-section-signin-container">
      <h2 className="u-text__headline u-text__center">Sign Up</h2>
      <div className="c-container">
        <TextInput
          fullWidth={true}
          label={"ユーザー名"}
          multiline={false}
          required={true}
          rows={1}
          value={name}
          type={"text"}
          onChange={onChangeName}
          autoComplete="username"
        />
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
        <TextInput
          fullWidth={true}
          label={"パスワード(確認用)"}
          multiline={false}
          required={true}
          rows={1}
          value={confirmPassword}
          type={"password"}
          onChange={onChangeConfirmPassword}
        />
        <p style={{ color: "red" }}>
          {error}
        </p>
        <div className="module-spacer--medium" />
        <div className="center">
          <PrimaryButton
            label={"アカウント登録"}
            onClick={() =>
              dispatch(
                signUp({
                  username: name,
                  email: email,
                  password: password,
                  confirmPassword: confirmPassword,
                  navigate: navigate,
                })
              )
            }
          />
        </div>
        <div className="module-spacer--medium" />
        <div className="center">
          <Link
            className="u-text__link-none center u-text__link-black"
            to="/signin"
          >
            すでにアカウントをお持ちの方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
