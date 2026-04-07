import { FlatList } from 'react-native';
import DespesaItem from './DespesaItem';

export default function DespesaLista({despesas}) {
    return (
        <FlatList
            data={despesas}
            renderItem={DespesaItem}
            keyExtractor={(item) => item.id}
        />
    );
}
