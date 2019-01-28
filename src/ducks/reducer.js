const initialState = {
  trivSwitch: null,
  id: 1, // given by server upon connection
  host: null, // Host - only assigned from laptop view
  // room: '',             // Typed by host
  // roomList: [],         // Kept by server
  mobileDevice: 0, // determined per user
  rndLimit: null, // Round, set by host in lobby
  rndCurrent: null, // Round, set during game
  login: { loginUser: '', loginPassword: '' },
  reg: { regUser: '', regEmail: '', regPassword: '' },
  user: { userId: 2, userName: "" }, // User { id:#, avName:'', avPhoto:'url' }
  userList: [],
  newsAllList: [], // Lists available to play
  newsMyList: [], // Lists available to play
  newsMyListCreated: [], // Lists available to play
  newsPlayingList: {}, // List played in party mode
  newsPlayedList: "", // List played in party mode
  qaPlayingList: [],
  qaPlayingCurrent: { list: { ansRandom: [], ansKeyRandom: [] } },
  gameStart: false,
  gameEnd: false,
  gamePhase: 0,
  gameTimer: null,
  gameTimerStart: null
};
const UPDATE_TRIV_SWITCH = "TRIV_SWITCH";
const UPDATE_ID = "UPDATE_ID";
const UPDATE_HOST = "UPDATE_HOST";
const UPDATE_ROOM = "UPDATE_ROOM";
const UPDATE_ROOM_LIST = "UPDATE_ROOM_LIST";
const UPDATE_MOBILE_DEVICE = "UPDATE_MOBILE_DEVICE";
const UPDATE_RND_LIMIT = "UPDATE_RND_LIMIT";
const UPDATE_RND_CURRENT = "UPDATE_RND_CURRENT";
const UPDATE_LOGIN = "UPDATE_LOGIN";
const UPDATE_REG = "UPDATE_REG";
const UPDATE_USER = "UPDATE_USER";
const UPDATE_USER_LIST = "UPDATE_USER_LIST";
const UPDATE_USER_SCORE_LIST = "UPDATE_USER_SCORE_LIST";
const UPDATE_NEWS_ALL_LIST = "UPDATE_NEWS_ALL_LIST";
const UPDATE_NEWS_MY_LIST = "UPDATE_NEWS_MY_LIST";
const UPDATE_NEWS_MY_LIST_CREATED = "UPDATE_NEWS_MY_LIST_CREATED";
const UPDATE_NEWS_PLAYING_LIST = "UPDATE_NEWS_PLAYING_LIST";
const UPDATE_NEWS_PLAYED_LIST = "UPDATE_NEWS_PLAYED_LIST";
const UPDATE_QA_PLAYING_LIST = "UPDATE_QA_PLAYING_LIST";
const UPDATE_QA_PLAYING_CURRENT = "UPDATE_QA_PLAYING_CURRENT";
const UPDATE_GAME_START = "UPDATE_GAME_START";
const UPDATE_GAME_END = "UPDATE_GAME_END";
const UPDATE_GAME_PHASE = "UPDATE_GAME_PHASE";
const UPDATE_GAME_TIMER = "UPDATE_GAME_TIMER";
const UPDATE_GAME_TIMER_START = "UPDATE_GAME_TIMER_START";
// const UPDATE_ANSWER_LIST = 'UPDATE_ANSWER_LIST';

