import { fetchGraphql } from './fetchService';

const login = (email, password) => {
  return fetchGraphql(`
    query {
      signin(email:"${email}", password:"${password}") {
        email
        name
      }
    }
  `)
};

const signup = (email, password, name) => {
  return fetchGraphql(`
      mutation {
          signup(email:"${email}", password:"${password}", name:"${name}") {
        email
        name
      }
    }
  `)
};

const signout = () => {
  return fetchGraphql(`
    query {
      signout
    }
    `);
};

const isLoggedIn = (user) => {
  return Object.keys(user).length > 0;
};

export { login, signup, signout, isLoggedIn };