import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import axios from 'axios';
import {
    ADD_POST_REQUEST,
    ADD_POST_SUCCESS,
    ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAILURE,
    LOAD_MAIN_POSTS_REQUEST,
    LOAD_MAIN_POSTS_SUCCESS,
    LOAD_MAIN_POSTS_FAILURE,
    LOAD_HASHTAG_POSTS_REQUEST,
    LOAD_HASHTAG_POSTS_SUCCESS,
    LOAD_HASHTAG_POSTS_FAILURE,
    LOAD_USER_POSTS_REQUEST,
    LOAD_USER_POSTS_SUCCESS,
    LOAD_USER_POSTS_FAILURE,
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

function loadMainPostsAPI() {
    return axios.get('/posts');
}
function* loadMainPosts() {
    try {
        const result = yield call(loadMainPostsAPI);
        yield put({
            type: LOAD_MAIN_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: LOAD_MAIN_POSTS_FAILURE,
            error: error,
        });
    }
}
function* watchLoadMainPosts() {
    yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

function loadHashtagPostsAPI(tag) {
    return axios.get(`/hashtag/${tag}`);
}
function* loadHashtagPosts(action) {
    try {
        const result = yield call(loadHashtagPostsAPI, action.data);
        yield put({
            type: LOAD_HASHTAG_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: LOAD_HASHTAG_POSTS_FAILURE,
            error: error,
        });
    }
}
function* watchLoadHashtagPosts() {
    yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function loadUserPostsAPI(id) {
    return axios.get(`/user/${id}/posts`);
}
function* loadUserPosts(action) {
    try {
        const result = yield call(loadUserPostsAPI, action.data);
        yield put({
            type: LOAD_USER_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (error) {
        console.log(error);
        yield put({
            type: LOAD_USER_POSTS_FAILURE,
            error: error,
        });
    }
}
function* watchLoadUserPosts() {
    yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

export default function* postSaga() {
    yield all([
        fork(watchAddPost),
        fork(watchLoadMainPosts),
        fork(watchAddComment),
        fork(watchLoadHashtagPosts),
        fork(watchLoadUserPosts),
    ]);
}
