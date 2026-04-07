import DespesaSaida from '../components/despesa/DespesaSaida';


export default function DespesasRecente() {
    function filtrarUltimos7Dias(despesas) {
        const [hoje, semanaPassada] = [new Date(), new Date()];

        semanaPassada.setDate(hoje.getDate() - 7);

        return despesas.filter(
            despesa => semanaPassada <= despesa.data && despesa.data <= hoje
        );
    }

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
        <DespesaSaida
            despesas={filtrarUltimos7Dias(DUMMY_DESPESAS)}
            periodo='Últimos 7 dias'
        />
    );
}
