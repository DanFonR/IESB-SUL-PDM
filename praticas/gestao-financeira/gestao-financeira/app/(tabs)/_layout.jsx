import { Tabs, useRouter } from 'expo-router';
import colors from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
// eslint-disable-next-line no-unused-vars
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import { MoneyContext } from '../../contexts/GlobalState';

/**
 * @description Layout das abas do aplicativo após login
 */
export default function TabsLayout() {
    const { logout } = useContext(MoneyContext);
    const router = useRouter();

    const botaoCancelar = { text: "Cancelar", style: "cancel" };
    const botaoSair = {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
            await logout();
            router.replace("/login");
        },
    };

    const handleLogout = () => {
        Alert.alert(
            "Sair",
            "Deseja encerrar a sessão?",
            [botaoCancelar, botaoSair]
        );
    };

    /** Header global para fazer logout */
    const headerRight = () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <MaterialIcons name="logout" size={22} color={colors.primaryContrast} />
        </TouchableOpacity>
    );

    return (
        <Tabs screenOptions={{...tabsScreenOptions, headerRight}}>
            <Tabs.Screen name="index" options={screensOptions.index} />
            <Tabs.Screen name="categories" options={screensOptions.categories} />
            <Tabs.Screen name="summary" options={screensOptions.summary} />
            <Tabs.Screen name="add-transactions" options={screensOptions.addTransactions} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    addButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        width: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
    },
    screenTabBar: {
        height: 60,
        paddingTop: 5,
        backgroundColor: colors.background,
    },
    screenHeader: {
        backgroundColor: colors.primary,
    }
});

/** @type { BottomTabNavigationOptions } */
const tabsScreenOptions = {
    headerStyle: styles.screenHeader,
    headerTintColor: colors.primaryContrast,
    headerTitleAlign: 'center',
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.inactive,
    tabBarStyle: styles.screenTabBar,
    tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.8}/>,
    tabBarHideOnKeyboard: true,
};

/** @type { Record<string, BottomTabNavigationOptions> } */
const screensOptions = {
    index: {
        title: 'Transações',
        tabBarIcon: ({ color }) => <MaterialIcons name='attach-money' size={28} color={color} />,
    },
    addTransactions: {
        title: 'Adicionar Transação',
        tabBarLabel: '',
        tabBarIcon: () => (
            <View style={styles.addButton}>
            <MaterialIcons name='add' size={40} color={colors.primaryContrast} />
            </View>
        ),
    },
    summary: {
        title: 'Resumo',
        tabBarIcon: ({ color }) => <MaterialIcons name='pie-chart' size={28} color={color} />,
    },
    categories: {
        title: "Categorias",
        tabBarIcon: ({ color }) => <MaterialIcons name="category" size={26} color={color} />,
    }
};
