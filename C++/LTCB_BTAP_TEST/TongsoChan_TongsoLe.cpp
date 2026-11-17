#include <iostream>
using namespace std;
int main() {
	int n, biendem = 0, tongsochan = 0, tongsole = 0;
	cin >> n;
	while (biendem <= n) {
		if (biendem % 2 == 0) {
			tongsochan += biendem;
			biendem++;
		} else {
			tongsole += biendem;
			biendem++;
		}
	}
	cout << tongsochan << endl << tongsole;
	return 0;
}