function reducer(state = initialState, action) {
  console.log("reducer", action.type, action.payload);
  switch (action.type) {
    case UPDATE_TRIV_SWITCH:
      return Object.assign({}, state, { trivSwitch: action.payload });
    case UPDATE_ID:
      return Object.assign({}, state, { id: action.payload });
    case UPDATE_HOST:
      return Object.assign({}, state, { host: action.payload });
    case UPDATE_ROOM:
      return Object.assign({}, state, { room: action.payload });
    case UPDATE_ROOM_LIST:
      return Object.assign({}, state, { roomList: action.payload });
    case UPDATE_MOBILE_DEVICE:
      return Object.assign({}, state, { mobileDevice: action.payload });
    case UPDATE_RND_LIMIT:
      return Object.assign({}, state, { rndLimit: action.payload });
    case UPDATE_RND_CURRENT:
      return Object.assign({}, state, { rndCurrent: action.payload });
    case UPDATE_LOGIN:
      return Object.assign({}, state, { login: action.payload });
    case UPDATE_REG:
      return Object.assign({}, state, { reg: action.payload });
    case UPDATE_USER:
      return Object.assign({}, state, { user: action.payload });
    case UPDATE_USER_LIST:
      return Object.assign({}, state, { userList: action.payload });
    case UPDATE_USER_SCORE_LIST:
      return Object.assign({}, state, { userScoreList: action.payload });
    case UPDATE_NEWS_ALL_LIST:
      return Object.assign({}, state, { newsAllList: action.payload });
    case UPDATE_NEWS_MY_LIST:
      return Object.assign({}, state, { newsMyList: action.payload });
    case UPDATE_NEWS_MY_LIST_CREATED:
      return Object.assign({}, state, { newsMyListCreated: action.payload });
    case UPDATE_NEWS_PLAYING_LIST:
      return Object.assign({}, state, { newsPlayingList: action.payload });
    case UPDATE_NEWS_PLAYED_LIST:
      return Object.assign({}, state, { newsPlayedList: action.payload });
    case UPDATE_QA_PLAYING_LIST:
      return Object.assign({}, state, { qaPlayingList: action.payload });
    case UPDATE_QA_PLAYING_CURRENT:
      return Object.assign({}, state, { qaPlayingCurrent: action.payload });
    case UPDATE_GAME_START:
      return Object.assign({}, state, { gameStart: action.payload });
    case UPDATE_GAME_END:
      return Object.assign({}, state, { gameEnd: action.payload });
    case UPDATE_GAME_PHASE:
      return Object.assign({}, state, { gamePhase: action.payload });
    case UPDATE_GAME_TIMER:
      return Object.assign({}, state, { gameTimer: action.payload });
    case UPDATE_GAME_TIMER_START:
      return Object.assign({}, state, { gameTimerStart: action.payload });
    // case UPDATE_ANSWER_LIST:
    //     return Object.assign({}, state, {answerList: action.payload})
    default:
      return state;
  }
}
export function updateTrivSwitch(trivSwitch) {
  return {
    type: UPDATE_TRIV_SWITCH,
    payload: trivSwitch
  };
}
export function updateId(id) {
  return {
    type: UPDATE_ID,
    payload: id
  };
}
export function updateHost(host) {
  return {
    type: UPDATE_HOST,
    payload: host
  };
}
export function updateRoom(room) {
  return {
    type: UPDATE_ROOM,
    payload: room
  };
}
export function updateRoomList(roomList) {
  return {
    type: UPDATE_ROOM_LIST,
    payload: roomList
  };
}
export function updateMobileDevice(mobileDevice) {
  return {
    type: UPDATE_MOBILE_DEVICE,
    payload: mobileDevice
  };
}
export function updateRndLimit(rndLimit) {
  return {
    type: UPDATE_RND_LIMIT,
    payload: rndLimit
  };
}
export function updateRndCurrent(rndCurrent) {
  return {
    type: UPDATE_RND_CURRENT,
    payload: rndCurrent
  };
}
export function updateLogin(login) {
  return {
    type: UPDATE_LOGIN,
    payload: login
  };
}
export function updateReg(reg) {
  return {
    type: UPDATE_REG,
    payload: reg
  };
}
export function updateLoanType(rndCurrent) {
  return {
    type: UPDATE_RND_CURRENT,
    payload: rndCurrent
  };
}
export function updateUser(user) {
  return {
    type: UPDATE_USER,
    payload: user
  };
}
export function updateUserList(userList) {
  return {
    type: UPDATE_USER_LIST,
    payload: userList
  };
}
export function updateUserScoreList(userScoreList) {
  return {
    type: UPDATE_USER_SCORE_LIST,
    payload: userScoreList
  };
}
export function updateNewsAllList(newsAllList) {
  return {
    type: UPDATE_NEWS_ALL_LIST,
    payload: newsAllList
  };
}
export function updateNewsMyList(newsMyList) {
  return {
    type: UPDATE_NEWS_MY_LIST,
    payload: newsMyList
  };
}
export function updateNewsMyListCreated(newsMyListCreated) {
  return {
    type: UPDATE_NEWS_MY_LIST_CREATED,
    payload: newsMyListCreated
  };
}
export function updateNewsPlayingList(newsPlayingList) {
  return {
    type: UPDATE_NEWS_PLAYING_LIST,
    payload: newsPlayingList
  };
}
export function updateNewsPlayedList(newsPlayedList) {
  return {
    type: UPDATE_NEWS_PLAYED_LIST,
    payload: newsPlayedList
  };
}
export function updateQAPlayingList(qaPlayingList) {
  return {
    type: UPDATE_QA_PLAYING_LIST,
    payload: qaPlayingList
  };
}
export function updateQAPlayingCurrent(qaPlayingCurrent) {
  return {
    type: UPDATE_QA_PLAYING_CURRENT,
    payload: qaPlayingCurrent
  };
}
export function updateGameStart(gameStart) {
  return {
    type: UPDATE_GAME_START,
    payload: gameStart
  };
}
export function updateGameEnd(gameEnd) {
  return {
    type: UPDATE_GAME_END,
    payload: gameEnd
  };
}
export function updateGamePhase(gamePhase) {
  return {
    type: UPDATE_GAME_PHASE,
    payload: gamePhase
  };
}
export function updateGameTimer(gameTimer) {
  return {
    type: UPDATE_GAME_TIMER,
    payload: gameTimer
  };
}
export function updateGameTimerStart(gameTimerStart) {
  return {
    type: UPDATE_GAME_TIMER_START,
    payload: gameTimerStart
  };
}

export default reducer;
