import { View } from 'react-native';
import DespesaSumario from './DespesaSumario';
import DespesaLista from './DespesaLista';


export default function DespesaSaida({despesas, periodo}) {
    return (
        <View>
            <DespesaSumario despesas={despesas} periodo={periodo} />
            <DespesaLista despesas={despesas} />
        </View>
    );
}
