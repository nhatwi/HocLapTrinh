#include <iostream>
using namespace std;
	int main() { //Tôi sẽ chuyển các lệnh if lồng sau thành switch..
//if (factor == 1)
//    p = 25.0;
//else
//    if (factor == 2)
//        p = 6.0;
//    else
//        if (factor == 3)
//            p = 100;
//        else
//            if ((factor == 4) || (factor == 6))
//                p = 200;
//```[cite: 3]
	int factor;
	float p;
	cout <<"Vui lòng nhập số factor của bạn: ";
	cin >> factor;
	switch (factor) {
		case 1:
			p = 25.0;
			break;
		case 2:
			p = 6.0;
			break;
		case 3:
			p = 100;
			break;
		case 4:
		case 6:
			p = 200;
			break;
		default:
			cout <<"Không có giá trị p tương ưng với factor này"<< endl;
			break;
		}
	if (p != 0) {
		cout <<"Giá trị của p là: "<< p<< endl;
		}
	return 0;
}
