#include <ArduinoJson.h>
#include <ArduinoJson.hpp>

#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>

#include<FirebaseESP8266.h>

#include <time.h>

#define FIREBASE_HOST "https://iot2022-cad90-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "CSOuyFgCrCgrVMLjxpFM8dBW3C14ekMXDNtO2I9g"
#define WIFI_SSID "Aries__21"
#define WIFI_PASSWORD "012346789"
FirebaseData firebaseData;
FirebaseJson firebaseJson;
SoftwareSerial s(D6,D5);
String data;
String path = "/";
double tmp;
String currentTime;
//time
int timezone = 7*3600;
int dst=0;
//time
void setup() {
  WiFi.begin(WIFI_SSID,WIFI_PASSWORD);
  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Firebase.begin(FIREBASE_HOST,FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  if(!Firebase.beginStream(firebaseData,path)){
    Serial.println("REASON:  "+ firebaseData.errorReason() );
  }
  // put your setup code here, to run once:
  Serial.print("Connect with IP:  ");
  Serial.print(WiFi.localIP());
  Serial.println();
  s.begin(9600);
  Serial.begin(9600);
  //-----------TIME--------------
  configTime(timezone, dst, "pool.ntp.org","time.nist.gov");
  Serial.println("\nWaiting for Internet time");

  while(!time(nullptr)){
     Serial.print("*");
     delay(1000);
  }
  Serial.println("\nTime response....OK");  
  //----------set up firebase------------
  //----------xoa du lieu lan do truoc di-----------
  //-----------TIME-------------- 
}

void loop() {
  // s.write("s");
  int param = 0;
  if(Firebase.getInt(firebaseData,"/heart/init/run")){
    if (firebaseData.dataTypeEnum() == fb_esp_rtdb_data_type_integer) {
      param = firebaseData.to<int>();
    }
  }
  if(s.available()>0 && param==1){
    data = s.readStringUntil('\r');
    if(data!=""){
      s.end() ;
            // tmp = millis();
      // currentTime = String(tmp,0);
      time_t now = time(nullptr);
      struct tm* p_tm = localtime(&now);
      currentTime = String(p_tm->tm_year + 1900) + "-" + String(p_tm->tm_mon + 1) + "-" + String(p_tm->tm_mday) + " " + String(p_tm->tm_hour)+":"+String(p_tm->tm_min)+":"+String(p_tm->tm_sec);
      Firebase.setString(firebaseData,path+"/heart/realtime/heartbeat",data);
      Firebase.setString(firebaseData,path+"/heart/realtime/time",currentTime);
      Firebase.setString(firebaseData,path+"/heart/heartlogs/"+currentTime,data);
      Serial.println(currentTime+ " : "+ data);
      s.begin(9600);
    }
  }
  /*
    Serial.print(p_tm->tm_mday);
    Serial.print("/");
    Serial.print(p_tm->tm_mon + 1);
    Serial.print("/");
    Serial.print(p_tm->tm_year + 1900);
    
    Serial.print(" ");
    
    Serial.print(p_tm->tm_hour);
    Serial.print(":");
    Serial.print(p_tm->tm_min);
    Serial.print(":");
    Serial.println(p_tm->tm_sec);
    */

}
