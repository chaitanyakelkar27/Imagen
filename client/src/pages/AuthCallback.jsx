import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setToken, setShowLogin } = useContext(AppContext);

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (token) {
            setToken(token);
            setShowLogin(false);
            toast.success('Login Successful!');
            navigate('/');
        } else if (error) {
            toast.error('Authentication failed');
            navigate('/');
        }
    }, [searchParams, setToken, setShowLogin, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Authenticating...</p>
            </div>
        </div>
    );
};

export default AuthCallback;