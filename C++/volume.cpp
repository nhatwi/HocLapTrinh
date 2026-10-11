#include <iostream>
#include <cmath>
using namespace std;
int main() {
//volume caculator
	const float pi = 3.14; 
	float r,V;
	cout <<"Please input the radious of the circle: ";
	cin >> r;
	V = 4*pi*pow(r,3)/3;
	cout <<"Here the volune of the circle: "<< V<< endl;
	return 0;
}
