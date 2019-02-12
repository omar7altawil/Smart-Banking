
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#define FIREBASE_HOST "smart-banking-d46e6.firebaseio.com"
#define FIREBASE_AUTH "BUwntR3gepiTfiqU43ZKc0Uh3hywUnrbLaX8YMh0"
#define WIFI_SSID "Open-Access"
#define WIFI_PASSWORD ""
int count=0;
int timeout=0;
void setup() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  pinMode(2, INPUT);
  pinMode(0, OUTPUT);
  attachInterrupt(2, button, RISING);

}
void button(){
count++;
}

void loop() {
if(Firebase.getInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/auth")==1){
  digitalWrite(0,HIGH);
  timeout++;
  delay(1);
  if(Firebase.getInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/password")==count){
      Firebase.setInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/auth",5);
      digitalWrite(0,LOW);
      count=0;
      timeout=0;
    }
    else if( count>7 ){
        Firebase.setInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/auth",2);
        digitalWrite(0,LOW);
        count=0;
        timeout=0;
        }
  
  else if(timeout >=200){
    Firebase.setInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/auth",3);
    digitalWrite(0,LOW);
    count=0;
    timeout=0;
    }
}
else if(Firebase.getInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/auth")==6){
  timeout=0;
  count=0;
  digitalWrite(0,HIGH);
  delay(10000);
  digitalWrite(0,LOW);
  Firebase.setInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/auth",0);
  if(count<3 ||count>7)
  Firebase.setInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/password",3);
  else
  Firebase.setInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/password",count);
  timeout=0;
  count=0;
  }
  else if(Firebase.getInt("Alexa/1111099711446971081169711910510864104111116109971051084699111109/omar/auth")==6){
    digitalWrite(0,LOW);
    timeout=0;
    count=0;
  }
}
