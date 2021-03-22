// https://www.digitalocean.com/community/tutorials/react-manage-user-login-react-context

import React from 'react';

const UserContext = React.createContext({
    user: {}
});

export const UserProvider = UserContext.Provider
export const UserConsumer = UserContext.Consumer

export default UserContext;