import { all, fork, put, call, takeEvery, delay, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS,
    LOG_IN_FAILURE,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,
    LOG_OUT_REQUEST,
    LOG_OUT_SUCCESS,
    LOG_OUT_FAILURE,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAILURE,
    FOLLOW_USER_REQUEST,
    FOLLOW_USER_SUCCESS,
    FOLLOW_USER_FAILURE,
    UNFOLLOW_USER_REQUEST,
    UNFOLLOW_USER_SUCCESS,
    UNFOLLOW_USER_FAILURE,
    LOAD_FOLLOWERS_REQUEST,
    LOAD_FOLLOWERS_SUCCESS,
    LOAD_FOLLOWERS_FAILURE,
    LOAD_FOLLOWINGS_REQUEST,
    LOAD_FOLLOWINGS_SUCCESS,
    LOAD_FOLLOWINGS_FAILURE,
    REMOVE_FOLLOWER_REQUEST,
    REMOVE_FOLLOWER_SUCCESS,
    REMOVE_FOLLOWER_FAILURE,
    EDIT_NICKNAME_REQUEST,
    EDIT_NICKNAME_SUCCESS,
    EDIT_NICKNAME_FAILURE,
} from '../reducers/user';

function loginAPI(loginData) {
    return axios.post('/user/login', loginData, {
        withCredentials: true,
    });
}
function* login(action) {
    try {
        const result = yield call(loginAPI, action.data);
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: LOG_IN_FAILURE,
            error: error.response.data,
        });
    }
}
function* watchLogin() {
    yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpdata) {
    return axios.post('/user', signUpdata);
}
function* signUp(action) {
    try {
        yield call(signUpAPI, action.data);
        // throw new Error('Error!');
        yield put({
            type: SIGN_UP_SUCCESS,
        });
    } catch (error) {
        yield put({
            type: SIGN_UP_FAILURE,
            error: error,
        });
    }
}
function* watchSignUp() {
    yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function logoutAPI() {
    return axios.post(
        '/user/logout',
        {},
        {
            withCredentials: true,
        },
    );
}
function* logout() {
    try {
        yield call(logoutAPI);
        yield put({
            type: LOG_OUT_SUCCESS,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: LOG_OUT_FAILURE,
            error: error,
        });
    }
}
function* watchLogout() {
    yield takeEvery(LOG_OUT_REQUEST, logout);
}

function loadUserAPI(userId) {
    return axios.get(userId ? `/user/${userId}` : `/user/`, {
        withCredentials: true,
    });
}
function* loadUser(action) {
    try {
        const result = yield call(loadUserAPI, action.data);
        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
            me: !action.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: LOAD_USER_FAILURE,
            error: error,
        });
    }
}
function* watchLoadUser() {
    yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

function followUserAPI(userId) {
    return axios.post(
        `/user/${userId}/follow`,
        {},
        {
            withCredentials: true,
        },
    );
}
function* followUser(action) {
    try {
        const result = yield call(followUserAPI, action.data);
        yield put({
            type: FOLLOW_USER_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: FOLLOW_USER_FAILURE,
            error: error,
        });
    }
}
function* watchFollowUser() {
    yield takeEvery(FOLLOW_USER_REQUEST, followUser);
}

function unFollowUserAPI(userId) {
    return axios.delete(`/user/${userId}/follow`, {
        withCredentials: true,
    });
}
function* unFollowUser(action) {
    try {
        const result = yield call(unFollowUserAPI, action.data);
        yield put({
            type: UNFOLLOW_USER_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: UNFOLLOW_USER_FAILURE,
            error: error,
        });
    }
}
function* watchUnFollowUser() {
    yield takeEvery(UNFOLLOW_USER_REQUEST, unFollowUser);
}

function loadFollowersAPI(userId, offset = 0, limit = 3) {
    return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`, {
        withCredentials: true,
    });
}
function* loadFollowers(action) {
    try {
        const result = yield call(loadFollowersAPI, action.data, action.offset);
        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: error,
        });
    }
}
function* watchLoadFollowers() {
    yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function loadFollowingsAPI(userId, offset = 0, limit = 3) {
    console.log('loadFollowingsAPI', offset, limit);
    return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`, {
        withCredentials: true,
    });
}
function* loadFollowings(action) {
    try {
        const result = yield call(loadFollowingsAPI, action.data, action.offset);
        yield put({
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: error,
        });
    }
}
function* watchLoadFollowings() {
    yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function removeFollowerAPI(userId) {
    return axios.delete(`/user/${userId}/follower`, {
        withCredentials: true,
    });
}
function* removeFollower(action) {
    try {
        const result = yield call(removeFollowerAPI, action.data);
        yield put({
            type: REMOVE_FOLLOWER_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: REMOVE_FOLLOWER_FAILURE,
            error: error,
        });
    }
}
function* watchRemoveFollower() {
    yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function editNicknameAPI(nickname) {
    return axios.patch(
        `/user/nickname`,
        { nickname },
        {
            withCredentials: true,
        },
    );
}
function* editNickname(action) {
    try {
        const result = yield call(editNicknameAPI, action.data);
        yield put({
            type: EDIT_NICKNAME_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: EDIT_NICKNAME_FAILURE,
            error: error,
        });
    }
}
function* watchEditNickname() {
    yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
    yield all([
        fork(watchLogin),
        fork(watchSignUp),
        fork(watchLogout),
        fork(watchLoadUser),
        fork(watchFollowUser),
        fork(watchUnFollowUser),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchRemoveFollower),
        fork(watchEditNickname),
    ]);
}
