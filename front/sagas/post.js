import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import axios from 'axios';
import {
    ADD_POST_REQUEST,
    ADD_POST_SUCCESS,
    ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAILURE,
} from '../reducers/post';

function addPostAPI(postData) {
    console.log('addPost 2');
    return axios.post('/post', postData, {
        withCredentials: true,
    });
}

function* addPost(action) {
    try {
        console.log('addPost', action);
        const result = yield call(addPostAPI, action.data);
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: ADD_POST_FAILURE,
            error: error,
        });
    }
}
function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* addComment(action) {
    try {
        yield delay(2000);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: {
                postId: action.data.postId,
            },
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: error,
        });
    }
}
function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
    yield all([fork(watchAddPost), fork(watchAddComment)]);
}
