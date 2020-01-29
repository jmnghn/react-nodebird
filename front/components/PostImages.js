import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import ImagesZoom from './ImagesZoom';
import { backUrl } from '../config/config';

const PostImages = ({ images }) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);

    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);

    if (images.length === 1) {
        return (
            <>
                <img alt="example" src={images[0].src} onClick={onZoom} />
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        );
    }

    if (images.length === 2) {
        return (
            <>
                <div>
                    <img alt="example" src={images[0].src} onClick={onZoom} width="50%" />
                    <img alt="example" src={images[1].src} onClick={onZoom} width="50%" />
                </div>
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        );
    }

    return (
        <>
            <div>
                <img alt="example" src={images[0].src} onClick={onZoom} width="50%" />
                <div
                    style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
                    onClick={onZoom}
                >
                    <Icon type="plus" />
                    <br />
                    {images.length - 1}
                    개의 사진 더보기
                </div>
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
        </>
    );
};

PostImages.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string,
        }),
    ).isRequired,
};

export default PostImages;
