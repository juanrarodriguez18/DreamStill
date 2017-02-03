require('dotenv').config()
var request = require('sync-request');

module.exports = {
    getDates: function () {
        var result;
        var currentMonth;
        var twoMonthBefore;
        var oneMonthBefore;

        currentMonth = new Date().toLocaleString('en-us', {month: 'long'}) + " " + new Date().getFullYear();
        twoMonthBefore = new Date();
        twoMonthBefore.setMonth(twoMonthBefore.getMonth() - 2);
        twoMonthBefore = twoMonthBefore.toLocaleString('en-us', {month: 'long'}) + " " + twoMonthBefore.getFullYear();
        oneMonthBefore = new Date();
        oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
        oneMonthBefore = oneMonthBefore.toLocaleString('en-us', {month: 'long'}) + " " + oneMonthBefore.getFullYear();
        result = [currentMonth, twoMonthBefore, oneMonthBefore]

        return result;
    },

    getNumMorpheuzEventsOfCurrentMonthForUserId: function (morpheuzID) {
        var result = 0;
        var res = request('GET', 'https://dreamstill-d507c.firebaseio.com/morpheuz/' + morpheuzID + '.json?auth=' + process.env.FIREBASE_SECRET + '&shallow=true', {
            'headers': {
                'Content-Type': ' application/json'
            }
        });

        events = JSON.parse(res.getBody('utf8'));
        var daysOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        console.log(daysOfMonth);
        for (var _i = 1; _i <= daysOfMonth; _i++) {
            var date = new Date(new Date().getFullYear(), new Date().getMonth(), _i)
            var year = "" + date.getFullYear();
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            if (events[year + "-" + month + "-" + day] !== undefined) {
                result++;
            }
        }
        return result;
    }
};