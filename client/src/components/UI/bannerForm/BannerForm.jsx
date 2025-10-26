import React, { useState } from "react";
import {useDispatch} from "react-redux";

import {addBanner, getBanner} from "../../../app/features/bannerThunk";
import "./BannerForm.css";

function BannerForm() {
    const [formData, setFormData] = useState({
        bannerText: "",
        startDate: "",
        endDate: "",
        discount: ''
    });

    const dispatch = useDispatch();

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        dispatch(addBanner(formData))
            .unwrap()
            .then(() => {
                dispatch(getBanner());

            })
            .catch((error) => {
                console.error('Failed to add banner and refresh list:', error);
            });
    }

    return (
        <div className="banner-container">
            <h2 className="banner-title">Create Banner</h2>
            <form className="banner-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Banner Text</label>
                    <input
                        type="text"
                        value={formData.bannerText}
                        onChange={(e) => handleChange("bannerText", e.target.value)}
                        placeholder="Enter banner text"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Discount</label>
                    <input
                        type="text"
                        value={formData.discount}
                        onChange={(e) => handleChange("discount", e.target.value)}
                        placeholder="Enter discount"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleChange("startDate", e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleChange("endDate", e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="banner-button">
                    Save Banner
                </button>
            </form>
        </div>
    );
}

export default BannerForm;
