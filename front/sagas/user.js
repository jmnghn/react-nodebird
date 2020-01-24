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
} from '../reducers/user';

axios.defaults.baseURL = 'http://localhost:3065/api';

function loginAPI(loginData) {
    // 서버에 요청을 보내는 부분
    return axios.post('/user/login', loginData);
}

function signUpAPI(signUpdata) {
    // 서버에 요청을 보내는 부분
    return axios.post('/user', signUpdata);
}

function logoutAPI() {
    // 서버에 요청을 보내는 부분
    return axios.post('/user/logout');
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

function* logout() {
    try {
        yield call(logoutAPI);
        yield put({
            type: LOG_OUT_SUCCESS,
        });
    } catch (error) {
        yield put({
            type: LOG_OUT_FAILURE,
        });
    }
}

function* watchLogin() {
    yield takeEvery(LOG_IN_REQUEST, login);
}

function* watchSignUp() {
    yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function* watchLogout() {
    yield takeLatest(LOG_OUT_REQUEST, logout);
}

export default function* userSaga() {
    yield all([fork(watchLogin), fork(watchSignUp), fork(watchLogout)]);
}
