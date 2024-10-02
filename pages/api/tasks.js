import db from '../../utils/db';
import '../../styles/styles.css';
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await db.query('SELECT * FROM tasks ORDER BY priority ASC, due_date ASC');
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
      }
      break;

    case 'POST':
      try {
        const { title, description, due_date, category, priority } = req.body;
        const result = await db.query(
          'INSERT INTO tasks (title, description, due_date, category, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [title, description, due_date, category, priority]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
      }
      break;

    case 'PUT': // For task updating and completion
      try {
        const { id, title, description, due_date, category, priority, completed } = req.body;

        // Update only the fields that are provided (e.g., when marking as completed, other fields can be null)
        const result = await db.query(
          'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), due_date = COALESCE($3, due_date), category = COALESCE($4, category), priority = COALESCE($5, priority), completed = COALESCE($6, completed) WHERE id=$7 RETURNING *',
          [title, description, due_date, category, priority, completed, id]
        );

        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
      }
      break;
    

    case 'DELETE':
      try {
        const { id } = req.body;
        await db.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(200).json({ message: 'Task deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}