#include <iostream>
#include <cmath>
using namespace std;
int main () {
	float S,v,t;
	cout <<"Please input your distance 'S'(meter)? velocity 'v(m/s)'? ";
	cin >> S >> v;
	t = S/v;
	cout <<"Here the total arrival time(s):  "<< t << endl;
	return 0;
}
