import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const Hashtag = ({ tag }) => {
    const { mainPosts, hasMorePost } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const countRef = useRef([]);

    const onScroll = useCallback(() => {
        // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
        // console.log(mainPosts[mainPosts.length - 1].id);
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
            if (hasMorePost) {
                let lastId = mainPosts[mainPosts.length - 1].id;
                console.log(countRef.current);
                if (!countRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_HASHTAG_POSTS_REQUEST,
                        lastId,
                        data: tag,
                    });
                    countRef.current.push(lastId);
                }
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
            {mainPosts.map((c) => (
                <PostCard key={c.id} post={c} />
            ))}
        </div>
    );
};

Hashtag.propTypes = {
    tag: PropTypes.string.isRequired,
};

Hashtag.getInitialProps = async (context) => {
    console.log('Hashtag getInitialProps', context.query.tag);
    const tag = context.query.tag;
    context.store.dispatch({
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: tag,
    });
    return { tag };
};

export default Hashtag;
