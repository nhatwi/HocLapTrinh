#include <iostream>
#include <cmath>
using namespace std;
int main() {
	//Đây là chương trình tính chu vi, diện tích hình tam giác
	// Bán kính hình tròn nội tiếp và ngoại tiếp.
	float a, b, c ,p ,r ,R,S;
	cout <<" Vui lòng nhập 3 cạnh của tam giác: ";
	cin >> a >> b >> c;
	cout <<"Chu vi của hình tam giác là: "<< a+b+c << endl;
	p = (a+b+c)/2.0;
	S = sqrt(p*(p-a)*(p-b)*(p-c));
	cout <<"Diện tích của hình tam giác là: "<< S << endl;
	cout <<"Bán kính của đường tròn nội tiếp là: "<< S/p << endl;
	cout <<"Bán kính của đường tròn ngoại tiếp là: "<< (a*b*c)/(4*S) << endl;
	return 0;
}
