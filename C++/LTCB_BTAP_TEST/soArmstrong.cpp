#include <iostream>
#include <cmath>
using namespace std;
int main() {
	int n, bac = 0, tong = 0;
	cin >> n;
	int temp = n;
//kiểm tra có bao nhiêu chữ số?? 
	while(temp > 0) {
		temp /= 10;
		bac++;
	}
//tính toán
	temp = n;
	while (temp > 0) {
		tong += round(pow(temp % 10, bac));
		temp /= 10;
	}
	if (tong == n) cout << "La so Armstrong";
	else cout << "Khong la so Armstrong";
	return 0;
}