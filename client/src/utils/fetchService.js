module.exports = {
    fetchGraphql: (queryBody, signal) => {
        return fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryBody }),
            credentials: "include",
            signal: signal
        });
    }
}