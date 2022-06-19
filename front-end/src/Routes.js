import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserInfoPage } from './pages/UserInfoPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './auth/PrivateRoute';
import {PleaseVerifyEmail, EmailVerification} from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import PasswordReset from './pages/PasswordReset';

export const Routes = () => {
    return (
        <Router>
            <Switch>
                <PrivateRoute path="/" exact>
                    <UserInfoPage />
                </PrivateRoute>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Signup />
                </Route>
                <Route path="/forgot-password">
                    <ForgotPassword />
                </Route>
                <Route path="/reset-password/:passwordResetCode">
                    <PasswordReset />
                </Route>
                <Route path="/please-verify-email">
                    <PleaseVerifyEmail />
                </Route>
                <Route path="/verify-email/:verificationString">
                    <EmailVerification />
                </Route>
            </Switch>
        </Router>
    );
}