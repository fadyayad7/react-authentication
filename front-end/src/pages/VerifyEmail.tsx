import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToken } from "../auth/AuthHooks";
import { Api } from "../util/Api";

export const PleaseVerifyEmail = () => {
    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            history.push('/')
        }, 5000);
    }, [history]);

    return <div className="content-container">
        <h1>Thanks for signing up</h1>
        <p>
            A verification email has been sent to the email address you provided,
            Please verify your email to unlock full site features.
        </p>
    </div>
}

const EmailVerificationStatus = (props: {success: boolean}) => {
    const history = useHistory();
    const {success} = props;
    const title = success ? 'Success!' : 'Uh .. oh....';
    const paragraph = success ? "Thanks for verifying your email, now you can use all the app's features." : "Something went wrong while verifying your email.";
    const buttonMessage = success ? 'Go To Home Page' : 'Back to signup';
    const page = success ? '/' : '/signup';

    return <div className="content-container">
        <h1>{title}</h1>
        <p>{paragraph}</p>
        <button onClick={() => history.push(page)}>{buttonMessage}</button>
    </div>
}

export const EmailVerification = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const { verificationString } =  (useParams() as any);
    const [, setToken] = useToken();

    useEffect(() => {
        Api.verifyEmail({verificationString})
            .then(res => {
                (setToken as (token: string) => void)(res?.data?.token);
                setIsSuccess(true);
            })
            .catch((err) => setIsSuccess(false))
            .finally(() => setIsLoading(false));
    }, [setToken, verificationString]);

    if (isLoading) return <p>Loading ..... </p>

    return <EmailVerificationStatus success={isSuccess} />
}