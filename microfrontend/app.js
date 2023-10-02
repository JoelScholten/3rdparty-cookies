const url = 'https://3rd-party-cookie-test-bff.onrender.com'

document.getElementById('login').onclick = function () {
    window.location = url + '/authorize';
};

document.getElementById('refresh').onclick = function () {
    fetch(url + '/refresh', {
        credentials: 'include',
    }).then(function (response) {
        console.log(response);
    }).catch(function (err) {
        console.log(err);
    });
};

document.getElementById('api').onclick = function () {
    fetch(url + '/', {
        credentials: 'include',
    }).then(function (response) {
        console.log(response);
    }).catch(function (err) {
        console.log(err);
    });
};