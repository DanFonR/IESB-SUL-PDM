import DespesaSaida from '../components/despesa/DespesaSaida';

export default function TodasDespesas() {
    /** @param {number} dias */
    const diasAtras = (dias) => {
        const data = new Date();
        data.setDate(data.getDate() - dias);

        return data;
    };

    const DUMMY_DESPESAS = [
        {
            id: '1',
            descricao: 'Conta de Luz',
            valor: 100.99,
            data: diasAtras(0)
        },
        {
            id: '2',
            descricao: 'Conta de Água',
            valor: 40.99,
            data: diasAtras(5)
        },
    ];

    return (
        <DespesaSaida despesas={DUMMY_DESPESAS} periodo='Total' />
    );
}