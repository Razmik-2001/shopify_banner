const Banner = require("../models/bannerSchema");

class BannerController {
    static async getBanners(req, res) {
        const shop = req.headers["x-shopify-shop-domain"];
        const host = req.headers["x-shopify-host"];

        if (!host && !shop) {
            return res.status(403).json({success: false, error: "Missing Shopify headers"})
        }

        try {
            const banners = await Banner.find({shopDomain: shop});
            const now = new Date();

            const updatedBanners = await Promise.all(
                banners.map(async (banner) => {
                    const start = new Date(banner.startDate);
                    const end = new Date(banner.endDate);

                    if (now >= start && now <= end) {
                        banner.status = "active";
                    } else {
                        banner.status = "archive";
                    }

                    await banner.save();
                    return banner;
                })
            );
            res.json({
                updatedBanners,
                success: true
            });
        } catch (err) {
            console.error("getBanners error:", err);
            res.status(500).json({
                success: false,
                message: "Error getBanners",
            });
        }
    }

    static async createBanner(req, res) {
        try {
            const shop = req.headers["x-shopify-shop-domain"];
            const host = req.headers["x-shopify-host"];

            if (!shop || !host) {
                return res.status(400).json({success: false, error: "Missing Shopify headers"});
            }

            const {bannerText, discount, startDate, endDate} = req.body;

            if (!bannerText || !discount || !startDate || !endDate) {
                return res.status(400).json({success: false, error: "Missing required fields"});
            }

            let banner = await Banner.findOne({shopDomain: shop});

            if (banner) {
                banner.bannerText = bannerText;
                banner.discount = discount;
                banner.startDate = startDate;
                banner.endDate = endDate;
                banner.status = "archive";
                await banner.save();
            } else {
                banner = new Banner({
                    shopDomain: shop,
                    bannerText,
                    discount,
                    startDate,
                    endDate,
                    status: "archive",
                });
                await banner.save();
            }

            return res.status(200).json({
                success: true,
                message: "Banner created successfully",
            });

        } catch (error) {
            console.error("Create banner error:", error);
            return res.status(500).json({success: false, error: "Server error"});
        }
    }


    // static async closeBanner(req, res) {
    //     try {
    //         const shopDomain = req.headers["x-shopify-shop-domain"];
    //         const ad = await Banner.findOne({ shopDomain });
    //         if (!ad) return res.status(404).json({ success: false, error: "Not found" });
    //
    //         ad.status = "closed";
    //         await ad.save();
    //
    //         res.json({ success: true, ad });
    //     } catch (error) {
    //         console.error("Error closing ad:", error);
    //         res.status(500).json({ success: false, error: "Server error" });
    //     }
    // }
}

module.exports = BannerController;