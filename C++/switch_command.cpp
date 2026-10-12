#include <iostream>
using namespace std;
int main() {
	int x;
	cout <<"Nhập vào số nguyên từ 1 đến 7: ";
	cin >> x;
		switch (x) {
	case 1: cout <<"Chủ nhật"<< endl; break;
	case 2: cout <<"Thứ hai"<< endl; break;
	case 3: cout <<"Thứ ba"<< endl; break;
	case 4: cout <<"Thứ tư"<< endl; break;
	case 5: cout <<"Thứ năm"<< endl; break;
	case 6: cout <<"Thứ sáu"<< endl; break;
	case 7: cout <<"Thứ bảy"<< endl; break;
	default: 
		cout <<"Nhập số nguyên không hợp lệ!!"<< endl; break;
		}
	return 0;
}
