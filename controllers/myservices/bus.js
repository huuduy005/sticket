var Bus = {};

//Lấy thông tin tuyến
Bus.getBusDetail = function () {
    var url = 'http://apicms.ebms.vn/businfo/getroutebyid/1';
};

//Lấy danh sách trạm dừng của tuyến
Bus.getBusStop = function () {
    var url = 'http://apicms.ebms.vn/businfo/getstopsbyvar/6/2';
};

module.exports = Bus;