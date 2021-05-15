module.exports = {
    fetchGraphql: (queryBody, signal) => {
        return fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryBody }),
            credentials: "include",
            signal: signal
        })
        .then((res) => res.json());
    },
    fetchRest: (method, url, data, signal) => {
        return fetch(url, {
            method: method,
            body: JSON.stringify(data),
            credentials: "include",
            signal: signal
        })
        .then((res) => res.json());
    },
    uploadFile: (url, data) => {
        return new Promise((resolve, reject) => {
            let formdata = new FormData();
            Object.keys(data).forEach(function(key){
                let value = data[key];
                formdata.append(key, value);
            });
            let xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.status !== 200) reject("[" + xhr.status + "]" + xhr.responseText);
                else resolve(JSON.parse(xhr.responseText));
            };
            xhr.open("POST", url, true);
            xhr.send(formdata);                
        });
    }
}