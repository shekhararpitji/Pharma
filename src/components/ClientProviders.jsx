'use client';

import { authExists } from "@/redux/reducers/authReducer";
import { store } from "@/redux/store";
import axiosInstance from "@/utils/axiosInstance";
import { Suspense, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InitUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axiosInstance.get('/roles/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Response from /roles/me:", response.data.data);

                dispatch(authExists(response.data.data));
                console.log("User data:", response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [dispatch]);

    return null;
};

export default function ClientProviders({ children }) {
    return (
        <Provider store={store}>
            <InitUser />
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </Provider>
    );
}
