class APIFeatures {
    constructor(query, queyStr) {
        this.query = query;
        this.queyStr = queyStr;
    }

    // search feature
    search() {
        const keyword = this.queyStr.keyword ? {
            name: {
                $regex: this.queyStr.keyword,
                $options: "i"
            }
        }
            : {};

        console.log("search keyword :: ", keyword);

        this.query = this.query.find({ ...keyword });
        return this;
    }

    // filter
    filter() {
        const queryStrCopy = { ...this.queyStr };

        // Removing some fields from queryStr for catogory
        const removeFileds = ["keyword", "page", "limit"];

        // deletes removeFileds from queryStrCopy
        removeFileds.forEach(key => delete queryStrCopy[key]);

        console.log("filter :: queryStrCopy ", queryStrCopy);
        // this.query = this.query.find(queryStrCopy); // this is sufficient for single filter like price, catogory etc but not for lt, lte etc.

        // Filter for price and rating 
        // we will pass price as price[gt],price[gte], etc so we need to add $ before gt, gte, lt, lte to make it valid mongodb operator
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;

    }

    // pagination
    pagination(resultPerPage) {
        const currentPage = Number(this.queyStr.page) || 1;

        // Decides from how much products to skip to go to specific page
        const skipCount = resultPerPage * (currentPage - 1);

        console.log("pagination :: skipCount ",skipCount);

        this.query = this.query.limit(resultPerPage).skip(skipCount);

        return this;
    }

}

module.exports = APIFeatures;