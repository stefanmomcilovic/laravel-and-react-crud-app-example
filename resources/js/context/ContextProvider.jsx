import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: null,
    token: null,
    notification: null,
    setToken: () => {},
    setUser: () => {},
    setNotification: () => {}
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [notification, _setNotification] = useState({
        class: 'empty-notification',
        type: '',
        message: ''
    });
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setNotification = (notification) => {
        _setNotification(notification);
        setTimeout(() => {
            _setNotification({
                class: 'empty-notification',
                type: '',
                message: ''
            });
        }, 5000);
    };

    const setToken = (token) => {
        _setToken(token);
        if(token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        }else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    return (
        <StateContext.Provider value={{
            user: user,
            setUser: setUser,
            token: token,
            setToken: setToken,
            notification: notification,
            setNotification: setNotification
        }}>
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);