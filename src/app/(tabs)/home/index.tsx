import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { ThemedView } from "@/src/components/ThemedView";
import { RelativePathString, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Card, Text, Icon } from "react-native-paper";

interface Operation {
    label: string;
    path: string;
    icon: string;
}

export default function Home() {
    const { push } = useRouter();

    const operations: Operation[] = [
        {
            label: "Armazenagem",
            icon: "warehouse",
            path: "/armazenagem"
        },
        {
            label: "Recebimento",
            icon: "inbox-arrow-down",
            path: "/recebimento"
        },
        {
            label: "Separação",
            icon: "package-variant-closed",
            path: "/separacao"
        },
        {
            label: "Expedição",
            icon: "truck-fast",
            path: "/expedicao"
        },
        {
            label: "Inventário",
            icon: "clipboard-text-search",
            path: "/inventario"
        },
    ]

    return (
        <ThemedSafeAreaView>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                {operations.length > 0 && operations.map((operation) => (
                    <Card
                        key={operation.path}
                        onPress={() => push(operation.path as RelativePathString)}
                        style={styles.card}
                        mode="elevated"
                    >
                        <Card.Content style={styles.cardContent}>
                            <Icon source={operation.icon} size={32} />
                            <Text variant="titleMedium" style={styles.labelText}>
                                {operation.label}
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </ThemedSafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 16,
        gap: 16,
    },
    card: {
        width: "45%",
        height: 120,
        justifyContent: 'center',
    },
    cardContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    labelText: {
        textAlign: 'center',
    }
});