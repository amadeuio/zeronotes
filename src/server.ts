import { createApp } from "./app";
import { env } from "./utils/env";

const app = createApp();
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
