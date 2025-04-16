import { useCallback, useEffect, useState } from "react";
import { TextInput, PrimaryButton } from "../components/UIkit";
import { resetPassword, resetError } from "../redux/users/operations";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { Link, useNavigate } from "react-router-dom";

const Reset = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const [email, setEmail] = useState("");

  const onChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  const error = useSelector((state: RootState) => state.users.error);

  return (
    <div className="c-section-container">
      <h2 className="u-text__headline u-text__center">Password Reset</h2>
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
        />
        <p style={{ color: "red" }}>
          {error}
        </p>
        <div className="module-spacer--medium" />
        <div className="center">
          <PrimaryButton
            label={"Reset Password"}
            onClick={() => dispatch(resetPassword({ email, navigate }))}
          />
        </div>
        <div className="module-spacer--medium" />
        <div>
          <Link className="u-text__link-none u-text__link-black" to="/signin">
            サインインに戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reset;
