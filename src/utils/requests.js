import config from './config';

export default class ModelRequest {

    constructor(route){
        const url = config.BASE_URL + route;
        this.url = url;
        this.page = 1;
        this.nextUrl = url;
        this.previousUrl = url;
    }

    appendFilters = (filters, url=this.url) => {
        url = url.split('?')[0] + '?';
        for (const filter in filters) {
            if (filters.hasOwnProperty(filter)) {
                url += `${filter}=${filters[filter]}&`;
            }
        }
        return url.slice(0, -1);
    };

    validate = res => {
        if (res.ok){
            return res.json();
        }
        else if (res.status){
            switch (res.status) {
                case 401:
                    return res.json().then(body => {
                        if (body.message === 'Error decoding signature.') {
                            localStorage.removeItem('token');
                            window.redirectOnInvalidToken();
                        }
                        return Promise.reject(body);
                    });
                default:
                    return res.json().then(body => {
                        return Promise.reject(body);
                    });
            }
        }
    };

    put = data => {
        return fetch(this.url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(res => this.validate(res));
    };

    patch = (url, data)=> {
        return fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(res => this.validate(res));
    };

    post = (url, data='') => {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(res => this.validate(res));
    };

    get = (url=this.url) => {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access')
            }
        })
        .then(res => this.validate(res));
    };

    delete = id => {
        return fetch(`${this.url}${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access')
            }
        });
    };

    postWithoutAuth = data => {
        return fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data
            })
        })
        .then(res => this.validate(res));
    };

    getWithoutAuth = (url=this.url) => {
        return fetch(url, {
            method: 'GET',
        })
        .then(res => this.validate(res));
    };

    publicList = (filters=undefined) => {
        let url = this.appendFilters(filters);
        const response = this.getWithoutAuth(url);
        return response;
    };

    publicRetrieve = (id, filters=undefined) => {
        let url = this.url + id + '/';
        url = this.appendFilters(filters, url);
        const response = this.getWithoutAuth(url);
        return response;
    };

    getAll = (filters=undefined) => {
        let url = this.appendFilters(filters);
        const response = this.get(url);
        return response;
    };

    getOne = (id, filters=undefined) => {
        let url = this.url + id + '/';
        url = this.appendFilters(filters, url);
        const response = this.get(url);
        return response;
    };

    update = (id, data) => {
        const url = `${this.url}${id}/`;
        const response = this.patch(url, data);
        return response;
    };

    updateWithFile = (id, fileForm) => {
        let url = this.url + id + '/';
        return fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Disposition': 'attachment;',
                'Authorization': 'Bearer ' + localStorage.getItem('access')
            },
            body: fileForm
        })
        .then(res => this.validate(res));
    };

    create = data => {
        const url = this.url;
        const response = this.post(url, data);
        return response;
    };

    transition = (id, state) => {
        const url = `${this.url}${id}/${state}/`;
        const response = this.post(url);
        return response;
    };

    getCurrentPage = (filters=undefined) => {
        return this.getAll(filters).then(res => {
            if (!this.nextUrl) {
                this.page = 1;
            }
            this.nextUrl = res['next'];
            this.previousUrl = res['previous'];
            return res;
        });
    };

    getNextPage = () => {
        if (!this.nextUrl) {
            return Promise.reject();
        }
        this.url = this.nextUrl;
        return this.get().then(res => {
            this.page++;
            this.nextUrl = res['next'];
            this.previousUrl = res['previous'];
            return res;
        });
    };

    getPreviousPage = () => {
        if (!this.previousUrl) {
            return Promise.reject();
        }
        this.url = this.previousUrl;
        return this.get().then(res => {
            this.page--;
            this.nextUrl = res['next'];
            this.previousUrl = res['previous'];
            return res;
        });
    };

    getFile = (id=undefined) => {
        let url = this.url;
        if (id) {
            url = url + id + '/';
        }

        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access')
            }
        });
    }
}