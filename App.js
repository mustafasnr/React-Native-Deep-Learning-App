import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);


  const stringResult = (result)=>{
    let jsonString = JSON.stringify(result, null, 2); // JSON verisini okunabilir hale getirir

// Her satırın sonuna \n eklemek için stringi böl ve yeniden birleştir
    jsonString = jsonString.split(",").map(line => line).join('\n').replace("{","").replace("}","").replace(",","");
    return jsonString
  }

  const pickImageHandler = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setSelectedImage(response.assets[0]);
      }
    });
  };
  
  const uploadImageHandler = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage.uri,
      name: selectedImage.fileName,
      type: selectedImage.type
    });

    try {
      const response = await fetch("http://192.168.1.33:8000/models/vgg16/", {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }
      result = await response.json()
      Alert.alert(title="Sonuçlar:",message=stringResult(result));
    } catch (error) {
      console.error('Upload error: ', error);
      Alert.alert('Upload failed', 'There was an error uploading your image.');
    }
    return
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{uri: selectedImage.uri}} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Image Selected</Text>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImageHandler}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={uploadImageHandler}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#f8f8f8'
  },
  imageContainer: {
    width: '80%',
    height: 350,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  image: {
    width: '100%',
    height: '100%'
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  placeholderText: {
    color: '#999',
    fontSize: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%'
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});

export default App;