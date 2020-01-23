import { all, fork, put, call, takeEvery, delay } from 'redux-saga/effects';
import axios from 'axios';
import {
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS,
    LOG_IN_FAILURE,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,
} from '../reducers/user';

function loginAPI() {
    // 서버에 요청을 보내는 부분
}

function signUpAPI() {
    // 서버에 요청을 보내는 부분
}

function* login() {
    try {
        // yield call(loginAPI);
        yield delay(2000);
        yield put({
            type: LOG_IN_SUCCESS,
        });
    } catch (error) {
        yield put({
            type: LOG_IN_FAILURE,
        });
    }
}

function* signUp() {
    try {
        yield call(signUpAPI);
        yield delay(2000);
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

function* watchLogin() {
    yield takeEvery(LOG_IN_REQUEST, login);
}

function* watchSignUp() {
    yield takeEvery(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
    yield all([fork(watchLogin), fork(watchSignUp)]);
}
