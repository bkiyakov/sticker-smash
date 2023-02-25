import { View, Image } from "react-native";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, interpolate } from "react-native-reanimated";
import { TapGestureHandler, PanGestureHandler } from "react-native-gesture-handler";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

const EmojiSticker = ({ stickerSource, imageSize, boundX, boundY }) => {
	// Using TapGestureHandler adn double tap to scale emoji
	const scaleImage = useSharedValue(imageSize);

	const onDoubleTap = useAnimatedGestureHandler({
		onActive: () => {
			if (scaleImage.value) {
				scaleImage.value = scaleImage.value * 2;
			}
		}
	});

	const imageStyle = useAnimatedStyle(() => {
		return {
			width: withSpring(scaleImage.value),
			height: withSpring(scaleImage.value),
		};
	});

	// Using PanGestureHandler to drag emoji
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const sharedBoundX = useSharedValue(boundX);
	const sharedBoundY = useSharedValue(boundY);

	const onDrag = useAnimatedGestureHandler({
		onStart: (_, context) => {
			context.translateX = translateX.value;
			context.translateY = translateY.value;
		},
		onActive: (event, context) => {
			translateX.value = event.translationX + context.translateX;
			translateY.value = event.translationY + context.translateY;
		},
	});

	const containerStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: interpolate(
						translateX.value,
						[0, sharedBoundX.value - scaleImage.value],
						[0, sharedBoundX.value - scaleImage.value],
						'clamp')
				},
				{
					translateY: interpolate(
						translateY.value,
						[0, sharedBoundY.value - scaleImage.value],
						[0, sharedBoundY.value - scaleImage.value],
						'clamp')
				}
			]
		};
	});

	return (
		<PanGestureHandler onGestureEvent={onDrag}>
			<AnimatedView style={[containerStyle, { top: -440 }]}>
				<TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
					<AnimatedImage
						source={stickerSource}
						resizeMode="contain"
						style={[imageStyle, { width: imageSize, height: imageSize }]}
					/>
				</TapGestureHandler>
			</AnimatedView>
		</PanGestureHandler>
	);
}

export default EmojiSticker;
