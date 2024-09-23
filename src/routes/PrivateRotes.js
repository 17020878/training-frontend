import {Navigate,} from 'react-router-dom';
import {useSelector} from "react-redux";

const PrivateRoutes = ({role, redirectPath = '/login', children}) => {
    const currentUser = useSelector(state => state.currentUser)
    if (role) {
        if (currentUser.roles.includes(role) ===false) {
            return <Navigate to='/errors/forbidden' replace/>
        }
    }
    return children
}

export default PrivateRoutes