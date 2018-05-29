var DecisionTree = function(image, dtree) {

    this.init = function(image, dtree) {

        this.image = image;
        this.dtree = dtree;

        this._setVariables();
        this._classify();
    };

    /**
     * [_setVariables description]
     */

    this._setVariables = function() {

        if (this.image !== null) {
            this.variables = {
                "red": this.image.select(["red"]),
                "green": this.image.select(["green"]),
                "blue": this.image.select(["blue"]),
                "nir": this.image.select(["nir"]),
                "swir1": this.image.select(["swir1"]),
                "swir2": this.image.select(["swir2"]),
                "thermal": this.image.select(["thermal"]),
                "gv": this.image.select(["gv"]),
                "gvs": this.image.select(["gvs"]),
                "npv": this.image.select(["npv"]),
                "soil": this.image.select(["soil"]),
                "cloud": this.image.select(["cloud"]),
                "shade": this.image.select(["shade"]),
                "ndfi": this.image.select(["ndfi"]),
                "water_mask": this.image.select(["water_mask"]),
                "cloud_mask": this.image.select(["cloud_mask"]),
                "shade_mask": this.image.select(["shade_mask"]),
            };
        }
    };

    /**
     * [_applyRule description]
     * @param  {[type]} rule [description]
     * @return {[type]}      [description]
     */

    this._applyRule = function(rule) {

        var variable = this.variables[rule.variable];
        var result;

        if (rule.operator === ">") {
            result = variable.gt(rule.thresh);

        } else if (rule.operator === ">=") {
            result = variable.gte(rule.thresh);

        } else if (rule.operator === "<") {
            result = variable.lt(rule.thresh);

        } else if (rule.operator === "<=") {
            result = variable.lte(rule.thresh);

        } else if (rule.operator === "=") {
            result = variable.eq(rule.thresh);

        } else if (rule.operator === "!=") {
            result = variable.neq(rule.thresh);

        } else {
            result = null;
        }

        return result;
    };

    /**
     * [_recursion description]
     * @param  {[type]} node           [description]
     * @param  {[type]} mask           [description]
     * @param  {[type]} classification [description]
     * @return {[type]}                [description]
     */

    this._recursion = function(node, mask, classification) {

        var result;

        if (self.dtree[node].kind === "decision") {

            // apply rule
            result = this._applyRule(this.dtree[node].rule);

            // not agree
            var node1 = String(this.dtree[node].children[0].level) + "-" +
                String(this.dtree[node].children[0].position);

            // agree
            var node2 = String(this.dtree[node].children[1].level) + "-" +
                String(this.dtree[node].children[1].position);

            var result1 = this._recursion(node1, result.eq(
                0).multiply(mask), classification); // not agree

            var result2 = this._recursion(node2, result.eq(
                1).multiply(mask), classification); // agree

            classification = result1.add(result2);
        } else {
            classification = classification.where(mask.eq(1).and(
                classification.eq(0)), this.dtree[node].class.value);
        }

        return classification;
    };

    /**
     * [_classify description]
     * @return {[type]} [description]
     */

    this._classify = function() {

        this.classification = this._recursion("1-1", ee.Image(1), ee.Image(0))
            .select([0], ["classification"]);

    };

    /**
     * [getData description]
     * @return {[type]} [description]
     */
    this.getData = function() {

        return this.classification;
    };

    this.init(image, dtree);
};