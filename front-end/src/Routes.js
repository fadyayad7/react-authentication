import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserInfoPage } from './pages/UserInfoPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

export const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <UserInfoPage />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Signup />
                </Route>
            </Switch>
        </Router>
    );
}