import React, { useEffect, useCallback } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePost } = useSelector((state) => state.post);
    const dispatch = useDispatch();

    const onScroll = useCallback(() => {
        // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
        // console.log(mainPosts[mainPosts.length - 1].id);
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
            if (hasMorePost) {
                dispatch({
                    type: LOAD_MAIN_POSTS_REQUEST,
                    lastId: mainPosts[mainPosts.length - 1].id,
                });
            }
        }
    }, [hasMorePost, mainPosts.length]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [mainPosts.length]);

    return (
        <div>
            {me && <PostForm />}
            {mainPosts.map((c) => {
                return <PostCard key={c.id} post={c} />;
            })}
        </div>
    );
};

Home.getInitialProps = async (context) => {
    console.log(Object.keys(context));
    context.store.dispatch({
        type: LOAD_MAIN_POSTS_REQUEST,
    });
};

export default Home;
