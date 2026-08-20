const buildProductSort = (sort) => {

    switch (sort) {

        case "price":
            return {
                defaultOnlinePrice: 1
            };

        case "-price":
            return {
                defaultOnlinePrice: -1
            };

        case "name":
            return {
                name: 1
            };

        case "-name":
            return {
                name: -1
            };

        case "oldest":
            return {
                createdAt: 1
            };

        case "newest":
        case "-createdAt":
        default:
            return {
                createdAt: -1
            };

    }

};

module.exports = buildProductSort;