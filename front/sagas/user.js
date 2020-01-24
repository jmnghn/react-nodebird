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
        yield put({
            type: LOG_IN_FAILURE,
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

function loadUserAPI() {
    return axios.get('/user/', {
        withCredentials: true,
    });
}
function* loadUser() {
    try {
        const result = yield call(loadUserAPI);
        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
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

export default function* userSaga() {
    yield all([fork(watchLogin), fork(watchSignUp), fork(watchLogout), fork(watchLoadUser)]);
}
