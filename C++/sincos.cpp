#include <iostream>
#include <cmath>
using namespace std;
int main() {
	float x;
	const float pi = 3.14;
	cout <<"Nhập vào số đo góc theo độ ";
	cin >> x;
	x = x * pi / 180.0;
	cout <<"Gía trị sin(x) là: "<< sin(x)<< endl;
	cout <<"Giá trị của cos(x) là: "<< cos(x)<< endl;
	cout <<"Giá trị của tan(x) là: "<< tan(x)<< endl;
	return 0;
}
