import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import Slick from 'react-slick';
import { Icon } from 'antd';
import styled from 'styled-components';
import { backUrl } from '../config/config';

const Overlay = styled.div`
    position: fixed;
    z-index: 5000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

const Header = styled.header`
    height: 46px;
    background: white;
    position: relative;
    padding: 0;
    text-align: center;

    & h1 {
        margin: 0;
        font-size: 17px;
        color: #333;
        line-height: 44px;
    }
`;

const SlickWrapper = styled.div`
    height: calc(100% - 44px);
    background: #090909;
`;

const CloseButton = styled(Icon)`
    position: absolute;
    right: 0;
    top: 0;
    padding: 15px;
    line-heigth: 14px;
    cursor: pointer;
`;

const IndicatorWrapper = styled.div`
    text-align: center;

    & > div {
        width: 75;
        height: 30;
        line-height: 30px;
        border-radius: 15;
        background: #313131;
        display: inline-block;
        text-align: center;
        color: white;
        font-size: 15px;
    }
`;

export const ImageWrapper = styled.div`
    padding: 32px;
    text-align: center;
    position: relative;

    & > img {
        margin: 0 auto;
        max-width: 100%;
        max-height: 750px;
        width: none;
    }
`;

const ImagesZoom = ({ images, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <Overlay>
            <Header>
                <h1>상세 이미지</h1>
                <CloseButton type="close" onClick={onClose} />
            </Header>
            <SlickWrapper>
                <div>
                    <Slick
                        initialSlide={0}
                        afterChange={(slide) => setCurrentSlide(slide)}
                        infinite={false}
                        arrows
                        slidesToShow={1}
                        slidesToScroll={1}
                    >
                        {images.map((v) => {
                            return (
                                <ImageWrapper key={v.id} style={{ position: 'relative' }}>
                                    <img src={v.src} />
                                </ImageWrapper>
                            );
                        })}
                    </Slick>
                    <IndicatorWrapper>
                        <div
                            style={{ position: 'absolute', bottom: '70px', left: '0', right: '0', background: 'none' }}
                        >
                            {currentSlide + 1} / {images.length}
                        </div>
                    </IndicatorWrapper>
                </div>
            </SlickWrapper>
        </Overlay>
    );
};

ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string,
        }),
    ).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
