import { error } from '@pnotify/core';

export default class NewApiService {
    constructor() {
        this.searchQuery = '',
            this.page = 1
    }
    fetchImages() {
        // console.log(this);
          const API_KEY = '23952211-93282d818c12dbc54947c6758'
        const BASE_URL = 'https://pixabay.com/api/'
        const searchParam = new URLSearchParams({
            image_type: 'photo',
            orientation: 'horizontal',
            q: this.searchQuery,
            page: this.page,
            per_page: 12,
            key: API_KEY

            
        })
        // console.log(searchParam.toString());
        
        const url = `${BASE_URL}?${searchParam}`

        // const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`
        
        return fetch(url).then(this.fetchStatus).then(({ hits }) => {
            this.incrementPage()
            if (hits.length === 0) {
                error({
                    title: 'Error!',
                })
                return []
            }
         return hits
     })
    }

    fetchStatus(r) {
        // console.log(r);
        if (r.status !== 200) {
            console.log('error');
        }
        return Promise.resolve(r.json())
    }

    incrementPage() {
        this.page +=1
    }

    resetPage() {
        this.page = 1
    }

    get query() {
        return this.searchQuery
    }

    set query(newQuery) {
        this.searchQuery = newQuery
        }
}