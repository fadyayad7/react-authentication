import { Route, Redirect} from 'react-router-dom'

const PrivateRoute = (props: any) => {
    const user = null;

    if(!user)
        return <Redirect to="/login" />
    return <Route {...props} />
}

export default PrivateRoute;