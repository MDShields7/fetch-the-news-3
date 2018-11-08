const initialState = {
  id: null,             // given by server upon connection
  host: '',             // Host - only assigned from laptop view
  // room: '',             // Typed by host
  // roomList: [],         // Kept by server
  mobileDevice: 0,      // determined per user
  // rndLimit: 3,          // Round, set by host in lobby
  // rndCurrent: null,     // Round, set during game
  // user: '',             // User { id:#, avName:'', avPhoto:'url' }
  // userList: [],         // List of playing users 
  // userScoreList: [],    // Scores - only party mode
  newsAllList: [],      // Lists available to play
  newsMyList: [],      // Lists available to play
  newsMyListCreated: [],      // Lists available to play
  // newsPlayingList: [],  // List played in party mode
  // avatarList: [],       // Hard-coded items
  //    TRIVIA LIST?????
  }
  const UPDATE_ID = 'UPDATE_ID';
  const UPDATE_HOST = 'UPDATE_HOST';
  const UPDATE_ROOM = 'UPDATE_ROOM';
  const UPDATE_ROOM_LIST = 'UPDATE_ROOM_LIST';
  const UPDATE_MOBILE_DEVICE = 'UPDATE_MOBILE_DEVICE';
  const UPDATE_RND_LIMIT = 'UPDATE_RND_LIMIT';
  const UPDATE_RND_CURRENT = 'UPDATE_RND_CURRENT';
  const UPDATE_USER = 'UPDATE_USER';
  const UPDATE_USER_LIST = 'UPDATE_USER_LIST';
  const UPDATE_USER_SCORE_LIST = 'UPDATE_USER_SCORE_LIST';
  const UPDATE_NEWS_ALL_LIST = 'NEWS_ALL_LIST';
  const UPDATE_NEWS_MY_LIST = 'NEWS_MY_LIST';
  const UPDATE_NEWS_MY_LIST_CREATED = 'NEWS_MY_LIST_CREATED';
  const UPDATE_NEWS_PLAYING_LIST = 'NEWS_PLAYING_LIST';
  
  function reducer( state = initialState, action){
    switch(action.type){      
        case UPDATE_ID:
            return Object.assign({},state, {id: action.payload})
        case UPDATE_HOST:
            return Object.assign({},state, {host: action.payload})
        case UPDATE_ROOM:
            return Object.assign({},state, {room: action.payload})
        case UPDATE_ROOM_LIST:
            return Object.assign({},state, {roomList: action.payload})
        case UPDATE_MOBILE_DEVICE:
            return Object.assign({},state, {mobileDevice: action.payload})
        case UPDATE_RND_LIMIT:
            return Object.assign({},state, {rndLimit: action.payload}) 
        case UPDATE_RND_CURRENT:
            return Object.assign({},state, {rndCurrent: action.payload})
        case UPDATE_USER:
            return Object.assign({}, state, {user: action.payload})
        case UPDATE_USER_LIST:
            return Object.assign({}, state, {userList: action.payload}) 
        case UPDATE_USER_SCORE_LIST:
            return Object.assign({}, state, {userScoreList: action.payload}) 
        case UPDATE_NEWS_ALL_LIST:
            return Object.assign({}, state, {newsAllList: action.payload}) 
        case UPDATE_NEWS_MY_LIST:
            return Object.assign({}, state, {newsMyList: action.payload}) 
        case UPDATE_NEWS_MY_LIST_CREATED:
            return Object.assign({}, state, {newsMyListCreated: action.payload}) 
        case UPDATE_NEWS_PLAYING_LIST:
            return Object.assign({}, state, {newsPlayingList: action.payload}) 
        default: return state;
    } 
  }
  export function updateId ( id ){
    return {
        type: UPDATE_ID,
        payload: id
    }
  }
  export function updateHost ( host ){
    return {
        type: UPDATE_HOST,
        payload: host
    }
  }
  export function updateRoom ( room ){
    return {
        type: UPDATE_ROOM,
        payload: room
    }
  }
  export function updateRoomList ( roomList ){
    return {
        type: UPDATE_ROOM_LIST,
        payload: roomList
    }
  }
  export function updateMobileDevice ( mobileDevice ){
    return {
        type: UPDATE_MOBILE_DEVICE,
        payload: mobileDevice
    }
  }
  export function updateRndLimit ( rndLimit ){
    return {
        type: UPDATE_RND_LIMIT,
        payload: rndLimit
    }
  }
  export function updateLoanType ( rndCurrent ){
    return {
        type: UPDATE_RND_CURRENT,
        payload: rndCurrent
    }
  }
  export function updateUser ( user ){
    return {
        type: UPDATE_USER,
        payload: user
    }
  }
  export function updateUserList ( userList ){
    return {
        type: UPDATE_USER_LIST,
        payload: userList
    }
  }
  export function updateUserScoreList ( userScoreList ){
    return {
        type: UPDATE_USER_SCORE_LIST,
        payload: userScoreList
    }
  }
  export function updateNewsAllList ( newsAllList ){
    return {
        type: UPDATE_NEWS_ALL_LIST,
        payload: newsAllList
    }
  }
  export function updateNewsMyList ( newsMyList ){
    return {
        type: UPDATE_NEWS_MY_LIST,
        payload: newsMyList
    }
  }
  export function updateNewsMyListCreated ( newsMyListCreated ){
    return {
        type: UPDATE_NEWS_MY_LIST_CREATED,
        payload: newsMyListCreated
    }
  }
  export function updateNewsPlayingList ( newsPlayingList ){
    return {
        type: UPDATE_NEWS_PLAYING_LIST,
        payload: newsPlayingList
    }
  }
  
  export default reducer;