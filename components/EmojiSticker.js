import { View, Image } from "react-native";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { TapGestureHandler, PanGestureHandler } from "react-native-gesture-handler";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

const EmojiSticker = ({ stickerSource, imageSize }) => {
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
					translateX: translateX.value
				},
				{
					translateY: translateY.value
				}
			]
		};
	});

	return (
		<PanGestureHandler onGestureEvent={onDrag}>
			<AnimatedView style={[containerStyle, { top: -350 }]}>
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
