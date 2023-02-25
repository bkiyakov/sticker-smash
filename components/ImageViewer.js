import { StyleSheet, Image } from 'react-native';

const ImageViewer = ({ placeholderImageSource, selectedImage, width, height }) => {
	const imageSource = selectedImage !== null ? { uri: selectedImage } : placeholderImageSource;

	return (
		<Image source={imageSource} style={[styles.image, { width: width ?? 320, height: height ?? 440 }]} />
	);
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 18,
  }
});

export default ImageViewer;
