# Roofer

## About

This project consists of a simple [react-native](https://facebook.github.io/react-native/) application used to control a Smart Roof prototype with a NodeMCU, throuh the MQTT IoT protocol. For the arduino code associated with the prototypes, you can go [here](https://github.com/SOA4ID/auto_roof-arduino_code). 

## Instalation

Before being able to compile this project, you'll need to have Node.js and react native installed in your system. (the method for installing Node.js will depend on your operating system).

In order to install react native, open a terminal and type:
``` bash
npm install -g create-react-native
```
Once everything is installed correctly, you can proceed to clone the repository and install the dependencies.
```bash
git clone https://github.com/SOA4ID/auto_roof-react_native.git
cd /auto_roof-react_native/Roofer
npm install
```

## Running the application

This application is developed in react native, which means that it can be run on Android, as well as iOS. Before running the application, make sure to be running an android or iOS emulator. Alternatively, you can have a physical phone connected to the PC via USB.

**Android:**

```bash
react-native run-android
```

If the service fails to initialize correctly, then run:
```bash
react-native start
```
Open a separate terminal, and run:
```bash
react-native run-android
```



**iOS:**

```bash
react-native run-ios
```

If the service fails to initialize correctly, then run:
```bash
react-native start
```
Open a separate terminal, and run:
```bash
react-native run-ios
```


## Configuration

For security reasons, some files have been excluded. In order to succesfully connect to the MQTT Broker, you'll need to navigate to the /assets folder, and create a file called **Config.js**, the file should hace the following structure:

```javascript
const config = {
  host: 'myhost.mybroker.com', // Replace with your MQTT Broker's address, or IP adress
  port: myport, // Replace with your connection port (Ex. 1183)
  username: 'myUsername', // Replace with your username
  password: 'mypass', // Replace with your password
};

export default config;
```

> **Important:** The MQTT client used in this project is based on `Paho.MQTT.Client`, which means that your MQTT Broker must support Websocket connections, and that is the port you should use during the implementation. If do not have a preferred MQTT Broker Service Provider already, you can check [this one](http://cloudmqtt.com), for a free and easy implementation.
