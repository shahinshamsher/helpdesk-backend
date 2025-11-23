require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
connectDB();

// Restrict CORS to the deployed frontend (Vercel) and local dev (Vite)
const allowedOrigins = [
	'https://helpdeskcrm-service.vercel.app',
	'http://localhost:5173',
	'https://helpdesk-backend-90tl.onrender.com/api'
];
app.use(cors({
	origin: function (origin, callback) {
		// allow requests with no origin (like curl, Postman, or server-to-server)
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) !== -1) {
			return callback(null, true);
		}
		return callback(new Error('CORS policy: This origin is not allowed'));
	}
}));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => res.send('Helpdesk API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
