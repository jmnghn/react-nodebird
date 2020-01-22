import { all, fork, put, call, takeEvery } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE } from '../reducers/user';

function loginAPI() {
    // 서버에 요청을 보내는 부분
}

function* login() {
    try {
        yield call(loginAPI);
        yield put({
            type: LOG_IN_SUCCESS,
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: LOG_IN_FAILURE,
        });
    }
}

function* watchLogin() {
    yield takeEvery(LOG_IN, login);
}

function* watchSignUp() {}

export default function* userSaga() {
    yield all([fork(watchLogin)]);
}
