import { ThemedSafeAreaView } from "@/src/components/ThemedSafeArea";
import { ThemedView } from "@/src/components/ThemedView";
import { useThemeSwitcher } from "@/src/context/themeProvider";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { 
    Avatar, 
    Button, 
    Divider, 
    List, 
    Menu, 
    Switch, 
    Text
} from "react-native-paper";

// --- Dados de Exemplo ---
// Você pode buscar isso de uma API ou context futuramente
const EQUIPMENTS = [
    "Empilhadeira A-01",
    "Empilhadeira A-02",
    "Paleteira Elétrica P-05",
    "Coletor de Dados C-12",
];
// -------------------------

export default function Settings() {
    const { theme, toggleTheme } = useThemeSwitcher();

    // Estado para controlar a visibilidade do menu (dropdown)
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    // NOVO: Estado para guardar o equipamento selecionado
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

    const isDarkTheme = theme === 'dark';

    // Função chamada ao selecionar um item do menu
    const handleSelectEquipment = (equipment: string | null) => {
        setSelectedEquipment(equipment);
        closeMenu();
    };

    return (
        <ThemedSafeAreaView>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.profileSection}>
                    <Avatar.Icon icon="account" size={100} />
                </ThemedView>

                {/* Seção de Preferências (Tema) */}
                <List.Section>
                    <List.Subheader>Preferências</List.Subheader>
                    <List.Item
                        title="Tema"
                        description={isDarkTheme ? "Escuro" : "Claro"}
                        left={() => <List.Icon icon="theme-light-dark" />}
                        right={() => (
                            <Switch
                                value={isDarkTheme}
                                onValueChange={toggleTheme}
                            />
                        )}
                    />
                </List.Section>

                {/* Seção de Equipamento (Dropdown) */}
                <List.Section>
                    <List.Subheader>Equipamento em Uso</List.Subheader>
                    
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchorPosition="bottom"
                        style={styles.menuWrapper}
                        
                        // O 'anchor' é o botão que abre o dropdown
                        anchor={
                            <Button
                                onPress={openMenu}
                                mode="outlined" // Estilo de "campo"
                                icon="chevron-down" // Ícone que indica um dropdown
                                style={styles.menuAnchorButton}
                                // Faz o texto do botão alinhar à esquerda
                                contentStyle={styles.menuAnchorContent} 
                            >
                                {/* Mostra o item selecionado ou um placeholder */}
                                {selectedEquipment ?? "Selecionar Equipamento"}
                            </Button>
                        }
                    >
                        {/* Mapeia a lista de equipamentos para Menu.Item */}
                        {EQUIPMENTS.map((equipment) => (
                             <Menu.Item 
                                key={equipment}
                                onPress={() => handleSelectEquipment(equipment)} 
                                title={equipment} 
                                // Ícone opcional para cada item
                                leadingIcon="forklift" 
                            />
                        ))}
                       
                        {/* Opção para limpar a seleção */}
                        <Divider style={styles.divider} />
                        <Menu.Item
                            onPress={() => handleSelectEquipment(null)}
                            title="Nenhum (Desconectar)"
                            leadingIcon="cancel"
                        />
                    </Menu>
                </List.Section>

            </ThemedView>
        </ThemedSafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    // Estilo para o <Button> que serve como âncora
    menuAnchorButton: {
        marginHorizontal: 16, // Alinha com o padding padrão dos List.Item
        marginTop: 8,
    },
    // Estilo para o conteúdo de dentro do <Button>
    menuAnchorContent: {
        // Alinha o texto e o ícone à esquerda, como um <TextInput>
        justifyContent: 'flex-start',
        // Garante que o botão tenha uma largura (implícita)
        flexDirection: 'row-reverse', // Coloca o ícone 'chevron-down' à direita
    },
    // Estilo para o container do Menu (o popup)
    menuWrapper: {
        marginTop: 52, // Ajuste fino da posição vertical do popup
        marginHorizontal: 16,
    },
    divider: {
        marginVertical: 4,
    }
});