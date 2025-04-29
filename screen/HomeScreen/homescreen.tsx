import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Menu } from 'lucide-react-native'; // hoặc bạn dùng icon nào cũng được
import { useRouter } from 'expo-router'; // nếu bạn dùng expo-router

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white pt-12 px-4">
            {/* Header */}
            <View className="flex-row items-center justify-between">
                {/* Menu icon */}
                <TouchableOpacity onPress={() => console.log('Open menu')}>
                    <Menu size={28} color="#000" />
                </TouchableOpacity>

                {/* Logo */}
                <Image
                    source={require('../../assets/logo.png')} // thay đường dẫn logo nhé
                    className="w-24 h-10 object-contain"
                    resizeMode="contain"
                />

                {/* Placeholder để căn giữa logo */}
                <View style={{ width: 28 }} />
            </View>

            {/* Nội dung chính */}
            <View className="flex-1 justify-center items-center">
                <Text className="text-xl text-center font-semibold mb-4">
                    Pick Parts. Build Your PC. Compare and Share.
                </Text>

                {/* Button */}
                <TouchableOpacity
                    onPress={() => router.push('/select-parts')}
                    className="bg-blue-500 px-6 py-3 rounded-full"
                >
                    <Text className="text-white font-bold text-lg">
                        Get Started
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
