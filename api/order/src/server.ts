import 'dotenv/config';
import app from ".";

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Order service is running on port ${PORT}`);
});

