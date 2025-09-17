import React from 'react'
import './Home.css'
import { useEffect } from 'react'

function Home() {
    const [tarefa, setTarefa] = React.useState([]);
    const [selecionadas, setSelecionadas] = React.useState({});
    const [resultado, setResultado] = React.useState(null);
    const [assunto, setAssunto] = React.useState("Matematica");
    const [quantidade_questoes, setQuantidade_questoes] = React.useState(5);
    const [dificuldade, setDificuldade] = React.useState("Facil");
    const [tipos_permitidos, setTipos_permitidos] = React.useState(["Multipla Escolha", "Verdadeiro ou Falso"]);
    const [idioma, setIdioma] = React.useState("Portugues");
    const [carregando, setCarregando] = React.useState(false);

    async function handleChangeAssunto(event) {
        event.preventDefault();
        setCarregando(true);
        try {
            const response = await fetch('hhttps://quizai-backend-ulgj.onrender.com/gerar_quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    assunto: assunto,
                    quantidade_questoes: quantidade_questoes,
                    dificuldade: dificuldade,
                    tipos_permitidos: tipos_permitidos,
                    idioma: idioma
                })
            });
            const data = await response.json();
            if (data) {
                setTarefa(data.questions);
            } else {
                setTarefa([]);
            }
            setSelecionadas({}); // Limpa seleção ao gerar novas perguntas
            setResultado(null); // Limpa resultado ao gerar novas perguntas
            setCarregando(false);
            console.log(data);
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }
    return (
        <div id='content'>
            <div id='slide'>
                <h1>Gerador de Quiz com IA</h1>
                <form id='form' action="">
                    <div className='input-group'>
                        <p>Assunto:</p>
                        <input value={assunto} onChange={e => setAssunto(e.target.value)} type="text" />
                    </div>
                    <div id='grid'>
                        <p>Dificuldade</p>
                        <p>Perguntas</p>
                        <input value={dificuldade} onChange={e => setDificuldade(e.target.value)} type="text" />
                        <input value={quantidade_questoes} onChange={e => setQuantidade_questoes(e.target.value)} type="number" />
                    </div>
                    <button onClick={(e) => handleChangeAssunto(e)} id='btn-confirmar'>Gerar</button>
                </form>
            </div>
            <div id='quiz'>
                {carregando && (
                <div id="loading-overlay">
                    <h2>Carregando Conteúdo</h2>
                    <div className="spinner"></div>
                </div>
            )}
                {tarefa.map((item, index) => (
                    <div key={index} className='questao'>
                        <h2>Questão: {item.id}</h2>
                        <p>{item.prompt}</p>
                        {item.choices.map((choice, cIndex) => (
                            <div
                                key={cIndex}
                                className={`choice-box${selecionadas[item.id] === cIndex ? ' selected' : ''}`}
                                onClick={() => setSelecionadas(prev => ({ ...prev, [item.id]: cIndex }))}
                                style={{ cursor: 'pointer', margin: '8px 0' }}
                            >
                                {choice}
                            </div>
                        ))}
                    </div>
                ))}
                <button className={tarefa.length === 0 ? 'disabled' : 'btn-concluir'}
                onClick={() => {
                    let acertos = 0;
                    let erros = 0;
                    const detalhes = tarefa.map((item) => {
                        const correta = item.answer_index;
                        const marcada = selecionadas[item.id];
                        const acertou = marcada === correta;
                        if (acertou) acertos++;
                        else erros++;
                        return {
                            id: item.id,
                            acertou,
                            correta: item.choices[correta],
                            marcada: marcada !== undefined ? item.choices[marcada] : null
                        };
                    });
                    setResultado({ acertos, erros, detalhes });
                }}
                style={{marginTop: 24, marginBottom: 32 }}
            >Concluir</button>
            {resultado && (
                <div style={{marginTop: 32, background: '#222', borderRadius: 8, marginBottom: 32}}>
                    <h3>Resultado</h3>
                    <p>Acertos: {resultado.acertos} | Erros: {resultado.erros}</p>
                    <ul>
                        {resultado.detalhes.map((det, i) => (
                            <li key={i} style={{color: det.acertou ? '#4caf50' : '#ff5252'}}>
                                Questão {det.id}: {det.acertou ? 'Acertou' : 'Errou'}
                                { !det.acertou && (
                                    <span> (Correta: {det.correta}{det.marcada ? ", Sua: " + det.marcada : ''})</span>
                                    
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            </div>
        </div>
    )
}

export default Home;