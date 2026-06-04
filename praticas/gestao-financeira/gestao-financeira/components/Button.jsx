import { StyleSheet, Text, TouchableHighlight } from "react-native";
import colors from "../constants/colors";

export default function Button({ children, onPress, disabled = false }) {
    return (
        <TouchableHighlight
            style={[styles.background, disabled && styles.disabled]}
            onPress={(disabled)? undefined : onPress}
            underlayColor={colors.primary}
        >
            <Text style={styles.text}>{children}</Text>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    background: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 44,
        borderRadius: 8,
        backgroundColor: colors.primary,
    },
    text: {
        color: colors.primaryContrast,
        fontSize: 18,
        fontWeight: "600",
    },
    disabled: {
        opacity: 0.6,
    }
});
