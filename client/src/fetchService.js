module.exports = {
    fetchGraphql: (queryBody) => {
        return fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryBody }),
            credentials: "include"
        });
    }
}