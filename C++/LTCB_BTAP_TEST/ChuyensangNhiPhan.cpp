#include <iostream>
#include <string>
using namespace std;
int main() {
	int n;
	cin >> n;
	string nhi_phan = "";
	for (int i = 0; i < 8; i++) {
		nhi_phan = to_string(n % 2) + nhi_phan;
		n /= 2;
	}
	cout << nhi_phan << endl;
	return 0;
}