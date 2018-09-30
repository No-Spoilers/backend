const endpoints: {[key: string]: string} = {
    GET_ROOT: '/',
    GET_ITEM_LIST: '/items',
    GET_ITEM: '/item/:slug',
    POST_ITEM: '/item',
    PUT_ITEM: '/item/:slug',
    POST_CONTENT: '/item/:slug',
    POST_ADD_CHILD: '/item/add_child_to/:slug'
}

export default endpoints
