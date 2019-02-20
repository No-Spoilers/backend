const endpoints: {[key: string]: string} = {
    GET_ROOT: '/',

    POST_LOGIN: '/login',
    POST_SIGNUP: '/signup',
    
    GET_ITEM_LIST: '/items',
    GET_ITEM_BY_SLUG: '/item/:slug',
    POST_ITEM: '/item',
    PUT_ITEM: '/item/:slug',
    POST_CONTENT: '/item/:slug',
    GET_ITEMS_LATEST: '/items/latest',

    GET_USER_LIST: '/users',
    GET_USER_BY_ID: '/user/:userId',
    POST_USER: '/user'
}

export default endpoints
