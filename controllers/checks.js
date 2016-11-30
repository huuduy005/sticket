var Tickets = require('../models/tickets');
var jwt = require('jsonwebtoken');
var config = require('../config');
var secret = config.secret;

var CheckController = {};



/*
    Analyze to RSA, OPT, MAC, Time
*/
var Analyze = function (req, res) {

}


/*
    Create OTP from idTicket and Time
*/
var CreateOTP = function (idTicket, time) {
    return idTicket;
}


/*
    ----------------------
    req.body
    + idTicket:
    + MAC
    + OTP
    + time
    + trip
*/
CheckController.Approve = function (req, res) {
    /*
        TODO: 
        + Từ req.body.code gọi Analyze để phân tích thành các thành phần RSA, OTP, MAC, Time
        + Giả mã RSA với key private => idTicket
    */

    var idTicket = req.body.idTicket;
    var MAC = req.body.MAC;
    var OTP = req.body.OTP;
    var time = req.body.time;
    var trip = req.body.trip;

    // Find Mac
    Tickets.findOne({
        idTicket: idTicket
    }, function (err, ticket) {
        if (err) next(new Error(err));
        if (!ticket) {
            res.json({
                status: 'Fail',
                message: 'Không tồn tại vé'
            });
        } else {
            var OTPTicket = CreateOTP(ticket.idTicket, time);
            if(OTP !== OTPTicket) {
                res.json({
                    status: 'Fail',
                    message: 'OTP sai rồi'
                });
            } else {
                /* Check đi vào */
                if(trip === 'true')
                {
                    /* Vé đã được dùng*/
                    if(ticket.in === true && ticket.out === false)
                    {
                        res.json({
                            status: 'Fail',
                            message: 'Vé đã có người dùng'
                        });
                    } else {
                        /* Trường hơp vé đi vào lần thứ 2*/
                        if(ticket.device !== null && ticket.device !== MAC)
                        {
                            res.json({
                                status: 'Fail',
                                message: 'Vào lần hai sai MAC'
                            });
                        } else {
                            console.log(ticket);
                            console.log(MAC);
                            /*
                            Tickets.update({_id: ticket._id}, {$set: {device: MAC}, $set: {in: true}
                                                                , $set: {check_in.time: time}, $set: {check_in.by: req.decoded._doc.idUser}}, function (err, numUpdated) {
                                if(err)
                                    next(new Error(err));
                            });*/
                            ticket.device = MAC;
                            ticket.in = true;
                            Tickets.findOneAndUpdate({_id: ticket._id}, ticket, function (err, place) {
                                if (err) next(new Error(err));
                            });
                            console.log(ticket);
                            
                            res.json({
                                status: 'Success',
                                message: 'Check in'
                            });
                        }
                    }
                    /* Check đi ra*/
                } else {
                    if(ticket.in !== true)
                    {
                        /* Trường hợp này dự trù tình huống bị tấn công*/
                        res.json({
                            status: 'Fail',
                            message: 'Vé chưa check đi vào nên không thể check đi ra'
                        });
                    } else {

                        ticket.in = false;
                        /*
                        Tickets.update({_id: ticket._id}, {$set: {in: false}
                                                            , $set: {check_in.time: time}, $set: {check_in.by: req.decoded._doc.idUser}}, function (err, numUpdated) {
                            if(err)
                            {
                                console.log('err');
                                next(new Error(err));
                            }
                        });*/
                        Tickets.findOneAndUpdate({_id: ticket._id}, ticket, function (err, place) {
                                if (err) next(new Error(err));
                        });
                        console.log(ticket);
                        res.json({
                            status: 'Success',
                            message: 'Check out'
                        });
                    }  
                }
            }
        }
            
    });
};



module.exports = CheckController;