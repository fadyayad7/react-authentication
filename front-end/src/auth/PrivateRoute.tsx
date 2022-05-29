import { Route, Redirect} from 'react-router-dom'
import { useUser } from './AuthHooks';

const PrivateRoute = (props: any) => {
    const user = useUser();

    if(!user)
        return <Redirect to="/login" />
    return <Route {...props} />
}

export default PrivateRoute;