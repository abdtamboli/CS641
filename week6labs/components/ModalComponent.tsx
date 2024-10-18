import React from 'react';
import { Modal, View, Text, StyleSheet, Button, Image } from 'react-native';

// Path to the image
const modalImage = require('../assets/modal-image.png'); // Import image from the assets folder

interface ModalComponentProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const ModalComponent = ({ modalVisible, setModalVisible }: ModalComponentProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>This is the Modal!</Text>

          {/* Display the image inside the modal */}
          <Image source={modalImage} style={styles.image} />

          <Button title="Close Modal" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200, // Set the width of the image
    height: 200, // Set the height of the image
    marginBottom: 20, // Space between image and button
    borderRadius: 10, // Optional: Rounded corners for the image
  },
});

export default ModalComponent;