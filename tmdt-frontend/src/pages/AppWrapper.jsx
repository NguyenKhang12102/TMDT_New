import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isTokenValid } from '../utils/jwt-helper';
import { loadUserInfo } from '../store/features/user';
import { fetchUserDetails } from '../api/UserInfo';

const AppInitializer = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const init = async () => {
            if (isTokenValid()) {
                try {
                    const user = await fetchUserDetails();
                    dispatch(loadUserInfo(user));
                } catch (err) {
                    console.error('Không thể tải lại thông tin người dùng:', err);
                }
            }
        };

        init();
    }, [dispatch]);

    return <>{children}</>;
};

export default AppInitializer;
