import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Api } from "../util/Api";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const history = useHistory();

    const onSubmitClicked = async () => {
        Api.forgotPassword(email)
            .then(response => setSuccess(true))
            .then(r => setTimeout(() => {
                history.push('/login')
            }, 300))
            .catch(e => setError(e.message));
    }
    return success ? <div className="content-container">
        <h1>Success</h1>
        <p>check your email for a reset link</p>
    </div> : <div className="content-container">
        <h1>Forgot password</h1>
        <p>Enter your email and we will send to you a reset link</p>
        {error && <div className="fail">{error}</div>}
        <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="someone@gmail.com"/>
        <button onClick={onSubmitClicked} disabled={!email}>Send Reset Link</button>
    </div>
}

export default ForgotPassword;