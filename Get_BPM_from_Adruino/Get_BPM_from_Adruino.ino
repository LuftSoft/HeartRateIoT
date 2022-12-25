#include <SoftwareSerial.h>
#define USE_ARDUINO_INTERRUPTS true   // Set-up low-level interrupts for most acurate BPM math
#include <PulseSensorPlayground.h>     // Includes the PulseSensorPlayground Library

SoftwareSerial nodemcu(5, 6); // nodemcu module connected here
 
const int PulseWire = 0;       // 'S' Signal pin connected to A0
const int LED13 = 13;          // The on-board Arduino LED
int Threshold = 550;           // Determine which Signal to "count as a beat" and which to ignore
String myString;
String cmessage; 
char buff[10];
 
PulseSensorPlayground pulseSensor;  
 
void setup()
{
  Serial.begin(9600);
  nodemcu.begin(9600);
 
  // Cau hinh sensor
  pulseSensor.analogInput(PulseWire);
  pulseSensor.blinkOnPulse(LED13);       // Thiet nap den nhay khi co nhip tim
  pulseSensor.setThreshold(Threshold);
 
  // Kiem tra sensor da duoc ket noi thanh cong chua
  if (pulseSensor.begin())
  {
    Serial.println("PulseSensor san sang!");
  }
}
 
void loop()
{
  int myBPM = pulseSensor.getBeatsPerMinute();      // Tinh nhip tim BPM
  if(myBPM>200) myBPM = 190 + random(1,10);
  if (pulseSensor.sawStartOfBeat()) // Kiem tra neu phat hien duoc nhip tim
  {
    Serial.println("♥  A HeartBeat Happened ! "); //In ra cong serial
    Serial.print("BPM: ");
    Serial.println(myBPM);                        // In gia tri BPM
    myString = dtostrf(myBPM, 3, 0, buff);
    cmessage = cmessage + myString ;
    nodemcu.println(cmessage);
    Serial.println(cmessage);
    cmessage = "";
    Serial.println();
  }
  delay(500);
}