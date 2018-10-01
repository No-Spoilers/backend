const endpoints: {[key: string]: string} = {
    GET_ROOT: '/',
    GET_ITEM_LIST: '/items',
    GET_ITEM_BY_SLUG: '/item/:slug',
    POST_ITEM: '/item',
    PUT_ITEM: '/item/:slug',
    POST_CONTENT: '/item/:slug',

    GET_USER_LIST: '/users',
    GET_USER_BY_ID: '/user/:userId',
    POST_USER: '/user'
}

export default endpoints
