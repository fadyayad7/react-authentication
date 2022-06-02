import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useToken } from "../auth/AuthHooks";
import { Api } from "../util/Api";


const Signup = () => {
    const [token, setToken] = useToken();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirmed, setPasswordConfirmed] = useState<string>("");
    const [error, setError] = useState<string>("");
  
  const history = useHistory();

  const onSignupClicked = async () => {
    Api.signup({email, password})
        .then(response => {
            (setToken as (token: string) => void)(response.data.token);
            history.push('/please-verify-email');
        })
        .catch(console.error);
  }

  return (
    <div className="content-container">
        {error && <div className="fail">{error}</div>}
      <h1>Signup</h1>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="someone@gmail.com" type="text" />
      <input value={password} onChange={e => setPassword(e.target.value)}  placeholder="password" type="password" />
      <input value={passwordConfirmed} onChange={e => setPasswordConfirmed(e.target.value)}  placeholder="confirm password" type="password" />
      <button onClick={onSignupClicked} disabled={!email || !password || (passwordConfirmed !== password)}>Signup</button>
      <button onClick={() => history.push('/login')}>Already have an account ? Login</button>
    </div>
  );
}

export default Signup;