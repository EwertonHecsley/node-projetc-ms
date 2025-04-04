import 'dotenv/config'
import app from "./app";
import EnvironmentValidator from './EnviromentValidate';


const envValidator = new EnvironmentValidator();

envValidator.validateEnvironmentVariables();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

