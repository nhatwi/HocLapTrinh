#include <iostream>
#include <cmath>
using namespace std;
int main() {
	// Đây là chương trình tính chu vi và diện tích hình tam giác
	float a, b, c, p;
	cout <<" Vui lòng nhập 3 cạnh của tam giác: ";
	cin >> a >> b >> c;
	cout <<" Chu vi của hình tam giác là: " << (a + b + c) << endl;
	p = (a + b + c) / 2.0;
	cout <<" Diện tích của hình tam giác là: "<< sqrt(p*(p-a)*(p-b)*(p-c))<< endl;
	return 0;
}
