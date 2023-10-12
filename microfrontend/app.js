const url = 'https://api.scholten.dev';

document.getElementById('login').onclick = function () {
    window.location = url + '/authorize';
};

document.getElementById('refresh').onclick = function () {
    fetch(url + '/refresh', {
        credentials: 'include',
    }).then(async function (response) {
        const data = await response.text();
        document.getElementById('data').innerHTML = data;
    }).catch(function (err) {
        console.log(err);
    });
};

document.getElementById('api').onclick = function () {
    fetch(url + '/', {
        credentials: 'include',
        mode: 'cors',
    }).then(async function (response) {
        console.log(response);
        const data = await response.text();
        document.getElementById('data').innerHTML = data;
    }).catch(function (err) {
        console.log(err);
    });
};