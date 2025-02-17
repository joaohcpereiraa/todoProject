import { useState } from 'react';

function TodoList() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    if (!title.trim()) {
      setError('O título não pode ser vazio.');
      return;
    }
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar a tarefa');
      }

      const novaTask = await response.json();

      // Atualiza a lista de tarefas com a nova task
      setTasks((prevTasks) => [...prevTasks, novaTask]);
      setTitle(''); // limpa o campo de input
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da tarefa"
        />
        <button type="submit">Adicionar Tarefa</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
