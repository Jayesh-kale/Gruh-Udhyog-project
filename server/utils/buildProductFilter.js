const buildProductFilter = (query) => {

    const {
        search,
        category,
        type,
        season,
        isListedOnline,
        isSeasonal
    } = query;

    const filter = {
        isActive: true
    };

    // Search
    if (search) {

        filter.$or = [

            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                category: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                type: {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }

    // Category
    if (category) {
        filter.category = category;
    }

    // Type
    if (type) {
        filter.type = type;
    }

    // Season
    if (season) {
        filter.season = season;
    }

    // Online Product
    if (isListedOnline !== undefined) {
        filter.isListedOnline = isListedOnline === "true";
    }

    // Seasonal Product
    if (isSeasonal !== undefined) {
        filter.isSeasonal = isSeasonal === "true";
    }

    return filter;

};

module.exports = buildProductFilter;