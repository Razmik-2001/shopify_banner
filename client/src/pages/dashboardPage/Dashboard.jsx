import React, {useEffect, useState} from "react";
import {IoCloseSharp} from "react-icons/io5";
import BannerForm from "../../components/UI/bannerForm/BannerForm";
import {useDispatch, useSelector} from "react-redux";
import {getBanner} from '../../app/features/bannerThunk';

import {Spinner} from '@shopify/polaris';

import "./Dashboard.css";

function Dashboard() {
    const [closeBanner, setCloseBanner] = useState(false);

    const dispatch = useDispatch();
    const {banners, loading} = useSelector(state => state.banner);

    const activeBanners = banners.filter(banner => banner.status === "active");

    useEffect(() => {
        dispatch(getBanner());
    }, [dispatch]);

    return (
        <>
            {loading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh'}}>
                    <Spinner size="small" accessibilityLabel="Loading banners"/>
                </div>
            ) : activeBanners.length === 0 ? (
                <BannerForm/>
            ) : (
                !closeBanner && activeBanners.map((banner) => (
                    <div className="banner-wrapper" key={banner._id}>
                        <div className="banner-item">
                            <div className="icon-box" onClick={() => setCloseBanner(true)}>
                                <IoCloseSharp className="icon"/>
                            </div>

                            <div className="discount-section">
                                <p className="discount-percent">{banner.discount}%</p>
                                <p className="discount-off">OFF</p>
                            </div>

                            <div className="content-area">
                                <div className="banner-text">
                                    <h1>{banner.bannerText}</h1>
                                </div>
                            </div>

                            <div className="super-sale-text">
                                <p className="super-text">SUPER</p>
                                <p className="sale-text">SALE</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </>
    );
}

export default Dashboard;
