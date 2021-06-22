import { app } from './app';

app.listen(3333, () => {
  console.log(`[${new Date().toISOString()}] 🚀 Server is running!`);
});
