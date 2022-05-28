import { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  const history = useHistory();

  const onLoginClicked = () => {
      alert('not implemented yet')
  }

  return (
    <div className="content-container">
        {error && <div className="fail">{error}</div>}
      <h1>Login</h1>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="someone@gmail.com" type="text" />
      <input value={password} onChange={e => setPassword(e.target.value)}  placeholder="password" type="password" />
      <button onClick={onLoginClicked} disabled={!email || !password }>Login</button>
      <button onClick={() => history.push('/forgot-password')}>Forgot your password ?</button>
      <button onClick={() => history.push('/signup')}>Don't have an account ? Sign up</button>
    </div>
  );
};

export default Login;
