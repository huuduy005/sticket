Khi phía client request thì phía server luôn phản hồi theo dạng sau (xem example_response.json)

{
    status: "",
    message: "",
    data: Object,
}

Với "status" thì hiện tại chỉ có 2 giá trị  "OK" hoặc "FAIL"
    "message" là nội dung cần thông báo
    "data" là dữ liệu mà client yêu cầu có thể null hoặc là dạng object (nhưng format là json)
