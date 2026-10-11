#include <cmath>
#include <iostream>
using namespace std;
int main() {
	// nhâp 2 số x và y 
	int x, y;
	cout <<"Nhập 2 giá trị nguyên của bạn: ";
	cin >> x >> y;
	// in ra giá trị tuyệt đối của y và tính x^y
	cout <<"Giá trị tuyệt đối của y là " << abs(y) << endl;
	cout <<"Giá trị của x^|y| là " << pow(x, abs(y)) << endl;
	return 0;
}
