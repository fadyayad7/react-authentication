import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Api } from "../util/Api";


const PasswordReset = () => {
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isFailure, setIsFailure] = useState<boolean>(false);

    // @ts-ignore
    const {passwordResetCode} = useParams();

    const history = useHistory();

    const onPasswordReset = () => {
        Api.resetPassword(passwordResetCode, {password})
            .then(r => setIsSuccess(true))
            .catch(err => setIsFailure(true));
    }

    if (isSuccess) return <div className="content-container">
        <h1>your password has been reset ✅</h1>
        <button onClick={() => history.push('/login')}>go to login</button>
    </div>
    
    return <div className="content-container">
        <h1>Reset password</h1>
        {isFailure && <div className="fail">not possibile to reset your password</div>}
        <input value={password} onChange={e => setPassword(e.target.value)}  placeholder="password" type="password" />
        <input value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}  placeholder="confirm password" type="password" />
        <button onClick={onPasswordReset} disabled={!password || (passwordConfirm !== password)}>Reset Password</button>
    </div>
}

export default PasswordReset;