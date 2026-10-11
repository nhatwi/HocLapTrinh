#include <iostream>
#include <cmath>
using namespace std;
int main() {
	//Tính tổng các số nguyên từ a tới n
	float s,n,a,d;
	cout <<"Vui lòng nhập số lượng số nguyên được thực hiện tính tổng: ";
	cin >> n;
	cout <<"Vui lòng nhập giá trị của số nguyên đầu tiên: ";
	cin >> a;
	cout <<"Vui lòng nhập độ lệch của hai số liên tiếp: ";
	cin >> d;
	cout <<"Tổng các số nguyên từ a tới n là: "<< (n/2.0)*(2*a + (n-1)*d)<< endl;
	return 0;
} 

